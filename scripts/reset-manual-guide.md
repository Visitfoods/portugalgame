# 🔄 Guia para Reset Manual dos Utilizadores

## Método 1: Via Firebase Console (Recomendado)

### Passo 1: Aceder ao Firebase Console
1. Vai a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Seleciona o teu projeto "AlvesBandeira-game"
3. No menu lateral, clica em **"Firestore Database"**

### Passo 2: Eliminar Coleções
Vais eliminar estas 3 coleções:

#### 🗑️ Coleção `users`
1. Na Firestore, clica na coleção **"users"**
2. Seleciona todos os documentos (Ctrl+A)
3. Clica no ícone da lixeira (🗑️)
4. Confirma a eliminação

#### 🗑️ Coleção `usernames` 
1. Clica na coleção **"usernames"**
2. Seleciona todos os documentos (Ctrl+A)
3. Clica no ícone da lixeira (🗑️)
4. Confirma a eliminação

#### 🗑️ Coleção `scores`
1. Clica na coleção **"scores"**
2. Seleciona todos os documentos (Ctrl+A)
3. Clica no ícone da lixeira (🗑️)
4. Confirma a eliminação

### Passo 3: Verificar
- As 3 coleções devem estar vazias
- O sistema continuará a funcionar normalmente
- Os utilizadores terão de se registar novamente

---

## Método 2: Via Firebase CLI (Alternativo)

Se tiveres o Firebase CLI instalado:

```bash
# Instalar Firebase CLI (se não tiveres)
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar (se necessário)
firebase init firestore

# Eliminar coleções via CLI
firebase firestore:delete users --recursive
firebase firestore:delete usernames --recursive  
firebase firestore:delete scores --recursive
```

---

## ⚠️ Importante

- **Backup**: Antes de eliminar, podes exportar os dados se quiseres guardar alguma informação
- **Autenticação**: Os utilizadores continuarão autenticados no Firebase Auth, mas terão de recriar o perfil
- **Funcionamento**: O jogo continuará a funcionar normalmente após o reset
- **Irreversível**: Esta operação não pode ser desfeita

---

## ✅ Após o Reset

Os utilizadores que voltarem a jogar:
1. Terão de fazer login novamente
2. Terão de escolher um novo username
3. Começarão com pontuação 0
4. O sistema funcionará como se fosse a primeira vez

---

## 🔍 Verificação

Para confirmar que o reset foi bem-sucedido:
1. Vai à Firestore Database
2. Verifica que as coleções `users`, `usernames` e `scores` estão vazias
3. Testa o jogo - deve funcionar normalmente
4. Tenta registar um novo utilizador - deve funcionar









