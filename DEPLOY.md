# 🚀 Guia de Deploy - Real-Time Chat

## ⚠️ IMPORTANTE SOBRE ARQUITETURA

Este projeto tem **2 partes separadas**:
- **Frontend** (React + Vite) → Vercel ✅
- **Backend** (Node.js + Socket.io) → Railway (não Vercel!)

**Por que não deploy do backend na Vercel?**  
A Vercel é serverless e não mantém conexões WebSocket persistentes que o Socket.io precisa. Por isso, o backend vai para Railway (grátis e perfeito para Socket.io).

---

## 📋 Passo a Passo Completo

### ✅ PARTE 1: Deploy do Backend (Railway)

#### 1. Criar conta no Railway
- Acesse: https://railway.app
- Faça login com GitHub

#### 2. Criar novo projeto
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Conecte sua conta GitHub e autorize o Railway
4. Selecione o repositório `RealTimeChat`

#### 3. Configurar o projeto
1. Após importar, clique em "Settings"
2. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `node src/app.js`
   - **Environment**: Production

#### 4. Adicionar variáveis de ambiente
No Railway, vá em "Variables" e adicione:

```
DATABASE_URL=postgres://c21c7d3f038722b9467612bab53cd0e7c7b5c28f255906834292bc8d35d56a99:sk_t0NeiUr4T8o3hatCDbS6t@db.prisma.io:5432/postgres?sslmode=require

JWT_SECRET=super_secret_jwt_key_change_in_production_2026

NODE_ENV=production

CLIENT_URL=https://seu-app.vercel.app
```

⚠️ **Deixe `CLIENT_URL` em branco por enquanto, vamos atualizar depois do deploy do frontend!**

#### 5. Deploy
1. Clique em "Deploy"
2. Aguarde o build terminar
3. Copie a URL gerada (algo como `https://seu-app.up.railway.app`)

#### 6. Rodar migrations no Railway
No terminal do Railway (ou localmente):
```bash
npx prisma migrate deploy
```

---

### ✅ PARTE 2: Deploy do Frontend (Vercel)

#### 1. Instalar Vercel CLI (se não tiver)
```bash
npm install -g vercel
```

#### 2. Fazer login no Vercel
```bash
vercel login
```

#### 3. Deploy do frontend
```bash
cd client
vercel
```

Responda as perguntas:
- **Set up and deploy?** → Y
- **Which scope?** → Sua conta
- **Link to existing project?** → N
- **Project name?** → realtime-chat (ou o nome que quiser)
- **In which directory?** → `./` (já estamos em client)
- **Override settings?** → N

#### 4. Configurar variáveis de ambiente no Vercel

Após o primeiro deploy, configure as variáveis:

```bash
vercel env add VITE_API_URL
```
Cole: `https://seu-app.up.railway.app` (a URL do Railway)

```bash
vercel env add VITE_SOCKET_URL
```
Cole: `https://seu-app.up.railway.app` (a mesma URL)

Escolha: **Production, Preview, Development** (todas)

#### 5. Re-deploy com as variáveis
```bash
vercel --prod
```

Pronto! Copie a URL final (algo como `https://realtime-chat.vercel.app`)

---

### ✅ PARTE 3: Conectar Backend e Frontend

#### 1. Atualizar CLIENT_URL no Railway
Volte no Railway → Variables → Edite `CLIENT_URL`:
```
CLIENT_URL=https://realtime-chat.vercel.app
```
(use a URL real da Vercel que você copiou)

#### 2. Restart do backend
No Railway, clique em "Restart" para aplicar a nova variável.

---

## 🎉 PRONTO! Seu App Está no Ar!

Acesse: `https://seu-app.vercel.app`

---

## 🧪 Testando

1. Crie uma conta
2. Crie uma sala
3. Abra em outra janela anônima
4. Crie outra conta
5. Entre na mesma sala
6. Envie mensagens em tempo real!

---

## 🔧 Configurações Atuais

### Backend (Railway)
- URL: https://seu-app.up.railway.app
- Database: Prisma Database (já configurado)
- Porta: 3001 (ou a que o Railway definir)

### Frontend (Vercel)
- URL: https://seu-app.vercel.app
- Build: Vite
- Framework: React

---

## 📝 Comandos Úteis

### Ver logs do backend:
No Railway → Deployments → Clique no último deploy

### Re-deploy do frontend:
```bash
cd client
vercel --prod
```

### Atualizar código:
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```
Railway e Vercel farão deploy automático!

---

## ⚡ Deploy Rápido (Alternativa Por Terminal)

Se preferir deploy mais rápido do backend, use Render.com:

### Render (alternativa ao Railway)

1. Acesse https://render.com
2. New → Web Service
3. Conecte GitHub → Selecione repositório
4. Configure:
   - **Name**: realtime-chat-backend
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/app.js`
   - **Environment Variables**: Adicione as mesmas do Railway
5. Create Web Service

---

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se `CLIENT_URL` no Railway está correto
- Deve ser exatamente a URL da Vercel (sem / no final)

### Socket não conecta
- Verifique logs no Railway
- Confirme que `VITE_SOCKET_URL` no Vercel aponta para Railway

### Erro 401 (Unauthorized)
- Limpe localStorage: F12 → Application → Clear
- Verifique se `JWT_SECRET` está definido no Railway

---

## 📊 Status Atual

✅ Banco de dados configurado (Prisma Database)  
✅ Dependencies instaladas  
✅ Migrations rodadas localmente  
⏳ Próximo passo: Deploy no Railway e Vercel  

---

🚀 **Boa sorte com o deploy!**
