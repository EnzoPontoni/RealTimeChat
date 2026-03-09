# 🔖 Guia de Versionamento do Projeto

## ✅ Versão Estável Criada

Acabei de criar a **v1.0.0** - sua versão estável e funcional que está em produção.

---

## 📂 Estrutura de Branches

### `master` (main)
- Código de produção estável
- Sempre funcionando 100%
- Deploy automático quando você faz push

### `feature/visual-redesign` ← **VOCÊ ESTÁ AQUI AGORA**
- Branch para mudanças visuais
- Experimente à vontade sem medo
- Pode quebrar sem problemas

---

## 🎨 Workflow: Como Mexer no Visual com Segurança

### 1️⃣ Já está no branch certo para começar
```bash
# Você já está em feature/visual-redesign
# Pode começar a mexer agora mesmo!
```

### 2️⃣ Faça commits normalmente enquanto muda o visual
```bash
git add .
git commit -m "style: novo esquema de cores"
git push
```

### 3️⃣ Se algo quebrar, existem 3 opções:

#### A) Descartar TODAS as mudanças e voltar pro início do branch
```bash
git reset --hard origin/feature/visual-redesign
```

#### B) Voltar para a versão estável (v1.0.0) e abandonar o branch
```bash
git checkout master
git reset --hard v1.0.0
```

#### C) Voltar só um commit específico
```bash
git log --oneline                    # Ver lista de commits
git reset --hard <hash-do-commit>    # Voltar para aquele commit
```

### 4️⃣ Quando o visual ficar PERFEITO e tudo funcionando

#### Testar localmente antes de mergear
```bash
# Ainda em feature/visual-redesign
cd server
npm start

# Outro terminal
cd client
npm run dev

# Se estiver tudo OK, prosseguir para merge
```

#### Fazer merge no master (colocar em produção)
```bash
git checkout master
git merge feature/visual-redesign
git push origin master

# Deployar
cd server
railway redeploy -y

cd ../client
npm run build
vercel deploy --prebuilt --prod
```

#### Criar nova tag de versão
```bash
git tag -a v1.1.0 -m "Versão 1.1.0 - Visual redesenhado"
git push origin v1.1.0
```

---

## 🆘 Resgate de Emergência

Se TUDO der errado e quiser voltar EXATAMENTE para como estava:

```bash
# 1. Ir pro master
git checkout master

# 2. Voltar para v1.0.0
git reset --hard v1.0.0
git push --force origin master

# 3. Deploy da versão antiga
cd server
railway redeploy -y

cd ../client
npm run build
vercel deploy --prebuilt --prod
```

**⚠️ Cuidado:** `--force` sobrescreve histórico. Use só em emergência.

---

## 📋 Comandos Úteis do Dia a Dia

### Ver em qual branch você está
```bash
git branch
```

### Ver todas as tags (versões)
```bash
git tag
```

### Trocar de branch
```bash
git checkout master                    # Ir pro código estável
git checkout feature/visual-redesign   # Voltar pro visual
```

### Ver diferenças entre branches
```bash
git diff master feature/visual-redesign
```

### Ver histórico visual
```bash
git log --oneline --graph --all --decorate
```

---

## 💡 Dica Pro

Sempre que tiver uma versão estável funcionando (mesmo que seja só visual), crie uma tag:

```bash
git tag -a v1.1.0 -m "Visual novo funcionando"
git push origin v1.1.0
```

Assim você pode ir de v1.0.0 → v1.1.0 → v1.2.0 e sempre voltar para qualquer uma.

---

## 🎯 Resumo Rápido

| Ação | Comando |
|------|---------|
| Ver branch atual | `git branch` |
| Trocar de branch | `git checkout <nome-do-branch>` |
| Criar novo branch | `git checkout -b feature/nova-coisa` |
| Voltar pra v1.0.0 | `git checkout master; git reset --hard v1.0.0` |
| Salvar progresso | `git add .; git commit -m "msg"; git push` |
| Descartar mudanças | `git reset --hard HEAD` |

---

**Status Atual:**
- ✅ v1.0.0 (versão estável) está salva
- ✅ Você está em `feature/visual-redesign`
- ✅ Master continua intacto
- ✅ Pode mexer sem medo!
