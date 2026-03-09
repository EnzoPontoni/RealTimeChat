# 💬 Real-Time Chat

![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101?style=flat&logo=socket.io&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## 📋 Sobre o Projeto

Aplicação de chat em tempo real com salas, construída com **React**, **Node.js**, **Socket.io** e **PostgreSQL**. Projeto desenvolvido com foco em portfólio profissional, demonstrando domínio de WebSockets em produção.

### ✨ Funcionalidades

- ✅ **Autenticação JWT** - Sistema completo de login e registro
- ✅ **Salas de Chat** - Criar e entrar em salas públicas
- ✅ **Mensagens em Tempo Real** - Socket.io para comunicação instantânea
- ✅ **Indicador de Digitação** - Veja quando outros usuários estão digitando
- ✅ **Usuários Online** - Lista de participantes ativos na sala
- ✅ **Histórico de Mensagens** - Últimas 50 mensagens carregadas ao entrar
- ✅ **Design Responsivo** - Interface adaptada para mobile e desktop
- ✅ **Dark Mode** - Tema escuro moderno
- ✅ **Notificações** - Avisos quando usuários entram/saem

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização
- **React Router** - Navegação
- **Socket.io Client** - WebSocket client
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.io** - WebSocket server
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação
- **bcrypt** - Hashing de senhas

### Database
- **PostgreSQL** - Banco de dados relacional (Neon.tech)

### Deploy
- **Vercel** - Frontend
- **Railway/Render** - Backend
- **Neon.tech** - Database (serverless)

---

## 📁 Estrutura do Projeto

```
RealTimeChat/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Login e Register
│   │   │   ├── Chat/       # ChatRoom, MessageList, etc.
│   │   │   └── Rooms/      # RoomList, CreateRoomModal
│   │   ├── context/        # AuthContext, SocketContext
│   │   ├── hooks/          # useAuth, useSocket, useChat
│   │   ├── pages/          # Home, ChatPage, AuthPage
│   │   ├── services/       # API client
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Backend Node.js
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # Rotas REST
│   │   ├── socket/         # Socket.io handlers
│   │   ├── utils/          # Prisma client
│   │   └── app.js          # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Local

### Pré-requisitos
- Node.js 16+
- PostgreSQL (local ou Neon.tech)
- npm ou yarn

### 1️⃣ Backend Setup

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Criar arquivo .env (copiar de .env.example)
cp .env.example .env
```

**Configurar variáveis de ambiente** (`server/.env`):
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=seu_segredo_super_secreto_aqui
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### 2️⃣ Frontend Setup

```bash
# Navegar para a pasta do cliente
cd client

# Instalar dependências
npm install

# Criar arquivo .env (copiar de .env.example)
cp .env.example .env
```

**Configurar variáveis de ambiente** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

```bash
# Iniciar aplicação
npm run dev
```

A aplicação estará rodando em `http://localhost:5173`

---

## 🌐 Deploy em Produção

> 📚 **GUIAS DETALHADOS DISPONÍVEIS:**
> - 📖 [DEPLOY.md](DEPLOY.md) - Guia completo ilustrado
> - ⚡ [COMANDOS_DEPLOY.md](COMANDOS_DEPLOY.md) - Comandos prontos para copiar
> - 🎯 [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) - Específico para Vercel

### 1️⃣ Deploy do Database (Prisma Database / Neon.tech)

1. Se usar Prisma Database: você já tem o `DATABASE_URL` pronto!
2. Se preferir Neon.tech: acesse [neon.tech](https://neon.tech) e crie uma conta
3. Copie a **Connection String**
4. Use essa string nas variáveis de ambiente do backend

### 2️⃣ Deploy do Backend (Railway)

1. Acesse [railway.app](https://railway.app) e conecte seu GitHub
2. Importe o repositório
3. Configure o **Root Directory** para `server`
4. Adicione as variáveis de ambiente:
   ```
   DATABASE_URL=sua_connection_string_do_neon
   JWT_SECRET=seu_segredo_jwt
   CLIENT_URL=https://seu-frontend.vercel.app
   NODE_ENV=production
   ```
5. Deploy automático!
6. Rodar migrations:
   ```bash
   npx prisma migrate deploy
   ```

**Alternativa: Render**
- Mesmo processo, mas em [render.com](https://render.com)
- Criar Web Service
- Build command: `npm install && npx prisma generate`
- Start command: `node src/app.js`

### 3️⃣ Deploy do Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com) e conecte seu GitHub
2. Importe o repositório
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione as variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend.railway.app
   VITE_SOCKET_URL=https://seu-backend.railway.app
   ```
5. Deploy!

**⚠️ Importante**: Após o deploy do frontend, volte no Railway e atualize a variável `CLIENT_URL` com a URL da Vercel.

---

## 🔒 Segurança

- ✅ Senhas hashadas com **bcrypt**
- ✅ Autenticação via **JWT** (válido por 7 dias)
- ✅ Validação de entrada em todas as rotas
- ✅ CORS configurado adequadamente
- ✅ Variáveis sensíveis em `.env` (nunca commitadas)
- ✅ Middleware de autenticação para rotas protegidas

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token (protegida)

### Salas
- `GET /api/rooms` - Listar todas as salas (protegida)
- `GET /api/rooms/:id` - Buscar sala específica (protegida)
- `POST /api/rooms` - Criar nova sala (protegida)
- `DELETE /api/rooms/:id` - Deletar sala (protegida)

### Mensagens
- `GET /api/messages/room/:roomId` - Histórico da sala (protegida)
- `POST /api/messages` - Enviar mensagem (protegida)

### Health Check
- `GET /health` - Status do servidor

---

## 🔌 Eventos Socket.io

### Cliente → Servidor
```javascript
socket.emit('join_room', { roomId })
socket.emit('leave_room', { roomId })
socket.emit('send_message', { roomId, content })
socket.emit('typing_start', { roomId })
socket.emit('typing_stop', { roomId })
```

### Servidor → Cliente
```javascript
socket.emit('message_history', messages[])      // ao entrar
socket.to(roomId).emit('receive_message', msg)  // nova mensagem
socket.to(roomId).emit('user_joined', { username })
socket.to(roomId).emit('user_left', { username })
socket.to(roomId).emit('room_users', users[])
socket.to(roomId).emit('user_typing', { username })
socket.to(roomId).emit('user_stop_typing', { username })
```

---

## 🗃️ Schema do Banco (Prisma)

```prisma
model User {
  id        String    @id @default(cuid())
  username  String    @unique
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
  messages  Message[]
}

model Room {
  id          String    @id @default(cuid())
  name        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  messages    Message[]
}

model Message {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  userId    String
  roomId    String
  user      User     @relation(fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
}
```

---

## 🧪 Testando a Aplicação

1. **Registrar dois usuários** em janelas diferentes
2. **Criar uma sala** com um usuário
3. **Entrar na mesma sala** com ambos
4. **Enviar mensagens** e ver em tempo real
5. **Testar indicador de digitação**
6. **Ver lista de usuários online**
7. **Sair e entrar** para ver notificações

---

## 🐛 Troubleshooting

### Erro de conexão Socket.io
- Verifique se o backend está rodando
- Confirme as URLs em `client/.env`
- Verifique configuração de CORS no backend

### Erro de autenticação
- Limpe o localStorage: `localStorage.clear()`
- Verifique se o `JWT_SECRET` está configurado
- Confirme que o token está sendo enviado

### Erro de banco de dados
- Verifique a `DATABASE_URL`
- Rode `npx prisma generate`
- Rode `npx prisma migrate dev`

### Build do frontend falha
- Limpe cache: `rm -rf node_modules package-lock.json`
- Reinstale: `npm install`
- Verifique versão do Node.js (16+)

---

## 📝 Scripts Disponíveis

### Backend
```bash
npm start          # Produção
npm run dev        # Desenvolvimento (nodemon)
npm run prisma:generate   # Gerar Prisma Client
npm run prisma:migrate    # Rodar migrations (dev)
npm run prisma:deploy     # Deploy migrations (prod)
```

### Frontend
```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

---

## 🎨 Customização

### Cores (TailwindCSS)
Edite `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Cor principal
    600: '#0284c7',
    // ...
  }
}
```

### Logo e Títulos
- `client/index.html` - Título da página
- `client/src/pages/Home.jsx` - Título principal
- `client/src/pages/AuthPage.jsx` - Título de autenticação

---

## 📚 Recursos Adicionais

- [Socket.io Docs](https://socket.io/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Neon.tech Docs](https://neon.tech/docs)

---

## 📄 Licença

MIT License - Sinta-se livre para usar em seus projetos!

---

## 👨‍💻 Autor

Desenvolvido como projeto de portfólio demonstrando:
- Arquitetura full-stack moderna
- WebSockets em produção
- Autenticação JWT
- Deploy em cloud (Vercel + Railway + Neon)
- Clean Code e boas práticas

---

## 🙏 Agradecimentos

Projeto criado para demonstrar habilidades em desenvolvimento full-stack com foco em comunicação em tempo real usando WebSockets.

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
