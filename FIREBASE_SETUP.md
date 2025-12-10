# 🔥 Configuração do Firebase - Guia Rápido

## 📋 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `Makarios` (ou o nome que preferir)
4. Desabilite Google Analytics (não é necessário)
5. Clique em **"Criar projeto"**

### 2. Criar Web App

1. Na página do projeto, clique no ícone **"</>"** (Web)
2. Apelido do app: `Makarios Web`
3. **NÃO** marque "Firebase Hosting"
4. Clique em **"Registrar app"**
5. **COPIE** todo o objeto `firebaseConfig` que aparecer

### 3. Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de produção"**
4. Escolha a localização: `us-east1` (ou mais próxima de você)
5. Clique em **"Ativar"**

### 4. Configurar Regras de Segurança

1. Vá em **"Regras"** no Firestore
2. Cole o seguinte código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (APENAS PARA DESENVOLVIMENTO)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **"Publicar"**

⚠️ **IMPORTANTE**: Essas regras são para desenvolvimento. Para produção, você deve adicionar autenticação.

### 5. Atualizar Credenciais no Projeto

1. Abra o arquivo: `client/src/services/firebase.ts`
2. Substitua as credenciais com as suas do Firebase:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...", // Cole aqui sua API Key
  authDomain: "makarios-xxxxx.firebaseapp.com",
  projectId: "makarios-xxxxx",
  storageBucket: "makarios-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

### 6. Atualizar o Código

Após configurar o Firebase, rode:

```bash
git add .
git commit -m "feat: Adiciona Firebase para sincronização entre dispositivos"
git push
```

## ✅ Pronto!

Agora seus dados estarão sincronizados entre **todos os dispositivos**:
- ✅ Celular → Dados aparecem no PC
- ✅ PC → Dados aparecem no celular
- ✅ Múltiplos usuários podem acessar
- ✅ Dados persistem mesmo após fechar o navegador
- ✅ **100% GRÁTIS** (Firebase tem plano grátis generoso)

## 📊 Limites do Plano Gratuito

- 50.000 leituras/dia
- 20.000 escritas/dia
- 1 GB de armazenamento
- **Suficiente para uso pessoal/pequenas empresas**

## 🔐 Próximos Passos (Opcional)

Para adicionar autenticação (login):
1. No Firebase Console → **Authentication**
2. Ativar **Email/Password**
3. Criar sistema de login no app

---

**Dúvidas?** As credenciais do Firebase são públicas (podem ir no código), mas as regras de segurança protegem os dados.
