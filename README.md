# AeroTelemetry API

API REST desenvolvida com **Node.js, TypeScript, Express e PostgreSQL** para gerenciamento de usuários, veículos, sessões e dados de telemetria.

O AeroTelemetry é um projeto pessoal criado para aplicar conceitos de **engenharia de software, desenvolvimento backend, arquitetura de APIs, bancos de dados e sistemas de telemetria**.

O objetivo de longo prazo é permitir a coleta, armazenamento, processamento e visualização de dados de telemetria de veículos, com foco inicial em aeronaves.

> **Status:** Em desenvolvimento.

---

## Sobre o projeto

O AeroTelemetry foi criado como um ambiente de estudo e evolução prática em desenvolvimento backend.

A aplicação atualmente trabalha com a seguinte relação principal:

```text
User
  |
  └── Vehicle
        |
        └── Telemetry Session
                |
                └── Telemetry Data
```

Cada usuário pode possuir vários veículos.

Cada veículo pode possuir várias sessões de telemetria.

Cada sessão poderá armazenar múltiplos registros coletados ao longo do tempo.

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Autenticação com JWT
- Hash de senhas com bcrypt
- Middleware para proteção de rotas
- Identificação do usuário autenticado

### Vehicles

- Cadastro de veículos
- Listagem dos veículos do usuário
- Busca de veículo por ID
- Associação do veículo ao usuário autenticado
- Validação de propriedade do recurso

Exemplo da estrutura utilizada pela aplicação:

```ts
interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  active: boolean;
  userId: string;
  createdAt: Date;
}
```

### Telemetry Sessions

As sessões representam períodos de coleta de dados de determinado veículo.

Atualmente o projeto possui operações para:

- criar sessões;
- listar sessões do usuário;
- consultar uma sessão específica;
- listar sessões relacionadas a determinado veículo;
- validar se o usuário possui acesso ao veículo e à sessão.

Algumas das rotas utilizadas são:

```http
GET /sessions
GET /sessions/:sessionId
GET /vehicles/:vehicleId/sessions
```

---

## Telemetria

A estrutura do banco de dados para armazenamento de telemetria já está sendo desenvolvida.

A modelagem foi separada entre dados gerais de telemetria e informações específicas de aeronaves.

### `telemetry_data`

Responsável pelas informações comuns coletadas durante uma sessão.

Exemplos:

```text
id
session_id
recorded_at
speed_mps
latitude
longitude
acceleration_mps
```

### `aircraft_telemetry`

Responsável por dados específicos relacionados a aeronaves.

Essa separação permite que futuramente outros tipos de veículos sejam suportados sem concentrar todas as informações em uma única tabela.

---

## Arquitetura atual

A aplicação atualmente segue uma separação baseada em:

```text
Request
   |
   v
Route
   |
   v
Middleware
   |
   v
Controller
   |
   v
Repository
   |
   v
PostgreSQL
```

### Routes

Responsáveis por definir os endpoints disponíveis pela API.

### Middlewares

Responsáveis por tarefas intermediárias, como autenticação e validação de acesso.

### Controllers

Recebem as requisições HTTP, extraem as informações necessárias e retornam as respostas da API.

### Repositories

Responsáveis pelo acesso ao banco de dados e execução das queries SQL.

### Database

O PostgreSQL é utilizado para persistência dos dados.

---

## Evolução arquitetural

A arquitetura está sendo evoluída gradualmente.

Uma das próximas melhorias planejadas é adicionar uma camada de **Services** entre Controllers e Repositories:

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Database
```

Essa camada será responsável por concentrar regras de negócio e reduzir o acoplamento entre os controllers e o acesso ao banco de dados.

O projeto busca aplicar progressivamente princípios como:

- Separation of Concerns
- Single Responsibility Principle
- Dependency Inversion
- Repository Pattern
- validação de entrada
- baixo acoplamento
- alta coesão

---

## Estrutura do projeto

A estrutura do projeto segue aproximadamente:

```text
src/
├── controllers/
├── db/
├── interfaces/
├── middlewares/
├── repositories/
├── routes/
├── schemas/
├── services/
├── types/
├── utils/
└── app.ts
```

As pastas podem evoluir conforme novas responsabilidades forem adicionadas ao sistema.

---

## Banco de dados

O projeto utiliza **PostgreSQL** como banco de dados relacional.

A relação principal entre as entidades pode ser representada da seguinte forma:

```text
users
  |
  | 1:N
  v
vehicles
  |
  | 1:N
  v
telemetry_sessions
  |
  | 1:N
  v
telemetry_data
  |
  | dados específicos
  v
aircraft_telemetry
```

Essa modelagem mantém clara a propriedade dos recursos:

```text
User -> Vehicle -> Session -> Telemetry
```

---

## API Endpoints

### Sessions

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/sessions` | Lista as sessões do usuário autenticado |
| `GET` | `/sessions/:sessionId` | Busca uma sessão específica |
| `GET` | `/vehicles/:vehicleId/sessions` | Lista as sessões de determinado veículo |

Outros endpoints relacionados à autenticação, usuários e veículos também fazem parte da API e serão documentados conforme a estrutura das rotas for consolidada.

---

## Tecnologias

### Backend

- Node.js
- TypeScript
- Express
- REST API

### Banco de dados

- PostgreSQL
- `pg`

### Autenticação

- JSON Web Token
- bcryptjs

### Validação

- Zod

### Desenvolvimento

- tsx
- nodemon
- npm

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL em container
- pgAdmin

---

## Segurança

A API utiliza JWT para autenticação de usuários.

Recursos pertencentes a um usuário são consultados utilizando também o identificador do proprietário.

