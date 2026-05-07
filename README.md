# Projeto MRL

Sistema web desenvolvido para a empresa **MRL**, com foco na gestão administrativa de clientes, projetos, contratos e autenticação de usuários.

Este projeto também está sendo utilizado como trabalho acadêmico do **4º semestre do curso de Análise e Desenvolvimento de Sistemas (ADS)**.

## Sobre o Projeto

O Projeto MRL é uma aplicação full stack composta por:

- **Frontend em React**, responsável pela interface web do sistema.
- **Backend em Node.js com Express**, responsável pela API REST.
- **Banco de dados MySQL**, utilizado para persistência das informações.
- **Autenticação com JWT**, com senhas criptografadas usando bcrypt.

O sistema possui uma inicialização automática do banco de dados. Ao subir o backend, a aplicação verifica se o banco existe, cria as tabelas necessárias, insere dados iniciais e garante a existência do administrador padrão.

## Funcionalidades

- Login e cadastro de usuários.
- Área administrativa protegida.
- Cadastro, listagem, edição e exclusão de clientes.
- Cadastro, listagem, edição e exclusão de projetos.
- Seleção obrigatória de cliente cadastrado ao criar projetos.
- Criação automática de contratos a partir dos projetos.
- Sincronização automática dos contratos quando um projeto é atualizado.
- Seed inicial com clientes, projetos, contratos e usuário administrador.
- Inicialização idempotente do banco, sem duplicar registros.

## Tecnologias Utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express
- MySQL2
- JWT
- bcrypt / bcryptjs
- dotenv
- Nodemon
- Jest

### Banco de Dados

- MySQL
- Banco padrão: `mrl_db`

## Estrutura do Projeto

```text
Projeto-MRL-React/
|
|-- backend/
|   |-- server.js
|   |-- src/
|   |   |-- application/
|   |   |-- config/
|   |   |-- database/
|   |   |-- domain/
|   |   |-- infrastructure/
|   |   |-- presentation/
|   |   |-- tests/
|   |-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- utils/
|   |-- package.json
|
|-- README.md
```

## Pré-requisitos

Antes de rodar o projeto, instale:

- Node.js 18 ou superior
- npm
- MySQL Server

Observação: não é necessário criar o banco manualmente pelo MySQL Workbench. O backend cria o banco `mrl_db` automaticamente, desde que o MySQL esteja instalado, rodando e com as credenciais corretas no arquivo `.env`.

## Configuração do Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie ou confira o arquivo `.env` dentro da pasta `backend`:

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=mrl_db

JWT_SECRET=mrl_secret_super_seguro_2024
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@mrl.com
ADMIN_PASSWORD=admin123
```

Importante: altere `DB_PASSWORD` para a senha do seu usuário MySQL local.

## Rodando o Backend

Para iniciar em modo desenvolvimento:

```bash
npm run dev
```

Ou para iniciar em modo padrão:

```bash
npm start
```

Ao iniciar, o backend executa automaticamente:

```text
[DB] Banco criado/verificado
[DB] Tabelas sincronizadas
[SEED] Clientes inseridos/verificados
[SEED] Projetos inseridos/verificados
[SEED] Contratos sincronizados
[SEED] Admin verificado/criado
[SERVER] Sistema iniciado com sucesso
```

A API ficará disponível em:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

## Configuração do Frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

## Rodando o Frontend

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Usuário Administrador Padrão

Durante a inicialização do backend, o sistema cria automaticamente um administrador padrão, caso ele ainda não exista.

```text
E-mail: admin@mrl.com
Senha: admin123
```

A senha é criptografada com bcrypt antes de ser salva no banco.

## Banco de Dados

O banco utilizado pelo sistema é:

```text
mrl_db
```

Tabelas criadas automaticamente:

- `clientes`
- `projetos`
- `contratos`
- `usuarios`

O sistema também insere automaticamente dados iniciais de clientes e projetos. Os contratos são gerados a partir dos projetos, seguindo as regras de status, andamento e custo.

## Regras de Contratos

Os contratos não são cadastrados manualmente.

Sempre que um projeto é criado, o sistema cria automaticamente um contrato vinculado ao projeto e ao cliente.

Quando um projeto é atualizado, o contrato relacionado também é sincronizado:

- Progresso do projeto atualiza o andamento do contrato.
- Valor do projeto atualiza o custo do contrato.
- Status do projeto atualiza o status do contrato.

Mapeamento de status:

| Status do Projeto | Status do Contrato |
|-------------------|--------------------|
| planejamento      | ativo              |
| andamento         | ativo              |
| suspenso          | suspenso           |
| finalizado        | finalizado         |

## Scripts Disponíveis

### Backend

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o backend com Nodemon |
| `npm start` | Inicia o backend com Node |
| `npm test` | Executa os testes com Jest |

### Frontend

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o frontend em desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Visualiza a build de produção localmente |
| `npm run lint` | Executa o ESLint |

## Passo a Passo Completo

Clone ou baixe o projeto.

Instale e configure o MySQL Server.

Configure o arquivo `backend/.env` com as credenciais do MySQL.

No primeiro terminal:

```bash
cd backend
npm install
npm run dev
```

No segundo terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse:

```text
http://localhost:5173
```

Faça login com:

```text
admin@mrl.com
admin123
```

## Observações Importantes

- O MySQL precisa estar em execução antes de iniciar o backend.
- O banco `mrl_db` é criado automaticamente.
- As tabelas são criadas automaticamente.
- Os dados iniciais não são duplicados ao reiniciar o sistema.
- Caso altere as credenciais do MySQL, atualize o arquivo `backend/.env`.

## Objetivo Acadêmico

Este sistema foi desenvolvido como parte das atividades do 4º semestre do curso de Análise e Desenvolvimento de Sistemas, aplicando conceitos de desenvolvimento full stack, arquitetura em camadas, integração com banco de dados, autenticação, organização de rotas, consumo de API e construção de interfaces com React.

## Status

Projeto em desenvolvimento.
