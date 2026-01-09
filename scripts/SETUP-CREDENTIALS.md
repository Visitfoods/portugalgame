# 🔐 Guia Passo a Passo: Configurar Credenciais do Firebase

## 📋 O que precisas

Para gerar o relatório, precisas das credenciais do **Firebase Admin SDK** (Service Account).

---

## 🚀 Passo 1: Obter as Credenciais do Firebase

### 1.1. Aceder ao Firebase Console

1. Abre o browser e vai a: **https://console.firebase.google.com/**
2. Faz login com a tua conta Google
3. Seleciona o projeto **"AlvesBandeira-game"** (ou o nome do teu projeto)

### 1.2. Ir às Configurações do Projeto

1. No canto superior esquerdo, clica no **ícone de engrenagem** ⚙️ ao lado de "Project Overview"
2. Clica em **"Project settings"** (Configurações do projeto)

### 1.3. Aceder às Contas de Serviço

1. No menu superior, clica no separador **"Service accounts"** (Contas de serviço)
2. Deves ver uma secção chamada **"Firebase Admin SDK"**

### 1.4. Gerar Nova Chave Privada

1. Clica no botão **"Generate new private key"** (Gerar nova chave privada)
2. Aparece um aviso - clica em **"Generate key"** (Gerar chave)
3. **IMPORTANTE**: Um ficheiro JSON será descarregado automaticamente
   - Guarda este ficheiro num local seguro
   - **NUNCA** faças commit deste ficheiro no Git!

---

## 📝 Passo 2: Criar o Ficheiro .env.local

### 2.1. Abrir o Ficheiro JSON Descarregado

1. Abre o ficheiro JSON que descarregaste (ex: `alvesbandeira-game-xxxxx-firebase-adminsdk-xxxxx.json`)
2. Copia **TODO** o conteúdo do ficheiro

### 2.2. Criar o Ficheiro .env.local

1. Na raiz do projeto (mesmo nível que `package.json`), cria um ficheiro chamado **`.env.local`**
2. Abre o ficheiro e adiciona esta linha:

```env
FIREBASE_SERVICE_ACCOUNT_JSON=
```

### 2.3. Colar o JSON como Uma Única Linha

**IMPORTANTE**: O JSON deve estar numa única linha, sem quebras de linha!

**Formato correto:**
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"alvesbandeira-game","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@alvesbandeira-game.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40alvesbandeira-game.iam.gserviceaccount.com"}
```

**Como fazer:**
1. Abre o ficheiro JSON descarregado
2. Seleciona TODO o conteúdo (Ctrl+A)
3. Copia (Ctrl+C)
4. No ficheiro `.env.local`, cola o conteúdo DEPOIS do `=` na linha `FIREBASE_SERVICE_ACCOUNT_JSON=`
5. **Remove todas as quebras de linha** - deve ficar tudo numa única linha
6. Guarda o ficheiro

---

## ✅ Passo 3: Verificar a Configuração

Depois de criares o ficheiro `.env.local`, podes verificar se está correto executando:

```bash
node scripts/verify-credentials.js
```

Este script vai verificar se as credenciais estão corretas sem fazer nada com os dados.

---

## 🎯 Passo 4: Gerar o Relatório

Depois de configurado, podes gerar o relatório:

```bash
node scripts/generate-report.js
```

O relatório será guardado na pasta `reports/`:
- `report-YYYY-MM-DDTHH-MM-SS.json` - Relatório completo em JSON
- `report-YYYY-MM-DDTHH-MM-SS.txt` - Relatório legível em texto

---

## ⚠️ Problemas Comuns

### Erro: "Missing required env var FIREBASE_SERVICE_ACCOUNT_JSON"
- **Solução**: Verifica se o ficheiro `.env.local` existe na raiz do projeto
- Verifica se a variável está escrita corretamente (sem espaços antes ou depois do `=`)

### Erro: "Invalid JSON"
- **Solução**: O JSON deve estar numa única linha
- Remove todas as quebras de linha do JSON
- Verifica se não há caracteres especiais que precisem de escape

### Erro: "Permission denied"
- **Solução**: Verifica se a Service Account tem permissões no Firebase
- Vai ao Firebase Console > IAM & Admin e verifica as permissões

---

## 🔒 Segurança

⚠️ **IMPORTANTE**:
- O ficheiro `.env.local` está no `.gitignore` - não será commitado
- **NUNCA** partilhes este ficheiro ou as credenciais
- Se comprometeres as credenciais, gera novas imediatamente no Firebase Console

---

## 💡 Dica

Se tiveres problemas a colar o JSON numa única linha, podes usar este comando PowerShell (na raiz do projeto):

```powershell
$json = Get-Content "caminho/para/o/ficheiro.json" -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
"FIREBASE_SERVICE_ACCOUNT_JSON=$json" | Out-File -FilePath ".env.local" -Encoding utf8
```

Substitui `"caminho/para/o/ficheiro.json"` pelo caminho real do ficheiro JSON descarregado.
