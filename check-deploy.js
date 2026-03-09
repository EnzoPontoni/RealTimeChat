// ✅ Script de Verificação Pré-Deploy
// Execute: node check-deploy.js

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configurações de deploy...\n');

let errors = 0;
let warnings = 0;

// Verificar estrutura de arquivos
console.log('📁 Verificando estrutura de arquivos...');

const requiredFiles = [
  'server/package.json',
  'server/prisma/schema.prisma',
  'server/src/app.js',
  'server/.env.example',
  'client/package.json',
  'client/vite.config.js',
  'client/.env.example',
  'client/vercel.json',
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - AUSENTE`);
    errors++;
  }
});

// Verificar .env do servidor
console.log('\n🔐 Verificando variáveis de ambiente do servidor...');

if (fs.existsSync('server/.env')) {
  const serverEnv = fs.readFileSync('server/.env', 'utf-8');
  
  const requiredServerVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'CLIENT_URL',
    'NODE_ENV'
  ];

  requiredServerVars.forEach(varName => {
    if (serverEnv.includes(varName)) {
      console.log(`   ✅ ${varName} configurado`);
    } else {
      console.log(`   ⚠️  ${varName} - AUSENTE`);
      warnings++;
    }
  });

  // Verificar se DATABASE_URL está configurado corretamente
  if (serverEnv.includes('DATABASE_URL')) {
    if (serverEnv.includes('postgres://c21c7d3f038722b9467612bab53cd0e7c7b5c28f255906834292bc8d35d56a99')) {
      console.log('   ✅ DATABASE_URL do Prisma Database configurado');
    } else if (serverEnv.includes('postgresql://')) {
      console.log('   ✅ DATABASE_URL personalizado configurado');
    } else {
      console.log('   ⚠️  DATABASE_URL pode estar incorreto');
      warnings++;
    }
  }

} else {
  console.log('   ❌ server/.env NÃO EXISTE - copie de .env.example');
  errors++;
}

// Verificar .env do cliente
console.log('\n🌐 Verificando variáveis de ambiente do cliente...');

if (fs.existsSync('client/.env')) {
  const clientEnv = fs.readFileSync('client/.env', 'utf-8');
  
  const requiredClientVars = [
    'VITE_API_URL',
    'VITE_SOCKET_URL'
  ];

  requiredClientVars.forEach(varName => {
    if (clientEnv.includes(varName)) {
      console.log(`   ✅ ${varName} configurado`);
    } else {
      console.log(`   ⚠️  ${varName} - AUSENTE`);
      warnings++;
    }
  });

} else {
  console.log('   ❌ client/.env NÃO EXISTE - copie de .env.example');
  errors++;
}

// Verificar node_modules
console.log('\n📦 Verificando dependências...');

if (fs.existsSync('server/node_modules')) {
  console.log('   ✅ Dependências do servidor instaladas');
} else {
  console.log('   ⚠️  Dependências do servidor não instaladas');
  console.log('      Execute: cd server && npm install');
  warnings++;
}

if (fs.existsSync('client/node_modules')) {
  console.log('   ✅ Dependências do cliente instaladas');
} else {
  console.log('   ⚠️  Dependências do cliente não instaladas');
  console.log('      Execute: cd client && npm install');
  warnings++;
}

// Verificar Prisma
console.log('\n🗄️  Verificando Prisma...');

if (fs.existsSync('server/node_modules/@prisma/client')) {
  console.log('   ✅ Prisma Client gerado');
} else {
  console.log('   ⚠️  Prisma Client não gerado');
  console.log('      Execute: cd server && npx prisma generate');
  warnings++;
}

if (fs.existsSync('server/prisma/migrations')) {
  const migrations = fs.readdirSync('server/prisma/migrations');
  if (migrations.length > 1) { // > 1 porque tem .gitkeep ou migration_lock
    console.log(`   ✅ Migrations criadas (${migrations.length - 1} migration(s))`);
  } else {
    console.log('   ⚠️  Nenhuma migration encontrada');
    console.log('      Execute: cd server && npx prisma migrate dev --name init');
    warnings++;
  }
} else {
  console.log('   ⚠️  Pasta de migrations não existe');
  warnings++;
}

// Verificar vercel.json
console.log('\n☁️  Verificando configuração Vercel...');

if (fs.existsSync('client/vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('client/vercel.json', 'utf-8'));
  if (vercelConfig.rewrites) {
    console.log('   ✅ vercel.json configurado corretamente');
  } else {
    console.log('   ⚠️  vercel.json pode estar incompleto');
    warnings++;
  }
} else {
  console.log('   ❌ client/vercel.json não encontrado');
  errors++;
}

// Verificar .gitignore
console.log('\n🙈 Verificando .gitignore...');

if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf-8');
  if (gitignore.includes('.env') && gitignore.includes('node_modules')) {
    console.log('   ✅ .gitignore configurado');
  } else {
    console.log('   ⚠️  .gitignore pode estar incompleto');
    warnings++;
  }
} else {
  console.log('   ⚠️  .gitignore não encontrado');
  warnings++;
}

// Resumo final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO DA VERIFICAÇÃO');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('\n✅ TUDO CERTO! Pronto para deploy! 🚀\n');
  console.log('📝 Próximos passos:');
  console.log('   1. Commit e push para GitHub');
  console.log('   2. Deploy backend no Railway');
  console.log('   3. Deploy frontend na Vercel');
  console.log('\n📚 Consulte: COMANDOS_DEPLOY.md\n');
} else {
  if (errors > 0) {
    console.log(`\n❌ ${errors} erro(s) encontrado(s)`);
    console.log('   Corrija os erros marcados com ❌\n');
  }
  if (warnings > 0) {
    console.log(`\n⚠️  ${warnings} aviso(s) encontrado(s)`);
    console.log('   Revise os avisos marcados com ⚠️\n');
  }
  console.log('Corrija os problemas e execute novamente: node check-deploy.js\n');
}

console.log('='.repeat(50) + '\n');

// Exit com código de erro se houver problemas críticos
process.exit(errors > 0 ? 1 : 0);
