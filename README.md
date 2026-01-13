# 🛒 SmartMart Solutions - Dashboard & Gestão de Produtos

> Desafio Técnico Fullstack | Python (Flask) + React (Vite)

Este projeto é um protótipo funcional desenvolvido para a **SmartMart Solutions**, focado na visualização de dados de vendas (Dashboard), no gerenciamento de catálogo de produtos (CRUD) e no controle de transações (Histórico de Vendas).

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

### 📜 Histórico de Vendas (Novo)
- **Listagem Completa:** Tabela detalhada de todas as transações realizadas.
- **Busca Inteligente:** Filtro local por nome do produto, categoria ou data.
- **Recibo Digital (Expandable):** Ao clicar na venda, abre-se um detalhe estilo "cupom" mostrando o cálculo (Preço Unitário × Quantidade = Total).
- **PDV (Ponto de Venda):**
  - **Nova Venda:** Formulário inteligente que preenche o preço unitário ao selecionar o produto e calcula o total automaticamente.
  - **Edição:** Permite ajustar quantidade ou data, recalculando os valores em tempo real.
- **Exportação:** Botão para baixar o relatório de vendas atual em **CSV** instantaneamente.

### 📦 Gestão de Produtos
- **Listagem Avançada:** Tabela com paginação automática e exportação para CSV.
- **Filtros e Busca:** Filtragem por Categoria (Select) e Busca Textual (Nome, Marca ou ID) em tempo real.
- **CRUD Completo via Drawer:**
  - **Criação:** Formulário lateral que sugere o próximo ID sequencial.
  - **Categorias:** Criação rápida de novas categorias sem sair da tela de cadastro.
  - **Edição/Exclusão:** Atualização de dados e remoção com trava de segurança (`Popconfirm`).
- **Importação em Lote:** Upload de arquivo CSV (rota `/products/upload`) processado via Pandas no backend.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Linguagem:** Python 3+
- **Framework:** Flask
- **Banco de Dados:** SQLite (com SQLAlchemy ORM)
- **Manipulação de Dados:** Pandas (para leitura de CSV e processamento)
- **CORS:** Flask-CORS para integração.

### Frontend (Interface)
- **Framework:** React (Vite)
- **Estilização:** Tailwind CSS + Ant Design (AntD)
- **Gráficos:** Recharts
- **Manipulação de Datas:** Day.js
- **Http Client:** Axios

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

Execute o servidor (o banco será criado e populado automaticamente na primeira execução):

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
# Ou se preferir pnpm:
# npm i -g pnpm
# pnpm install

```

Rode o projeto:

```bash
npm run dev
# Ou: pnpm run dev

```

*Acesse a aplicação em: `http://localhost:5173*`

---

## 📂 Estrutura do Projeto

```text
/
├── backend/
│   ├── app.py           # Rotas, Models e Lógica de Negócio
│   ├── database.py      # Configuração do SQLite
│   ├── seeds.py         # Script de carga inicial
│   └── *.csv            # Arquivos de dados iniciais
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/      # Gráficos, Cards e Drawers (AddSaleDrawer)
    │   │   └── layout/         # MainLayout (Sidebar + Header)
    │   ├── pages/
    │   │   ├── Dashboard.jsx   # Visão Geral (KPIs)
    │   │   ├── SalesHistory.jsx# Histórico de Vendas (Tabela + PDV)
    │   │   ├── Products.jsx    # Lista de Produtos
    │   │   └── AddProduct.jsx  # Tela de Cadastro (Fallback)
    │   ├── services/           # Configuração do Axios (api.js)
    │   └── utils/              # Funções utilitárias (exportCsv.js)

```
