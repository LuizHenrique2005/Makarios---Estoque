# 🎯 Sistema Makarios - Gestão de Estoque e Produção

Sistema profissional para gerenciar materiais, produtos e produção com sincronização em nuvem.

## ✨ Funcionalidades

- ✅ **Gestão de Materiais** - Cadastre materiais com unidades de compra/uso diferentes
- ✅ **Gestão de Produtos** - Crie produtos com múltiplos materiais
- ✅ **Confecções** - Registre produção com baixa automática de estoque
- ✅ **Dashboard** - Visualize KPIs e gráficos de produção
- ✅ **Sincronização em Nuvem** - Acesse seus dados de qualquer dispositivo
- ✅ **Responsivo** - Funciona perfeitamente em celular, tablet e desktop

## 🚀 Como Configurar

### 1. Configurar Firebase (Sincronização)

Siga o guia completo em: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Resumo rápido:**
1. Criar projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar Firestore Database
3. Copiar credenciais para `client/src/services/firebase.ts`

### 2. Rodar Localmente

```bash
cd client
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## 📱 Acessar de Qualquer Dispositivo

Com o Firebase configurado, seus dados estarão disponíveis em:
- 💻 **PC** - Pelo navegador
- 📱 **Celular** - Pelo navegador mobile
- 📲 **Tablet** - Pelo navegador

**Todos os dispositivos verão os mesmos dados em tempo real!**

## 🌐 Deploy (Hospedar Online)

### Vercel (Recomendado)

1. Conecte este repositório no [Vercel](https://vercel.com)
2. Deploy automático a cada push!

### Netlify

1. Arraste a pasta `client/dist` em [netlify.com/drop](https://netlify.com/drop)

### AWS Amplify

1. Conecte o repositório no [AWS Amplify Console](https://console.aws.amazon.com/amplify/)

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS v4
- **Banco de Dados:** Firebase Firestore (Nuvem)
- **Gráficos:** Recharts
- **Notificações:** React Hot Toast
- **Ícones:** Lucide React
- **Roteamento:** React Router DOM

## 📊 Estrutura do Projeto

```
client/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Firebase e LocalStorage
│   ├── types/          # TypeScript types
│   └── utils/          # Funções auxiliares
└── dist/              # Build de produção
```

## 🔐 Segurança

**IMPORTANTE:** O arquivo `firebase.ts` contém credenciais que precisam ser atualizadas com suas próprias credenciais do Firebase.

Para produção, configure regras de segurança no Firestore conforme explicado em [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## 📝 License

MIT License - Livre para uso pessoal e comercial

---

**Desenvolvido com ❤️ para facilitar a gestão de produção**
