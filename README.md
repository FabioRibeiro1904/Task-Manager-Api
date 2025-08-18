# Task Manager API

API REST para gerenciar tarefas, feita com .NET Core 8. Permite criar, editar, listar e excluir tarefas com autenticação segura.

## O que é este projeto

Esta é uma API (backend) para um sistema de tarefas. Oferece:
- Sistema completo de login e registro
- Gerenciamento de tarefas pessoais
- Filtros e busca avançada
- Autenticação segura com JWT
- Documentação automática

## Tecnologias usadas

- **.NET Core 8** - Framework para criar APIs
- **Entity Framework Core** - Para acessar o banco de dados
- **JWT** - Para autenticação segura
- **BCrypt** - Para criptografar senhas
- **Swagger** - Para documentar a API
- **SQLite** - Banco de dados (em memória para demonstração)

## Como usar

### Executar o projeto

```bash
cd TaskManagerApi
dotnet restore
dotnet run
```

### Acessar

- API: https://localhost:7266
- Documentação: https://localhost:7266 (abre o Swagger automaticamente)

### Usuários de teste

```
Email: admin@taskmanager.com
Senha: admin123
```

```
Email: john@example.com
Senha: password123
```

## O que a API faz

**Autenticação:**
- Registrar novos usuários
- Fazer login e receber token JWT
- Proteger endpoints com autenticação

**Gerenciamento de Tarefas:**
- Criar tarefas com título, descrição, prioridade
- Listar tarefas do usuário logado
- Filtrar por status (pendente, em progresso, concluída)
- Buscar tarefas por texto
- Marcar tarefas como concluídas
- Editar e excluir tarefas

**Recursos extras:**
- Paginação automática nas listagens
- Estatísticas de produtividade
- Validação de dados
- Tratamento de erros

## Exemplos de uso

### Fazer login
```http
POST /api/auth/login
{
  "email": "admin@taskmanager.com",
  "password": "admin123"
}
```

### Criar tarefa
```http
POST /api/tasks
Authorization: Bearer [seu-token]
{
  "title": "Estudar .NET",
  "description": "Aprender sobre APIs REST",
  "priority": 2,
  "dueDate": "2025-08-25T10:00:00Z"
}
```

### Listar tarefas
```http
GET /api/tasks?status=1&page=1&pageSize=10
Authorization: Bearer [seu-token]
```

## Estrutura do código

```
TaskManagerApi/
├── Controllers/      # Endpoints da API
├── Models/          # Classes dos dados
├── DTOs/            # Objetos para entrada/saída
├── Services/        # Regras de negócio
├── Data/            # Configuração do banco
└── Program.cs       # Configuração da aplicação
```

## Status e Prioridades

**Status das Tarefas:**
- 0 = Pendente
- 1 = Em Progresso  
- 2 = Concluída
- 3 = Cancelada

**Prioridades:**
- 0 = Baixa
- 1 = Média
- 2 = Alta
- 3 = Crítica

## Observações

- Este é um projeto de estudo e portfólio
- O banco de dados é recriado a cada execução (em memória)
- Dados de exemplo são inseridos automaticamente
- Documentação interativa disponível no Swagger

## Próximos passos

Para um projeto real, consideraria:
- Banco de dados permanente (SQL Server/PostgreSQL)
- Cache com Redis
- Testes automatizados
- Docker
- Pipeline CI/CD
- Rate limiting
- Logs avançados

2. **Restaurar dependências**
```bash
dotnet restore
```

3. **Executar a aplicação**
```bash
dotnet run
```

4. **Acessar a documentação**
- Swagger UI: `https://localhost:7266`
- API Base URL: `https://localhost:7266/api`

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/health` | Health check |

### Tarefas (Requer autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar tarefas com filtros |
| GET | `/api/tasks/{id}` | Obter tarefa específica |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| DELETE | `/api/tasks/{id}` | Excluir tarefa |
| PATCH | `/api/tasks/{id}/complete` | Marcar como concluída |
| GET | `/api/tasks/status/{status}` | Tarefas por status |
| GET | `/api/tasks/statistics` | Estatísticas do usuário |

##  Autenticação

### Registrar Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "password123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@taskmanager.com", 
  "password": "admin123"
}
```

