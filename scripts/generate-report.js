const { getFirestore, getAuth } = require('../api/_lib/firebaseAdmin');
const fs = require('fs');
const path = require('path');

// Função para formatar data
function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleString('pt-PT');
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString('pt-PT');
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp).toLocaleString('pt-PT');
  }
  return String(timestamp);
}

// Função para calcular estatísticas de scores
function calculateScoreStats(scores) {
  if (scores.length === 0) {
    return {
      total: 0,
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      top10: [],
      distribution: {}
    };
  }

  const scoreValues = scores.map(s => s.score || 0).filter(s => typeof s === 'number' && !isNaN(s));
  scoreValues.sort((a, b) => b - a);

  const sum = scoreValues.reduce((a, b) => a + b, 0);
  const average = sum / scoreValues.length;
  const median = scoreValues.length % 2 === 0
    ? (scoreValues[scoreValues.length / 2 - 1] + scoreValues[scoreValues.length / 2]) / 2
    : scoreValues[Math.floor(scoreValues.length / 2)];

  // Distribuição por faixas
  const distribution = {
    '0-100': 0,
    '101-500': 0,
    '501-1000': 0,
    '1001-2000': 0,
    '2001-5000': 0,
    '5000+': 0
  };

  scoreValues.forEach(score => {
    if (score <= 100) distribution['0-100']++;
    else if (score <= 500) distribution['101-500']++;
    else if (score <= 1000) distribution['501-1000']++;
    else if (score <= 2000) distribution['1001-2000']++;
    else if (score <= 5000) distribution['2001-5000']++;
    else distribution['5000+']++;
  });

  return {
    total: scoreValues.length,
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: scoreValues[scoreValues.length - 1] || 0,
    max: scoreValues[0] || 0,
    top10: scoreValues.slice(0, 10),
    distribution
  };
}

// Função para deduplicar jogadores por username ou uid
function getUniquePlayers(scores) {
  const seen = new Map();
  const unique = [];

  for (const score of scores) {
    const key = (score.username || '').toLowerCase() || score.uid || '';
    if (key && !seen.has(key)) {
      seen.set(key, true);
      unique.push({
        uid: score.uid,
        username: score.username || 'Sem username',
        displayName: score.displayName,
        bestScore: score.score,
        totalSubmissions: 1
      });
    } else if (key) {
      // Atualizar melhor score
      const existing = unique.find(u => 
        (u.username || '').toLowerCase() === key || u.uid === score.uid
      );
      if (existing && score.score > (existing.bestScore || 0)) {
        existing.bestScore = score.score;
      }
      if (existing) {
        existing.totalSubmissions++;
      }
    }
  }

  // Contar submissões totais por jogador
  const playerSubmissions = new Map();
  scores.forEach(s => {
    const key = (s.username || '').toLowerCase() || s.uid || '';
    if (key) {
      playerSubmissions.set(key, (playerSubmissions.get(key) || 0) + 1);
    }
  });

  unique.forEach(u => {
    const key = (u.username || '').toLowerCase() || u.uid || '';
    u.totalSubmissions = playerSubmissions.get(key) || 1;
  });

  return unique.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
}

