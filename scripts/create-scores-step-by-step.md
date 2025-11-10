# 🎯 Guia Passo-a-Passo: Criar Coleção `scores`

## 📋 **Instruções Simples e Seguras**

### **Passo 1: Aceder ao Firebase**
1. Vai a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Clica no teu projeto "AlvesBandeira-game"
3. No menu lateral, clica em **"Firestore Database"**

### **Passo 2: Criar Nova Coleção**
1. Clica no botão **"Iniciar coleção"** (Start collection)
2. **Nome da coleção:** `scores` (exatamente assim, em minúsculas)
3. Clica em **"Próximo"**

### **Passo 3: Criar Primeiro Documento**
1. **ID do documento:** Clica em **"Código automático"** ✅
2. Clica em **"Próximo"**

### **Passo 4: Adicionar Campos (UM POR VEZ)**

#### **Campo 1: `uid`**
- **Campo:** `uid`
- **Tipo:** `string`
- **Valor:** `exemplo_uid_123`
- Clica em **"Adicionar campo"**

#### **Campo 2: `username`**
- **Campo:** `username`
- **Tipo:** `string`
- **Valor:** `jogador_teste`
- Clica em **"Adicionar campo"**

#### **Campo 3: `displayName`**
- **Campo:** `displayName`
- **Tipo:** `string`
- **Valor:** `Jogador Teste`
- Clica em **"Adicionar campo"**

#### **Campo 4: `score`**
- **Campo:** `score`
- **Tipo:** `number` (muda de string para number)
- **Valor:** `0`
- Clica em **"Adicionar campo"**

#### **Campo 5: `timestamp`**
- **Campo:** `timestamp`
- **Tipo:** `timestamp` (muda de string para timestamp)
- **Valor:** Deixa o padrão (data atual)
- Clica em **"Adicionar campo"**

#### **Campo 6: `gameData`**
- **Campo:** `gameData`
- **Tipo:** `map` (muda de string para map)
- **Valor:** Deixa vazio
- Clica em **"Adicionar campo"**

### **Passo 5: Finalizar**
1. Clica em **"Salvar"** ✅
2. A coleção `scores` será criada!

### **Passo 6: Limpeza (Opcional)**
- Podes eliminar o documento de exemplo depois
- O importante é que a coleção exista com a estrutura correta

---

## ✅ **Verificação Final**

Depois de criares, deves ver:
- Coleção `scores` na lista de coleções
- Com um documento de exemplo
- Com os 6 campos: `uid`, `username`, `displayName`, `score`, `timestamp`, `gameData`

## 🎉 **Pronto!**

O sistema voltará a funcionar normalmente e os novos scores serão guardados automaticamente!









