Com certeza! Um **README.md** bem escrito é essencial, especialmente em desafios técnicos, pois ele guia o avaliador sobre como rodar o projeto e demonstra sua capacidade de documentação.

Como o PDF pedia especificamente para incluir as respostas das "Questões Teóricas" no README, eu já as incluí no final do arquivo com respostas técnicas de alto nível.

Aqui está o arquivo pronto para você copiar e colar na raiz do seu projeto:

```markdown
# 🛒 SmartMart Solutions - Dashboard & Gestão de Produtos

> Desafio Técnico Fullstack | Python (Flask) + React (Vite)

Este projeto é um protótipo funcional desenvolvido para a **SmartMart Solutions**, focado na visualização de dados de vendas (Dashboard) e no gerenciamento de catálogo de produtos (CRUD).

O sistema foi construído com foco em **UX/UI moderna**, utilizando **Ant Design** para componentes visuais e **Recharts** para visualização de dados, com um backend leve em **Flask**.

---

## 🚀 Funcionalidades Principais

### 📊 Dashboard Interativo
- **KPIs em Tempo Real:** Visualização rápida de Vendas Totais, Receita Bruta e Lucro Estimado.
- **Filtro de Período:** Seletor de data (`DateRangePicker`) que atualiza todas as métricas e gráficos dinamicamente.
- **Gráficos Visuais:**
  - Evolução de Vendas (Barras) e Faturamento (Área).
  - **Market Share por Marca:** Gráfico de Rosca (Donut) mostrando a participação de cada marca no faturamento.
- **Ranking de Produtos:** Tabela de "Top 5 Produtos" com medalhas (🥇, 🥈, 🥉) para os líderes e barra de progresso visual.

### 📦 Gestão de Produtos
- **Listagem Avançada:** Tabela com paginação automática.
- **Filtros e Busca:** Filtragem por Categoria (Select) e Busca Textual (Nome, Marca ou ID) em tempo real.
- **Detalhes Expansíveis:** Clique na linha para expandir e ver a descrição completa do produto.
- **CRUD Completo via Drawer:**
  - **Criação:** Formulário lateral deslizante (Drawer) que sugere automaticamente o próximo ID sequencial.
  - **Edição:** Carrega os dados do produto no mesmo formulário lateral.
  - **Exclusão:** Botão com confirmação de segurança (`Popconfirm`).
- **Importação de CSV:** (Backend preparado) Rota `/products/upload` implementada para carga em lote.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Linguagem:** Python 3+
- **Framework:** Flask
- **Banco de Dados:** SQLite (com SQLAlchemy ORM)
- **Manipulação de Dados:** Pandas (para leitura de CSV e processamento)
- **CORS:** Flask-CORS para integração com o frontend.

### Frontend (Interface)
- **Framework:** React (Vite)
- **Estilização:** Tailwind CSS + Ant Design (AntD)
- **Gráficos:** Recharts
- **Http Client:** Axios
- **Ícones:** Ant Design Icons

---

## ⚙️ Como Rodar o Projeto

Siga os passos abaixo para executar a aplicação localmente.

### Pré-requisitos
- Python 3.8+
- Node.js 16+

### 1. Configurando o Backend

Navegue até a pasta do backend:
```bash
cd backend

```

Instale as dependências:

```bash
pip install flask flask-sqlalchemy flask-cors pandas

```

Execute o servidor (o banco será criado e populado automaticamente via `seeds.py` na primeira execução):

```bash
python app.py

```

*O servidor rodará em: `http://localhost:5000*`

### 2. Configurando o Frontend

Abra um novo terminal e navegue até a pasta do frontend:

```bash
cd frontend

```

Instale as dependências:

```bash
npm install
npm i -g pnpm

```

Rode o projeto:

```bash
pnpm run dev

```

*Acesse a aplicação em: `http://localhost:5173` (ou a porta indicada no terminal)*

---

## 📂 Estrutura do Projeto

```text
/
├── backend/
│   ├── app.py           # Rotas e Entrypoint
│   ├── database.py      # Configuração do SQLite
│   ├── models.py        # Modelos (Product, Sale, Category)
│   ├── seeds.py         # Script de carga inicial dos CSVs
│   └── *.csv            # Arquivos de dados iniciais
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/  # Componentes isolados (Charts, KPI Cards)
    │   │   └── layout/     # MainLayout (Sidebar + Header)
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   └── Products.jsx
    │   └── services/       # Configuração do Axios (api.js)

```