async function generateReport() {
  console.log('📊 A gerar relatório completo do jogo...\n');
  
  const db = getFirestore();
  const auth = getAuth();
  
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {},
    users: {},
    scores: {},
    analytics: {}
  };

  try {
    // 1. Utilizadores autenticados (Firebase Auth)
    console.log('🔍 A ler utilizadores autenticados...');
    let authUsers = [];
    let nextPageToken;
    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      authUsers = authUsers.concat(listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    const authStats = {
      total: authUsers.length,
      byProvider: {},
      byCreationDate: {},
      verified: 0,
      unverified: 0
    };

    authUsers.forEach(user => {
      // Por provider
      const providers = user.providerData.map(p => p.providerId);
      providers.forEach(p => {
        authStats.byProvider[p] = (authStats.byProvider[p] || 0) + 1;
      });

      // Por data de criação
      if (user.metadata.creationTime) {
        const date = new Date(user.metadata.creationTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        authStats.byCreationDate[monthKey] = (authStats.byCreationDate[monthKey] || 0) + 1;
      }

      // Verificados
      if (user.emailVerified) {
        authStats.verified++;
      } else {
        authStats.unverified++;
      }
    });

    report.users.auth = {
      total: authStats.total,
      byProvider: authStats.byProvider,
      byCreationMonth: authStats.byCreationDate,
      verified: authStats.verified,
      unverified: authStats.unverified,
      sample: authUsers.slice(0, 5).map(u => ({
        uid: u.uid,
        email: u.email,
        providers: u.providerData.map(p => p.providerId),
        createdAt: formatDate(u.metadata.creationTime),
        lastSignIn: formatDate(u.metadata.lastSignInTime),
        verified: u.emailVerified
      }))
    };

    console.log(`   ✅ ${authStats.total} utilizadores autenticados encontrados`);

    // 2. Coleção 'users' (perfis)
    console.log('🔍 A ler perfis de utilizadores...');
    const usersSnapshot = await db.collection('users').get();
    const userProfiles = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    report.users.profiles = {
      total: userProfiles.length,
      withUsername: userProfiles.filter(u => u.username).length,
      withEmail: userProfiles.filter(u => u.email).length,
      withConsent: userProfiles.filter(u => u.consent).length,
      sample: userProfiles.slice(0, 10).map(u => ({
        uid: u.uid,
        username: u.username,
        email: u.email,
        displayName: u.displayName,
        createdAt: formatDate(u.createdAt),
        bestScore: u.bestScore,
        totalGames: u.totalGames
      }))
    };

    console.log(`   ✅ ${userProfiles.length} perfis encontrados`);

    // 3. Coleção 'scores' (submissões)
    console.log('🔍 A ler submissões de scores...');
    const scoresSnapshot = await db.collection('scores').get();
    const allScores = scoresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const scoreStats = calculateScoreStats(allScores);
    const uniquePlayers = getUniquePlayers(allScores);

    // Análise temporal
    const scoresByDate = {};
    allScores.forEach(score => {
      const date = formatDate(score.timestamp);
      if (date && date !== 'N/A') {
        const dateKey = date.split(',')[0]; // Apenas a data
        scoresByDate[dateKey] = (scoresByDate[dateKey] || 0) + 1;
      }
    });

    // Scores por utilizador
    const scoresByUser = {};
    allScores.forEach(score => {
      const key = score.uid || score.username || 'unknown';
      if (!scoresByUser[key]) {
        scoresByUser[key] = [];
      }
      scoresByUser[key].push(score.score || 0);
    });

    const usersWithMultipleScores = Object.keys(scoresByUser).filter(
      key => scoresByUser[key].length > 1
    ).length;

    report.scores = {
      totalSubmissions: allScores.length,
      uniquePlayers: uniquePlayers.length,
      statistics: scoreStats,
      submissionsByDate: scoresByDate,
      usersWithMultipleSubmissions: usersWithMultipleScores,
      topPlayers: uniquePlayers.slice(0, 20).map((p, idx) => ({
        position: idx + 1,
        uid: p.uid,
        username: p.username,
        displayName: p.displayName,
        bestScore: p.bestScore,
        totalSubmissions: p.totalSubmissions
      })),
      sample: allScores.slice(0, 10).map(s => ({
        id: s.id,
        uid: s.uid,
        username: s.username,
        score: s.score,
        timestamp: formatDate(s.timestamp)
      }))
    };

    console.log(`   ✅ ${allScores.length} submissões encontradas`);
    console.log(`   ✅ ${uniquePlayers.length} jogadores únicos identificados`);

    // 4. Coleção 'usernames' (se existir)
    console.log('🔍 A verificar coleção usernames...');
    try {
      const usernamesSnapshot = await db.collection('usernames').get();
      const usernames = usernamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      report.users.usernames = {
        total: usernames.length,
        sample: usernames.slice(0, 10)
      };
      console.log(`   ✅ ${usernames.length} usernames registados`);
    } catch (error) {
      report.users.usernames = {
        total: 0,
        error: 'Coleção não encontrada ou erro ao aceder'
      };
      console.log('   ⚠️  Coleção usernames não encontrada ou vazia');
    }

    // 5. Coleção 'magicLinkTelemetry' (se existir)
    console.log('🔍 A verificar telemetria de magic links...');
    try {
      const telemetrySnapshot = await db.collection('magicLinkTelemetry').get();
      const telemetry = telemetrySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const telemetryByEvent = {};
      telemetry.forEach(t => {
        const event = t.event || 'unknown';
        telemetryByEvent[event] = (telemetryByEvent[event] || 0) + 1;
      });

      report.analytics.magicLinkTelemetry = {
        total: telemetry.length,
        byEvent: telemetryByEvent,
        sample: telemetry.slice(0, 10)
      };
      console.log(`   ✅ ${telemetry.length} eventos de telemetria encontrados`);
    } catch (error) {
      report.analytics.magicLinkTelemetry = {
        total: 0,
        error: 'Coleção não encontrada ou erro ao aceder'
      };
      console.log('   ⚠️  Coleção magicLinkTelemetry não encontrada ou vazia');
    }

    // 6. Resumo geral
    report.summary = {
      totalAuthenticatedUsers: authStats.total,
      totalUserProfiles: userProfiles.length,
      totalScoreSubmissions: allScores.length,
      uniquePlayersWithScores: uniquePlayers.length,
      playersWhoSubmitted: uniquePlayers.length,
      averageScore: scoreStats.average,
      highestScore: scoreStats.max,
      playersWithMultipleSubmissions: usersWithMultipleScores,
      dateRange: {
        firstSubmission: allScores.length > 0 
          ? formatDate(allScores[allScores.length - 1]?.timestamp)
          : 'N/A',
        lastSubmission: allScores.length > 0
          ? formatDate(allScores[0]?.timestamp)
          : 'N/A'
      }
    };

    // Gerar relatório em JSON
    const reportDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const jsonPath = path.join(reportDir, `report-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

    // Gerar relatório em texto legível
    const textReport = generateTextReport(report);
    const txtPath = path.join(reportDir, `report-${timestamp}.txt`);
    fs.writeFileSync(txtPath, textReport, 'utf8');

    console.log('\n✅ Relatório gerado com sucesso!');
    console.log(`📄 JSON: ${jsonPath}`);
    console.log(`📄 Texto: ${txtPath}\n`);

    // Mostrar resumo no console
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 RESUMO DO RELATÓRIO');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`👥 Utilizadores Autenticados: ${report.summary.totalAuthenticatedUsers}`);
    console.log(`📋 Perfis Criados: ${report.summary.totalUserProfiles}`);
    console.log(`🎮 Submissões de Scores: ${report.summary.totalScoreSubmissions}`);
    console.log(`🏆 Jogadores Únicos com Scores: ${report.summary.uniquePlayersWithScores}`);
    console.log(`📊 Média de Pontuação: ${report.summary.averageScore.toFixed(2)}`);
    console.log(`⭐ Melhor Pontuação: ${report.summary.highestScore}`);
    console.log(`🔄 Jogadores com Múltiplas Submissões: ${report.summary.playersWithMultipleSubmissions}`);
    console.log('═══════════════════════════════════════════════════════\n');

    return report;

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    throw error;
  }
}

function generateTextReport(report) {
  let text = '';
  
  text += '═══════════════════════════════════════════════════════════════════════════════\n';
  text += '                    RELATÓRIO COMPLETO DO JOGO\n';
  text += '                    Alves Bandeira - Apanha os Sabores\n';
  text += `                    Gerado em: ${formatDate(new Date())}\n`;
  text += '═══════════════════════════════════════════════════════════════════════════════\n\n';

  // Resumo
  text += '📊 RESUMO GERAL\n';
  text += '───────────────────────────────────────────────────────────────────────────────\n';
  text += `Utilizadores Autenticados:        ${report.summary.totalAuthenticatedUsers}\n`;
  text += `Perfis de Utilizadores:           ${report.summary.totalUserProfiles}\n`;
  text += `Total de Submissões:              ${report.summary.totalScoreSubmissions}\n`;
  text += `Jogadores Únicos com Scores:      ${report.summary.uniquePlayersWithScores}\n`;
  text += `Média de Pontuação:               ${report.summary.averageScore.toFixed(2)}\n`;
  text += `Melhor Pontuação:                 ${report.summary.highestScore}\n`;
  text += `Jogadores com Múltiplas Submissões: ${report.summary.playersWithMultipleSubmissions}\n`;
  text += `Primeira Submissão:               ${report.summary.dateRange.firstSubmission}\n`;
  text += `Última Submissão:                 ${report.summary.dateRange.lastSubmission}\n\n`;

  // Utilizadores
  text += '👥 UTILIZADORES AUTENTICADOS (Firebase Auth)\n';
  text += '───────────────────────────────────────────────────────────────────────────────\n';
  text += `Total: ${report.users.auth.total}\n`;
  text += `Verificados: ${report.users.auth.verified}\n`;
  text += `Não Verificados: ${report.users.auth.unverified}\n`;
  text += `Por Provider:\n`;
  Object.entries(report.users.auth.byProvider).forEach(([provider, count]) => {
    text += `  - ${provider}: ${count}\n`;
  });
  text += '\n';

  // Perfis
  text += '📋 PERFIS DE UTILIZADORES\n';
  text += '───────────────────────────────────────────────────────────────────────────────\n';
  text += `Total: ${report.users.profiles.total}\n`;
  text += `Com Username: ${report.users.profiles.withUsername}\n`;
  text += `Com Email: ${report.users.profiles.withEmail}\n`;
  text += `Com Consentimento: ${report.users.profiles.withConsent}\n\n`;

  // Scores
  text += '🎮 SUBMISSÕES DE SCORES\n';
  text += '───────────────────────────────────────────────────────────────────────────────\n';
  text += `Total de Submissões: ${report.scores.totalSubmissions}\n`;
  text += `Jogadores Únicos: ${report.scores.uniquePlayers}\n`;
  text += `Estatísticas:\n`;
  text += `  - Média: ${report.scores.statistics.average}\n`;
  text += `  - Mediana: ${report.scores.statistics.median}\n`;
  text += `  - Mínimo: ${report.scores.statistics.min}\n`;
  text += `  - Máximo: ${report.scores.statistics.max}\n`;
  text += `Distribuição por Faixas:\n`;
  Object.entries(report.scores.statistics.distribution).forEach(([range, count]) => {
    text += `  - ${range}: ${count}\n`;
  });
  text += '\n';

  // Top 20 Jogadores
  text += '🏆 TOP 20 JOGADORES\n';
  text += '───────────────────────────────────────────────────────────────────────────────\n';
  report.scores.topPlayers.forEach(player => {
    text += `${String(player.position).padStart(2, ' ')}. ${player.username.padEnd(20, ' ')} | Score: ${String(player.bestScore).padStart(6, ' ')} | Submissões: ${player.totalSubmissions}\n`;
  });
  text += '\n';

  text += '═══════════════════════════════════════════════════════════════════════════════\n';
  text += 'Fim do Relatório\n';
  text += '═══════════════════════════════════════════════════════════════════════════════\n';

  return text;
}

// Executar
if (require.main === module) {
  generateReport()
    .then(() => {
      console.log('✅ Processo concluído!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { generateReport };
