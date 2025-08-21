# 🚀 TaskNexus - Deploy Guide

## Arquitetura do Deploy
- **Frontend**: Cloudflare Pages (React)
- **Backend**: Railway.app ou Render.com (.NET Core)

## 📱 Deploy do Frontend (Cloudflare Pages)

### Opção 1: Via Dashboard Web
1. Acesse [Cloudflare Pages](https://pages.cloudflare.com)
2. Conecte seu repositório GitHub
3. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
   - **Root directory**: `task-manager-frontend`

### Opção 2: Via CLI (Wrangler)
```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Login no Cloudflare
wrangler login

# Deploy
cd task-manager-frontend
npm install
npm run build
wrangler pages deploy build --project-name=tasknexus
```

## 🔧 Deploy do Backend (.NET API)

### Opção 1: Railway.app (Recomendado)
1. Acesse [Railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   Jwt__Key=SuperSecretKeyForTaskManagerAPI2024!@#$%
   Jwt__Issuer=TaskManagerAPI
   Jwt__Audience=TaskManagerClients
   ```

### Opção 2: Render.com
1. Acesse [Render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Configure:
   - **Build Command**: `dotnet publish -c Release -o out`
   - **Start Command**: `dotnet out/TaskManagerApi.dll`

## 🔗 Configuração Final

### 1. Atualize a URL da API
No arquivo `.env.production` do frontend:
```
REACT_APP_API_URL=https://sua-api.railway.app/api
```

### 2. Configure CORS na API
No `Program.cs`, atualize o CORS:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowCloudflare", policy =>
    {
        policy.WithOrigins(
            "https://tasknexus.pages.dev",
            "https://your-custom-domain.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

app.UseCors("AllowCloudflare");
```

## 🌐 URLs do Projeto
- **Frontend**: https://tasknexus.pages.dev
- **API**: https://tasknexus-api.railway.app

## 🔧 Scripts Úteis

```bash
# Deploy completo
./deploy.sh

# Deploy apenas frontend
cd task-manager-frontend && npm run build && wrangler pages deploy build

# Teste local
npm start (frontend)
dotnet watch run (backend)
```

## 📋 Checklist de Deploy

### Frontend ✅
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy no Cloudflare Pages
- [ ] Domínio customizado (opcional)

### Backend ✅
- [ ] API funcionando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy no Railway/Render
- [ ] CORS configurado para o frontend
- [ ] HTTPS habilitado

### Configuração ✅
- [ ] URLs atualizadas
- [ ] Testes de integração
- [ ] Monitoramento configurado

## 🆘 Troubleshooting

### Frontend não carrega
- Verifique se a URL da API está correta
- Confirme se o CORS está configurado

### API não responde
- Verifique as variáveis de ambiente
- Confirme se a porta está correta ($PORT)

### Erro de CORS
- Adicione o domínio do frontend no CORS
- Verifique se está usando HTTPS