### Usar Token
```http
Authorization: Bearer {seu-jwt-token}
```

##  Exemplos de Uso

### Criar Tarefa
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Implementar dashboard",
  "description": "Criar dashboard com gráficos",
  "priority": 2,
  "dueDate": "2025-08-20T10:00:00Z"
}
```

### Filtrar Tarefas
```http
GET /api/tasks?status=1&priority=2&page=1&pageSize=10&search=dashboard
Authorization: Bearer {token}
```

##  Status e Prioridades

### Status das Tarefas
- `0` - Pending (Pendente)
- `1` - InProgress (Em Progresso)
- `2` - Completed (Concluída)
- `3` - Cancelled (Cancelada)

### Prioridades
- `0` - Low (Baixa)
- `1` - Medium (Média)
- `2` - High (Alta)
- `3` - Critical (Crítica)

## 🗄 Modelo de Dados

### User
```csharp
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2025-08-12T10:00:00Z"
}
```

### Task
```csharp
{
  "id": 1,
  "title": "Implementar API",
  "description": "Criar endpoints REST",
  "status": 1,
  "priority": 2,
  "dueDate": "2025-08-20T10:00:00Z",
  "createdAt": "2025-08-12T10:00:00Z",
  "updatedAt": "2025-08-12T10:00:00Z",
  "userId": 1
}
```

##  Testando a API

### Usuários Padrão
```json
{
  "email": "admin@taskmanager.com",
  "password": "admin123"
}

{
  "email": "john@example.com", 
  "password": "password123"
}
```

### Usando VS Code REST Client
Utilize o arquivo `TaskManagerApi.http` incluído no projeto para testar todos os endpoints.

## Arquitetura

### Estrutura do Projeto
```
TaskManagerApi/
├── Controllers/          # Controladores da API
├── Models/              # Modelos de domínio
├── DTOs/                # Data Transfer Objects
├── Services/            # Lógica de negócio
├── Data/                # Contexto do Entity Framework
├── Properties/          # Configurações de launch
└── Program.cs           # Configuração da aplicação
```

### Padrões Implementados
- **Repository Pattern**: Separação da lógica de acesso a dados
- **Dependency Injection**: Inversão de controle
- **DTO Pattern**: Transferência segura de dados
- **Service Layer**: Encapsulamento da lógica de negócio

##  Configurações

### JWT Settings
```json
{
  "Jwt": {
    "Key": "SuperSecretKeyForTaskManagerAPI2024!@#$%",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerClients"
  }
}
```

### CORS
- Configurado para aceitar qualquer origem (desenvolvimento)
- Para produção, configure domínios específicos

##  Recursos Avançados

### Filtros e Paginação
```http
GET /api/tasks?status=1&priority=2&dueDateFrom=2025-08-01&dueDateTo=2025-08-31&search=urgent&page=1&pageSize=10
```

### Estatísticas
```json
{
  "totalTasks": 15,
  "completedTasks": 8,
  "pendingTasks": 5,
  "inProgressTasks": 2,
  "overdueTasks": 3,
  "completionRate": 53.33
}
```

##  Próximos Passos

Para um ambiente de produção, considere implementar:

- [ ] Banco de dados SQL Server/PostgreSQL
- [ ] Rate Limiting
- [ ] Caching com Redis
- [ ] Health Checks avançados
- [ ] Logs estruturados (Serilog)
- [ ] Monitoring (Application Insights)
- [ ] Testes unitários e de integração
- [ ] CI/CD Pipeline
- [ ] Docker containerization

## 📞 Suporte

Esta API foi desenvolvida para fins demonstrativos, mostrando as principais funcionalidades e padrões do .NET Core moderno.

---

**Desenvolvido com ❤ usando .NET Core 8**
