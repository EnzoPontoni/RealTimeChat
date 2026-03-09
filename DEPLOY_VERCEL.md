# 🚀 Deploy Automático - Frontend na Vercel

## Pré-requisitos
```bash
npm install -g vercel
```

## Passo 1: Login
```bash
vercel login
```

## Passo 2: Deploy do Frontend
```bash
cd client
vercel --prod
```

**Configurações durante o deploy:**
- Project name: `realtime-chat`
- Framework: `Vite` (auto-detectado)
- Build Command: `npm run build` (auto)
- Output Directory: `dist` (auto)
- Development Command: `npm run dev` (auto)

## Passo 3: Adicionar Variáveis de Ambiente

Você precisa adicionar 2 variáveis no dashboard da Vercel ou via CLI:

### Via Dashboard:
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `realtime-chat`
3. Settings → Environment Variables
4. Adicione:
   - `VITE_API_URL` = URL do seu backend (Railway/Render)
   - `VITE_SOCKET_URL` = URL do seu backend (Railway/Render)

### Via CLI (Recomendado):
```bash
# Adicionar VITE_API_URL
vercel env add VITE_API_URL production

# Quando perguntar, cole a URL do backend:
# https://seu-backend.up.railway.app

# Adicionar VITE_SOCKET_URL  
vercel env add VITE_SOCKET_URL production

# Quando perguntar, cole a mesma URL do backend
```

## Passo 4: Re-deploy com Variáveis
```bash
vercel --prod
```

## ✅ Pronto!

Sua URL será algo como:
`https://realtime-chat-xyz.vercel.app`

---

## 🔧 Para o Backend (Railway)

**IMPORTANTE**: O backend NÃO vai na Vercel!

### Opção 1: Railway (Recomendado)
1. Acesse: https://railway.app
2. New Project → Deploy from GitHub
3. Selecione o repositório
4. Configure root directory: `server`
5. Adicione variáveis de ambiente:
   ```
   DATABASE_URL=postgres://c21c7d3f038722b9467612bab53cd0e7c7b5c28f255906834292bc8d35d56a99:sk_t0NeiUr4T8o3hatCDbS6t@db.prisma.io:5432/postgres?sslmode=require
   JWT_SECRET=super_secret_jwt_key_change_in_production_2026
   NODE_ENV=production
   CLIENT_URL=https://sua-app.vercel.app
   ```
6. Deploy!

### Opção 2: Render
1. Acesse: https://render.com
2. New → Web Service
3. Connect GitHub → Selecione repo
4. Configure:
   - Name: `realtime-chat-backend`
   - Root Directory: `server`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `node src/app.js`
5. Adicione as mesmas variáveis de ambiente
6. Create Web Service

---

## 📱 Ordem de Deploy

1. **Primeiro**: Deploy do Backend (Railway/Render)
2. **Copie a URL** do backend
3. **Depois**: Deploy do Frontend (Vercel) com a URL do backend
4. **Atualize**: CLIENT_URL no backend com a URL da Vercel
5. **Teste**: Acesse a URL da Vercel e crie uma conta!

---

## ⚡ Deploy Rápido (Agora)

Se quiser fazer agora mesmo:

```bash
# Terminal 1 - Deploy Frontend
cd "c:\Users\Brrxis\Desktop\Pro Github\RealTimeChat\client"
vercel --prod
```

Mas lembre-se: **você precisa do backend online primeiro!**

---

## 🎯 Status Atual

✅ Database configurado e migrations aplicadas  
✅ Backend rodando localmente (porta 3001)  
✅ Frontend rodando localmente (porta 5173)  
⏳ **Próximo passo**: Deploy no Railway → Depois Vercel  

---

## 💡 Dica

Se você quiser testar tudo localmente primeiro:
1. Abra http://localhost:5173
2. Crie uma conta
3. Crie uma sala
4. Abra em janela anônima
5. Crie outra conta e entre na mesma sala
6. Converse em tempo real!

Se funcionar localmente, vai funcionar em produção! 🚀
