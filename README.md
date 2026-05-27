# TicketHub — Projeto Integrador Cloud Developing 2026/1

> Plataforma de ingressos para shows, festivais e eventos esportivos.
> CRUD completo + API Gateway + Lambda /report + RDS MySQL + Front-end containerizado.

**Grupo:**

1. 10438316 - Kauan Rodrigues - Back-end (API REST, Dockerfile, schema SQL)
2. 10439810 - Luana Santos - Back-end (API REST, Dockerfile, schema SQL)
3. 10437382 - Marcelo Takao - Front-end (HTML/CSS/JS, Dockerfile)
4. 10431850 - Rafael Trindade - Infra AWS (VPC, RDS, ECS, API Gateway, Lambda)

---

## 1. Visão Geral

O **TicketHub** é uma plataforma simples de listagem e gerenciamento de eventos (shows, festivais, jogos de futebol, teatro, etc.), inspirada no Ticketmaster.  
A entidade principal é **Event**, que passa pelas 4 operações CRUD expostas via API REST.

---

## 2. Arquitetura

```
Browser
  └─▶ API Gateway
         ├─▶ /events*  ──▶  ECS Fargate (Back-end)  ──▶  RDS MySQL (subnet privada)
         │                         ▲
         │              ECS Fargate (Front-end) ──(interno)──▶ API Gateway
         └─▶ /report   ──▶  Lambda  ──▶  (fetch /events via API Gateway)
```

| Camada     | Serviço                    | Descrição                                  |
|------------|----------------------------|--------------------------------------------|
| Back-end   | ECS Fargate + Docker       | API REST Node.js/Express → RDS             |
| Front-end  | ECS Fargate + Docker       | SPA HTML/CSS/JS servida pelo Express       |
| Banco      | Amazon RDS MySQL           | Subnet privada, sem porta exposta          |
| Gateway    | Amazon API Gateway         | Roteia /events* → ECS · /report → Lambda  |
| Serverless | AWS Lambda                 | Gera estatísticas consumindo a API         |

---

## 3. Estrutura do Repositório

```
tickethub/
├── backend/
│   ├── src/
│   │   ├── index.js            # Entry point Express
│   │   ├── db/connection.js    # Pool MySQL
│   │   └── routes/events.js   # CRUD /events
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── index.html          # SPA completa
│   │   └── style.css
│   ├── server.js               # Express serve arquivos estáticos
│   ├── Dockerfile
│   └── package.json
├── infra/
│   ├── schema.sql              # Criação da tabela + dados de exemplo
│   └── lambda/
│       └── handler.mjs         # Função Lambda /report
├── docker-compose.yml          # Ambiente local completo
└── README.md
```

---

## 4. Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USER/tickethub.git
cd tickethub

# 2. Suba tudo com Docker Compose (banco + backend + frontend)
docker compose up --build

# 3. Acesse
# Front-end: http://localhost:8080
# API:       http://localhost:3000
# Banco:     localhost:3306 (admin / admin123)
```

> **Nota:** localmente o front-end chama a API diretamente em `http://localhost:3000`.  
> Na AWS, ele chamará via API Gateway. Basta trocar `API_BASE` no `index.html`.

---

## 5. Endpoints da API

| Método | Rota          | Descrição                  |
|--------|---------------|----------------------------|
| GET    | /events       | Lista todos os eventos      |
| GET    | /events/:id   | Busca evento por ID         |
| POST   | /events       | Cria novo evento            |
| PUT    | /events/:id   | Atualiza evento             |
| DELETE | /events/:id   | Remove evento               |
| GET    | /health       | Health check                |

### Exemplo — POST /events
```json
{
  "name": "Show da Madonna",
  "description": "The Celebration Tour",
  "venue": "Copacabana",
  "city": "Rio de Janeiro",
  "event_date": "2026-11-01T21:00:00",
  "category": "show",
  "total_tickets": 100000,
  "price": 500.00
}
```

---

## 6. Lambda /report

A função em `infra/lambda/handler.mjs` consome o endpoint `/events` via API Gateway e retorna:

```json
{
  "generated_at": "...",
  "summary": {
    "total_events": 5,
    "average_price_brl": 328.00,
    "total_tickets": 329000,
    "available_tickets": 329000,
    "sold_tickets": 0,
    "occupancy_rate_pct": "0.0"
  },
  "by_category": { "show": 2, "festival": 2, "sports": 1 },
  "by_city": { "São Paulo": 3, "Rio de Janeiro": 2 },
  "highlights": { ... },
  "upcoming_events": [ ... ]
}
```

**Variável de ambiente da Lambda:** `API_BASE_URL` = URL base do API Gateway (ex: `https://xxxx.execute-api.us-east-1.amazonaws.com/prod`).

---

## 7. Checklist de Entrega

- [x] API CRUD cobre 4 operações (GET, POST, PUT, DELETE)
- [ ] Banco RDS criado em subnet privada; porta 3306 não exposta
- [x] Imagem Docker (backend e frontend com Dockerfile)
- [ ] API Gateway roteando /events* → ECS e /report → Lambda
- [x] Lambda consome a API via HTTP, gera JSON de relatório (não acessa RDS)
- [x] docker-compose.yml para rodar localmente
- [x] schema.sql com criação da tabela e dados de exemplo
- [ ] README completo + diagrama PNG em docs/
- [ ] PDF ≤ 12 páginas com capturas de tela
- [ ] Vídeo ≤ 5 min demonstrando CRUD e /report
- [ ] ZIP final com código + PDF + link do vídeo