Exemplo:

```sql
SELECT *
FROM vehicles
WHERE id = $1
AND user_id = $2;
```

Dessa forma, não é suficiente conhecer o ID de determinado recurso: o recurso também precisa pertencer ao usuário autenticado.

Esse padrão também é aplicado às sessões e será utilizado para os dados de telemetria.

---

## Executando o projeto

### Pré-requisitos

Certifique-se de possuir:

```text
Node.js
npm
PostgreSQL
Docker
```

### Clone o repositório

```bash
git clone <repository-url>
cd AeroTelemetryApi
```

### Instale as dependências

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL=
JWT_SECRET=
```

Adicione ao arquivo apenas as variáveis utilizadas pela configuração atual da aplicação.

O arquivo `.env` não deve ser versionado.

É recomendado disponibilizar um arquivo:

```text
.env.example
```

contendo apenas os nomes das variáveis necessárias, sem valores sensíveis.

### Execute em desenvolvimento

```bash
npm run dev
```

---

## Docker

O Docker é utilizado para executar serviços necessários durante o desenvolvimento, principalmente o PostgreSQL.

A infraestrutura do projeto está evoluindo para uma configuração baseada em Docker Compose.

Exemplo:

```text
Docker Compose
     |
     ├── AeroTelemetry API
     |
     ├── PostgreSQL
     |
     └── pgAdmin
```

Isso permite executar os serviços em containers separados e conectados por uma rede Docker.

---

## Roadmap

### Base da API

- [x] Configuração do projeto Node.js
- [x] TypeScript
- [x] Express
- [x] PostgreSQL
- [x] Conexão com banco de dados
- [x] Autenticação com JWT
- [x] Hash de senhas
- [x] Middleware de autenticação

### Vehicles

- [x] Criar veículo
- [x] Listar veículos
- [x] Buscar veículo por ID
- [x] Associar veículo ao usuário
- [x] Validar propriedade do veículo

### Sessions

- [x] Criar estrutura de sessões
- [x] Relacionar sessão ao veículo
- [x] Listar sessões
- [x] Buscar sessão por ID
- [x] Buscar sessões por veículo
- [x] Validar propriedade dos recursos

### Telemetry

- [x] Modelagem inicial de `telemetry_data`
- [x] Modelagem de dados específicos de aeronaves
- [ ] Implementar endpoint de ingestão de telemetria
- [ ] Validar payload com Zod
- [ ] Criar `TelemetryService`
- [ ] Criar `TelemetryRepository`
- [ ] Persistir dados de telemetria
- [ ] Utilizar transactions no PostgreSQL
- [ ] Implementar consulta de telemetria por sessão
- [ ] Implementar paginação

Endpoint planejado:

```http
POST /sessions/:sessionId/telemetry
```

### Simulador de telemetria

- [ ] Criar script em Node.js para geração de dados simulados
- [ ] Simular velocidade
- [ ] Simular posição
- [ ] Simular aceleração
- [ ] Enviar telemetria periodicamente para a API
- [ ] Simular uma sessão completa

Fluxo planejado:

```text
Telemetry Simulator
        |
        | HTTP
        v
AeroTelemetry API
        |
        v
Telemetry Controller
        |
        v
Telemetry Service
        |
        v
Telemetry Repository
        |
        v
PostgreSQL
```

### Analytics

- [ ] Duração da sessão
- [ ] Quantidade de registros
- [ ] Velocidade média
- [ ] Velocidade máxima
- [ ] Distância percorrida
- [ ] Estatísticas da sessão

### Real-time

- [ ] WebSockets
- [ ] Streaming de telemetria
- [ ] Sessões em tempo real
- [ ] Atualização de dashboards em tempo real

### Frontend

- [ ] Dashboard web
- [ ] Autenticação
- [ ] Gerenciamento de veículos
- [ ] Gerenciamento de sessões
- [ ] Gráficos de telemetria
- [ ] Visualização de sessão em tempo real

---

## Próximos passos

O foco atual do desenvolvimento está na implementação do fluxo de ingestão de telemetria:

```text
POST /sessions/:sessionId/telemetry
                |
                v
        TelemetryController
                |
                v
         TelemetryService
                |
                v
       TelemetryRepository
                |
                v
          PostgreSQL
```

Depois dessa etapa, será desenvolvido um simulador capaz de gerar telemetria fictícia e enviá-la para a API.

Isso permitirá testar o fluxo completo:

```text
Vehicle
   |
   v
Session
   |
   v
Telemetry Generation
   |
   v
API
   |
   v
Database
   |
   v
Analytics
```

---

## Objetivo de longo prazo

O objetivo do AeroTelemetry é evoluir de uma API tradicional para uma plataforma capaz de trabalhar com um fluxo completo de telemetria:

```text
Vehicle
   |
   v
Telemetry Session
   |
   v
Telemetry Stream
   |
   v
Data Persistence
   |
   v
Data Processing
   |
   v
Analytics
   |
   v
Real-time Visualization
```

O projeto também serve como ambiente de estudo para temas como:

- arquitetura de software;
- APIs REST;
- PostgreSQL;
- Docker;
- sistemas distribuídos;
- processamento de dados;
- comunicação em tempo real;
- telemetria;
- simulação.

---

## Autor

**Luan Henrique**

Estudante de Engenharia de Software com interesse em desenvolvimento backend, arquitetura de software, sistemas distribuídos, simulação e tecnologia aplicada à aviação.

---

Este projeto está em desenvolvimento contínuo. A arquitetura, os endpoints e a modelagem podem evoluir conforme novas funcionalidades são implementadas.