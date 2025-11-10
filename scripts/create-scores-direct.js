const admin = require('firebase-admin');

// Configurar Firebase Admin usando variáveis de ambiente ou ficheiro de credenciais
// IMPORTANTE: NUNCA commitar credenciais no código!
// Usa variáveis de ambiente ou um ficheiro .env.local que está no .gitignore
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('../path/to/serviceAccountKey.json'); // Ajusta o caminho conforme necessário

async function createScoresCollection() {
  console.log('🔄 A criar a coleção scores...');
  
  try {
    // Inicializar Firebase Admin
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    const db = app.firestore();
    
    // Criar um documento de exemplo na coleção scores
    const scoresRef = db.collection('scores');
    
    const exampleScore = {
      uid: "exemplo_uid_123",
      username: "jogador_teste", 
      displayName: "Jogador Teste",
      score: 0,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
    console.log('🎉 O sistema voltará a funcionar normalmente!');
    
    // Fechar a aplicação
    await app.delete();
    
  } catch (error) {
    console.error('❌ Erro ao criar a coleção:', error);
    throw error;
  }
}

// Executar o script
createScoresCollection()
  .then(() => {
    console.log('🎉 Script concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script falhou:', error);
    process.exit(1);
  });









