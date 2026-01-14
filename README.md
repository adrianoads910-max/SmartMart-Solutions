
# 🛒 SmartMart Solutions - Dashboard & Gestão de Produtos

> Desafio Técnico Fullstack | Python (Flask) + React (Vite)

Este projeto é um protótipo funcional desenvolvido para a **SmartMart Solutions**, focado na visualização de dados de vendas (Dashboard), no gerenciamento de catálogo de produtos (CRUD) e no controle de transações (Histórico de Vendas).

O sistema foi construído com foco em **UX/UI moderna**, utilizando **Ant Design** para componentes visuais e **Recharts** para visualização de dados.

---

## 🔄 Branchs & Modos de Execução

O projeto foi estruturado em duas branches principais para atender diferentes cenários de deploy e teste:

### 1. Branch `main` (Modo Fullstack Real)
- **Arquitetura:** Frontend (React) conectado a uma API Real (Python/Flask).
- **Banco de Dados:** SQLite (Local).
- **Requisito:** Necessário rodar o backend e o frontend simultaneamente.

### 2. Branch `demo-static` (Modo Demonstração / Firebase)
- **Arquitetura:** Frontend Autônomo ("Serverless Mock").
- **Dados:** Utiliza `localStorage` do navegador e CSVs embutidos para simular um banco de dados e latência de rede.
- **Requisito:** Roda apenas com o Frontend (não precisa de Python instalado).


**Como alternar entre as versões:**
```bash
# Para desenvolver com Backend Python
git checkout main

# Para gerar build de demonstração (sem backend)
git checkout demo-static

```

---

## 🚀 Funcionalidades Principais

### 📊 Dashboard Interativo

* **KPIs em Tempo Real:** Visualização rápida de Vendas Totais, Receita Bruta e Lucro Estimado.
* **Filtros Dinâmicos:** Seletor de data, categorias e marcas que atualizam os gráficos instantaneamente.
* **Gráficos Visuais:**
* Evolução de Vendas (Barras) e Faturamento (Área).
* **Market Share:** Gráfico de Rosca (Donut) mostrando a participação de cada marca.


* **Ranking:** Tabela de "Top 5 Produtos" com medalhas (🥇, 🥈, 🥉).

### 📜 Histórico de Vendas (PDV)

* **Listagem & Controle:** Tabela detalhada de todas as transações realizadas.
* **Recibo Digital:** Detalhe expansível estilo "cupom" (Preço Unitário × Qtd = Total).
* **Nova Venda (Cálculo Automático):** Ao selecionar um produto, o sistema preenche o preço e calcula o total com base na quantidade.
* **Edição de Vendas:** Permite corrigir lançamentos (quantidade, data ou valor) diretamente na tabela.
* **Exportação de Dados:** Botão para **baixar o histórico de vendas** completo em arquivo **CSV** para análises externas.

### 📦 Gestão de Produtos

* **CRUD Completo:** Criação, Leitura, Atualização e Exclusão de produtos via formulários laterais (Drawer).
* **Importação e Exportação (CSV):**
* **Importar:** Upload de arquivo CSV para cadastro em massa de produtos.
* **Baixar Lista:** Download do catálogo completo de produtos em CSV.


* **Categorização Rápida:** Criação de novas categorias sem sair da tela de cadastro.
* **Edição Fácil:** Atualize preços, marcas e descrições com poucos cliques.

---

## 🛠️ Tecnologias Utilizadas

### Backend (Branch `main`)

* **Linguagem:** Python 3+
* **Framework:** Flask
* **ORM:** SQLAlchemy (SQLite/Postgres)
* **Processamento:** Pandas (para leitura eficiente de CSV)

### Frontend

* **Framework:** React (Vite)
* **Estilização:** Tailwind CSS + Ant Design 5.0 (ConfigProvider Theme: Teal)
* **Gráficos:** Recharts
* **Http Client:** Axios (na main) / Mock Service (na demo-static)

---

## ⚙️ Como Rodar o Projeto (Localmente)

### Pré-requisitos

* Node.js 16+
* Python 3.8+ (Apenas para branch `main`)

### 1. Configurando o Backend (Branch `main` apenas)

```bash
cd backend
pip install flask flask-sqlalchemy flask-cors pandas
python app.py

```

*O servidor rodará em: `http://localhost:5000*`

### 2. Configurando o Frontend

```bash
cd frontend
npm install
npm run dev

```

*Acesse em: `http://localhost:5173*`

---

## ☁️ Deploy (Firebase Hosting)

Esta aplicação está configurada para deploy estático utilizando a branch `demo-static`.

1. Mude para a branch de demonstração:
```bash
git checkout demo-static

```


2. Gere o build de produção:
```bash
cd frontend
npm run build

```


3. Faça o deploy (necessário Firebase CLI):
```bash
firebase deploy

```
