const { getFirestore } = require('../api/_lib/firebaseAdmin');

async function createScoresCollection() {
  console.log('🔄 A criar a coleção scores...');
  
  try {
    const db = getFirestore();
    
    // Criar um documento de exemplo na coleção scores
    const scoresRef = db.collection('scores');
    
    const exampleScore = {
      uid: "exemplo_uid_123",
      username: "jogador_teste", 
      displayName: "Jogador Teste",
      score: 0,
      timestamp: new Date(),
      gameData: {
        level: 1,
        difficulty: "normal"
      }
    };
    
    // Adicionar o documento de exemplo
    await scoresRef.add(exampleScore);
    
    console.log('✅ Coleção scores criada com sucesso!');
    console.log('📋 Estrutura criada:');
    console.log('   - uid (string)');
    console.log('   - username (string)');
    console.log('   - displayName (string)');
    console.log('   - score (number)');
    console.log('   - timestamp (timestamp)');
    console.log('   - gameData (map)');
    console.log('');
    console.log('🗑️ Podes eliminar o documento de exemplo depois - o importante é que a coleção exista!');
    
  } catch (error) {
    console.error('❌ Erro ao criar a coleção:', error);
    throw error;
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  createScoresCollection()
    .then(() => {
      console.log('🎉 Script concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script falhou:', error);
      process.exit(1);
    });
}

module.exports = { createScoresCollection };









