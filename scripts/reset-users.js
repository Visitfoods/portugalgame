const { getFirestore } = require('../api/_lib/firebaseAdmin');

async function resetUsers() {
  console.log('🔄 A iniciar reset dos utilizadores...');
  
  try {
    const db = getFirestore();
    
    // Contar documentos antes do reset
    const usersSnapshot = await db.collection('users').get();
    const usernamesSnapshot = await db.collection('usernames').get();
    const scoresSnapshot = await db.collection('scores').get();
    
    console.log(`📊 Encontrados:`);
    console.log(`   - ${usersSnapshot.size} utilizadores`);
    console.log(`   - ${usernamesSnapshot.size} usernames`);
    console.log(`   - ${scoresSnapshot.size} pontuações`);
    
    if (usersSnapshot.size === 0 && usernamesSnapshot.size === 0 && scoresSnapshot.size === 0) {
      console.log('✅ Não há dados para eliminar.');
      return;
    }
    
    // Eliminar em lotes (Firestore tem limite de 500 operações por batch)
    const batchSize = 500;
    
    // Eliminar utilizadores
    if (usersSnapshot.size > 0) {
      console.log('🗑️ A eliminar utilizadores...');
      await deleteBatch(db, usersSnapshot.docs, 'users');
    }
    
    // Eliminar usernames
    if (usernamesSnapshot.size > 0) {
      console.log('🗑️ A eliminar usernames...');
      await deleteBatch(db, usernamesSnapshot.docs, 'usernames');
    }
    
    // Eliminar pontuações
    if (scoresSnapshot.size > 0) {
      console.log('🗑️ A eliminar pontuações...');
      await deleteBatch(db, scoresSnapshot.docs, 'scores');
    }
    
    console.log('✅ Reset dos utilizadores concluído com sucesso!');
    console.log('ℹ️ Os utilizadores terão de se registar novamente quando voltarem a jogar.');
    
  } catch (error) {
    console.error('❌ Erro durante o reset:', error);
    throw error;
  }
}

async function deleteBatch(db, docs, collectionName) {
  const batchSize = 500;
  
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    const batchDocs = docs.slice(i, i + batchSize);
    
    batchDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`   ✓ Eliminados ${Math.min(batchSize, docs.length - i)} documentos de ${collectionName}`);
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  resetUsers()
    .then(() => {
      console.log('🎉 Script concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script falhou:', error);
      process.exit(1);
    });
}

module.exports = { resetUsers };









