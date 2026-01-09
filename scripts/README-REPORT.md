# 📊 Guia para Gerar Relatório Completo do Jogo

## ⚠️ Pré-requisitos

Para gerar o relatório, precisas de ter configurado as credenciais do Firebase Admin SDK.

### Passo 1: Criar ficheiro `.env.local` na raiz do projeto

Cria um ficheiro chamado `.env.local` na raiz do projeto (mesmo nível que `package.json`) com o seguinte conteúdo:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Como obter as credenciais:**

1. Vai ao [Firebase Console](https://console.firebase.google.com/)
2. Seleciona o teu projeto "AlvesBandeira-game"
3. Vai a **Configurações do Projeto** (ícone de engrenagem)
4. Vai ao separador **Contas de Serviço**
5. Clica em **Gerar Nova Chave Privada**
6. Faz download do ficheiro JSON
7. Copia TODO o conteúdo do JSON e cola como uma única linha no `.env.local`

**Exemplo:**
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"alvesbandeira-game","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@alvesbandeira-game.iam.gserviceaccount.com",...}
```

### Passo 2: Executar o script

```bash
node scripts/generate-report.js
```

## 📄 O que o relatório inclui:

1. **Utilizadores Autenticados**
   - Total de utilizadores no Firebase Auth
   - Por provider (Google, Email, etc.)
   - Verificados vs Não verificados
   - Distribuição por mês de criação

2. **Perfis de Utilizadores**
   - Total de perfis criados
   - Com username, email, consentimento
   - Amostra de perfis

3. **Submissões de Scores**
   - Total de submissões
   - Jogadores únicos
   - Estatísticas (média, mediana, min, max)
   - Distribuição por faixas de pontuação
   - Top 20 jogadores

4. **Análises**
   - Submissões por data
   - Jogadores com múltiplas submissões
   - Telemetria de magic links (se disponível)

## 📁 Onde são guardados os relatórios:

Os relatórios são guardados na pasta `reports/` na raiz do projeto:
- `report-YYYY-MM-DDTHH-MM-SS.json` - Relatório completo em JSON
- `report-YYYY-MM-DDTHH-MM-SS.txt` - Relatório legível em texto

## 🔒 Segurança

⚠️ **IMPORTANTE**: O ficheiro `.env.local` contém credenciais sensíveis. 
- NUNCA faças commit deste ficheiro
- Está já incluído no `.gitignore`
- Mantém-o seguro e privado
