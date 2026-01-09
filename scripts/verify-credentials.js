const { getFirestore, getAuth } = require('../api/_lib/firebaseAdmin');

async function verifyCredentials() {
  console.log('🔍 A verificar credenciais do Firebase...\n');
  
  try {
    // Tentar conectar ao Firestore
    console.log('📡 A conectar ao Firestore...');
    const db = getFirestore();
    
    // Tentar fazer uma query simples para verificar a conexão
    const testCollection = db.collection('scores');
    const testSnapshot = await testCollection.limit(1).get();
    
    console.log('✅ Conexão ao Firestore estabelecida com sucesso!');
    console.log(`   📊 Coleção 'scores' acessível (${testSnapshot.size} documento(s) encontrado(s) no teste)\n`);
    
    // Tentar conectar ao Auth
    console.log('🔐 A verificar acesso ao Firebase Auth...');
    const auth = getAuth();
    
    // Tentar listar utilizadores (apenas 1 para teste)
    const listUsersResult = await auth.listUsers(1);
    console.log('✅ Acesso ao Firebase Auth verificado com sucesso!');
    console.log(`   👥 Total de utilizadores autenticados: ${listUsersResult.users.length} (amostra de 1)\n`);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ CREDENCIAIS VÁLIDAS E FUNCIONAIS!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🎉 Podes agora executar o script de relatório:');
    console.log('   node scripts/generate-report.js\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERRO AO VERIFICAR CREDENCIAIS:\n');
    
    if (error.message.includes('Missing required env var')) {
      console.error('   🔴 Ficheiro .env.local não encontrado ou variável em falta');
      console.error('   📝 Cria um ficheiro .env.local na raiz do projeto');
      console.error('   📖 Segue as instruções em: scripts/SETUP-CREDENTIALS.md\n');
    } else if (error.message.includes('JSON')) {
      console.error('   🔴 Erro ao fazer parse do JSON');
      console.error('   📝 Verifica se o JSON está numa única linha no .env.local');
      console.error('   📖 Segue as instruções em: scripts/SETUP-CREDENTIALS.md\n');
    } else if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
      console.error('   🔴 Erro de permissões');
      console.error('   📝 Verifica se a Service Account tem permissões no Firebase Console');
      console.error('   🔗 Vai a: https://console.firebase.google.com/\n');
    } else {
      console.error('   🔴 Erro:', error.message);
      console.error('   📖 Consulta: scripts/SETUP-CREDENTIALS.md para ajuda\n');
    }
    
    console.error('Detalhes técnicos:');
    console.error(error);
    
    return false;
  }
}

// Executar
if (require.main === module) {
  verifyCredentials()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = { verifyCredentials };
