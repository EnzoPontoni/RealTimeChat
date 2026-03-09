# ⚡ COMANDOS PARA DEPLOY - COPIE E COLE

## 🎯 RESUMO: VOCÊ PRECISA FAZER 2 DEPLOYS

1. **Backend** → Railway (Socket.io precisa de servidor persistente)
2. **Frontend** → Vercel

---

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ BACKEND NO RAILWAY

#### A. Criar conta e projeto
1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione: `RealTimeChat`

#### B. Configurar projeto
1. Clique em "Settings"
2. **Root Directory**: `server`
3. **Start Command**: `node src/app.js`

#### C. Adicionar variáveis (na aba "Variables")
```
DATABASE_URL
postgres://c21c7d3f038722b9467612bab53cd0e7c7b5c28f255906834292bc8d35d56a99:sk_t0NeiUr4T8o3hatCDbS6t@db.prisma.io:5432/postgres?sslmode=require

JWT_SECRET
super_secret_jwt_key_change_in_production_2026

NODE_ENV
production

CLIENT_URL
(deixe vazio por enquanto - vamos preencher depois)
```

#### D. Deploy
1. Clique em "Deploy"
2. Aguarde terminar (2-3 minutos)
3. **COPIE A URL** gerada (ex: `https://realtime-chat-production.up.railway.app`)

---

### 2️⃣ FRONTEND NA VERCEL

#### A. Instalar Vercel CLI (se não tiver)
```bash
npm install -g vercel
```

#### B. Login
```bash
vercel login
```
Vai abrir o browser para você fazer login.

#### C. Deploy do frontend
```bash
cd "c:\Users\Brrxis\Desktop\Pro Github\RealTimeChat\client"
vercel
```

**Responda:**
- Set up and deploy? → **Y**
- Which scope? → Sua conta
- Link to existing project? → **N**
- Project name? → **realtime-chat**
- In which directory? → **./`** (já estamos em client)
- Override settings? → **N**

#### D. Adicionar variáveis de ambiente
```bash
vercel env add VITE_API_URL
```
Cole a URL do Railway que você copiou (ex: `https://realtime-chat-production.up.railway.app`)

Escolha: **Production** (aperte Enter)

```bash
vercel env add VITE_SOCKET_URL
```
Cole a **MESMA URL** do Railway

Escolha: **Production** (aperte Enter)

#### E. Deploy final com variáveis
```bash
vercel --prod
```

**COPIE A URL** gerada (ex: `https://realtime-chat.vercel.app`)

---

### 3️⃣ CONECTAR BACKEND E FRONTEND

#### A. Voltar no Railway
1. Abra o projeto no Railway
2. Vá em "Variables"
3. Edite `CLIENT_URL`
4. Cole a URL da Vercel (ex: `https://realtime-chat.vercel.app`)
5. Clique em "Restart" (ou o backend vai reiniciar automaticamente)

---

## 🎉 PRONTO! TESTE SEU APP

Acesse a URL da Vercel (ex: `https://realtime-chat.vercel.app`)

1. Crie uma conta
2. Faça login
3. Crie uma sala
4. Abra outra janela anônima (Ctrl+Shift+N)
5. Crie outra conta
6. Entre na mesma sala
7. **CONVERSE EM TEMPO REAL!** 💬

---

## 🔧 ALTERNATIVA: RENDER PARA BACKEND

Se preferir Render em vez de Railway:

### A. Deploy no Render
1. Acesse: https://render.com
2. "New" → "Web Service"
3. Connect GitHub → Selecione `RealTimeChat`
4. Configure:
   - **Name**: `realtime-chat-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/app.js`
   - **Environment**: Node

### B. Adicionar variáveis
Clique em "Environment" e adicione:
```
DATABASE_URL=postgres://c21c7d3f038722b9467612bab53cd0e7c7b5c28f255906834292bc8d35d56a99:sk_t0NeiUr4T8o3hatCDbS6t@db.prisma.io:5432/postgres?sslmode=require
JWT_SECRET=super_secret_jwt_key_change_in_production_2026
NODE_ENV=production
CLIENT_URL=(deixe vazio)
```

### C. Create Web Service
Copie a URL gerada e siga os mesmos passos da Vercel acima.

---

## ❌ PROBLEMAS COMUNS

### "Socket não conecta"
✅ Verifique se as URLs estão corretas (sem / no final)  
✅ Confirme que CLIENT_URL no backend = URL da Vercel  
✅ Confirme que VITE_SOCKET_URL no Vercel = URL do Railway  

### "Erro 401"
✅ Limpe o cache: F12 → Application → Clear Storage  
✅ Verifique JWT_SECRET no Railway  

### "CORS Error"
✅ CLIENT_URL deve ser EXATAMENTE a URL da Vercel  
✅ Não coloque / no final da URL  

---

## 📊 CHECKLIST

- [ ] Backend deployado no Railway/Render
- [ ] URL do backend copiada
- [ ] Frontend deployado na Vercel
- [ ] Variáveis VITE_API_URL e VITE_SOCKET_URL configuradas
- [ ] URL da Vercel copiada
- [ ] CLIENT_URL atualizado no backend
- [ ] Backend reiniciado
- [ ] Testado: criar conta, sala e conversar

---

## 💾 PARA ATUALIZAR O APP DEPOIS

```bash
# Após fazer mudanças no código:
git add .
git commit -m "feat: nova funcionalidade"
git push

# Railway e Vercel vão fazer deploy automático!
```

---

## 🆘 PRECISA DE AJUDA?

**Backend não está rodando?**
- Veja os logs no Railway: Deployments → último deploy → Logs
- Ou no Render: Logs (botão no topo)

**Frontend com erro?**
- Veja os logs no Vercel: Deployments → último deploy → Build Logs

**Tudo configurado mas não funciona?**
- Teste localmente primeiro (já está rodando!)
- Verifique se as URLs estão corretas (principal causa de erro)

---

🚀 **BOA SORTE COM O DEPLOY!**
