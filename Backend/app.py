from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import func
import pandas as pd # Importante para ler o CSV enviado
import io # Para ler o arquivo da memória sem salvar no disco
# Nossos módulos
from database import db, init_db
from models import Category, Product, Sale
from seeds import run_seeds
from datetime import datetime

app = Flask(__name__)
CORS(app) # Permite conexão com o Frontend

# 1. Configura e Inicia o Banco
init_db(app)

# 2. Roda o Seed na inicialização
run_seeds(app)

# --- ROTAS ---

@app.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@app.route('/products', methods=['GET'])
def get_products():
    cat_id = request.args.get('category_id')
    query = Product.query
    if cat_id:
        query = query.filter_by(category_id=cat_id)
    
    products = query.all()
    return jsonify([p.to_dict() for p in products])

@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    # 1. Captura Filtros da URL
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    cat_id = request.args.get('category_id') # Novo
    brand = request.args.get('brand')        # Novo

    # --- FUNÇÃO AUXILIAR DE FILTRO ---
    # Aplica os filtros em qualquer query que tenha join com Product e Sale
    def apply_filters(query):
        if start_date and end_date:
            query = query.filter(Sale.date >= start_date, Sale.date <= end_date)
        if cat_id:
            query = query.filter(Product.category_id == cat_id)
        if brand:
            query = query.filter(Product.brand == brand)
        return query

    # --- 1. DADOS MENSAIS (Gráficos) ---
    # Precisamos do JOIN com Product agora para filtrar por Marca/Categoria
    query_sales = db.session.query(
        func.strftime('%Y-%m', Sale.date).label('month'),
        func.sum(Sale.total_price).label('revenue'),
        func.sum(Sale.quantity).label('quantity')
    ).join(Product, Sale.product_id == Product.id) # Join necessário para o filtro

    query_sales = apply_filters(query_sales) # Aplica filtros
    sales_by_month = query_sales.group_by('month').order_by('month').all()

    chart_data = []
    total_revenue = 0
    total_sales = 0

    for s in sales_by_month:
        rev = s.revenue or 0
        qtd = s.quantity or 0
        chart_data.append({"name": s.month, "revenue": round(rev, 2), "quantity": qtd})
        total_revenue += rev
        total_sales += qtd

    # --- 2. TOP PRODUTOS ---
    query_products = db.session.query(
        Product.name,
        func.sum(Sale.quantity).label('qty'),
        func.sum(Sale.total_price).label('total')
    ).join(Sale, Product.id == Sale.product_id)
    
    query_products = apply_filters(query_products) # Aplica filtros
    
    top_products_data = query_products.group_by(Product.id).order_by(func.sum(Sale.total_price).desc()).limit(5).all()

    top_products = []
    for p in top_products_data:
        p_total = p.total or 0
        percentage = (p_total / total_revenue * 100) if total_revenue > 0 else 0
        top_products.append({
            "name": p.name, "quantity": p.qty, "total": round(p_total, 2), "percentage": round(percentage, 1)
        })

    # --- 3. SHARE POR BRAND ---
    query_brands = db.session.query(
        Product.brand,
        func.sum(Sale.total_price).label('total')
    ).join(Sale, Product.id == Sale.product_id)
    
    query_brands = apply_filters(query_brands) # Aplica filtros
    
    brands_data = query_brands.group_by(Product.brand).all()
    
    sales_by_brand = []
    for b in brands_data:
        if b.total and b.total > 0:
            sales_by_brand.append({
                "name": b.brand,
                "value": round(b.total, 2)
            })

    return jsonify({
        "chart_data": chart_data,
        "metrics": {
            "total_revenue": round(total_revenue, 2),
            "total_sales": total_sales,
            "total_profit": round(total_revenue * 0.30, 2)
        },
        "top_products": top_products,
        "sales_by_brand": sales_by_brand
    })
    
    # --- ROTA PARA PEGAR O PRÓXIMO ID ---
@app.route('/products/next-id', methods=['GET'])
def get_next_product_id():
    # Pega o produto com o maior ID
    last_product = Product.query.order_by(Product.id.desc()).first()
    next_id = 1
    if last_product:
        next_id = last_product.id + 1
    
    return jsonify({'next_id': next_id})

# --- ROTA PARA CRIAR PRODUTO (Manual) ---
@app.route('/products', methods=['POST'])
def create_product():
    data = request.json
    
    # Verifica se o ID já existe (segurança)
    if Product.query.get(data['id']):
        return jsonify({'error': 'ID já existe. Tente outro.'}), 400

    try:
        new_product = Product(
            id=data['id'],
            name=data['name'],
            price=data['price'],
            brand=data['brand'],
            category_id=data['category_id'],
            description=data.get('description', '')
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'message': 'Produto criado com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    # --- ATUALIZAR PRODUTO (PUT) ---
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Produto não encontrado'}), 404
    
    data = request.json
    try:
        product.name = data['name']
        product.price = data['price']
        product.brand = data['brand']
        product.category_id = data['category_id']
        product.description = data.get('description', '')
        
        db.session.commit()
        return jsonify({'message': 'Produto atualizado!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- EXCLUIR PRODUTO (DELETE) ---
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Produto não encontrado'}), 404
        
    try:
        # Nota: Se houver vendas ligadas a este produto, o SQLite pode reclamar (IntegrityError).
        # O ideal seria deletar as vendas antes ou usar Cascade, mas para o teste simples:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Produto excluído!'})
    except Exception as e:
        return jsonify({'error': 'Não é possível excluir produto com vendas associadas.'}), 400
    
# --- LISTAR HISTÓRICO DE VENDAS ---
@app.route('/sales', methods=['GET'])
def get_sales_history():
    results = db.session.query(Sale, Product, Category)\
        .join(Product, Sale.product_id == Product.id)\
        .join(Category, Product.category_id == Category.id)\
        .order_by(Sale.date.desc())\
        .all()

    sales_list = []
    for sale, product, category in results:
        sales_list.append({
            "id": sale.id,
            "date": sale.date.strftime('%Y-%m-%d'),
            "quantity": sale.quantity,
            "total_price": sale.total_price,
            "product_name": product.name,
            "category_name": category.name,
            
            # --- ADICIONE ESTA LINHA ---
            "product_description": product.description 
        })

    return jsonify(sales_list)

# --- ATUALIZAR VENDA (PUT) ---
@app.route('/sales/<int:id>', methods=['PUT'])
def update_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({'error': 'Venda não encontrada'}), 404
    
    data = request.json
    try:
        # Atualiza os campos editáveis
        sale.quantity = data['quantity']
        sale.total_price = data['total_price']
        
        # Converte a string de data (YYYY-MM-DD) para objeto Python Date
        if 'date' in data:
            sale.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            
        db.session.commit()
        return jsonify({'message': 'Venda atualizada com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- EXCLUIR VENDA (DELETE) ---
@app.route('/sales/<int:id>', methods=['DELETE'])
def delete_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({'error': 'Venda não encontrada'}), 404
        
    try:
        db.session.delete(sale)
        db.session.commit()
        return jsonify({'message': 'Venda excluída!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# --- PRÓXIMO ID DE VENDA ---
@app.route('/sales/next-id', methods=['GET'])
def get_next_sale_id():
    last_sale = Sale.query.order_by(Sale.id.desc()).first()
    next_id = 1
    if last_sale:
        next_id = last_sale.id + 1
    return jsonify({'next_id': next_id})

# --- CRIAR NOVA VENDA (POST) ---
@app.route('/sales', methods=['POST'])
def create_sale():
    data = request.json
    try:
        new_sale = Sale(
            id=data['id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            total_price=data['total_price'],
            # Converte string 'YYYY-MM-DD' para objeto date
            date=datetime.strptime(data['date'], '%Y-%m-%d').date()
        )
        db.session.add(new_sale)
        db.session.commit()
        return jsonify({'message': 'Venda registrada com sucesso!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# --- CRIAR NOVA CATEGORIA (Rápida) ---
@app.route('/categories', methods=['POST'])
def create_category():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome é obrigatório'}), 400
        
    try:
        # Verifica se já existe
        exists = Category.query.filter_by(name=name).first()
        if exists:
            return jsonify({'error': 'Categoria já existe', 'id': exists.id}), 400

        new_cat = Category(name=name)
        db.session.add(new_cat)
        db.session.commit()
        return jsonify({'message': 'Categoria criada!', 'id': new_cat.id, 'name': new_cat.name}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- UPLOAD CSV DE PRODUTOS ---
@app.route('/products/upload', methods=['POST'])
def upload_products_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

    try:
        # Lê o CSV usando Pandas
        df = pd.read_csv(file)
        
        count = 0
        for index, row in df.iterrows():
            # Verifica se o ID já existe para não quebrar (ou poderia atualizar)
            if not Product.query.get(row['id']):
                prod = Product(
                    id=row['id'],
                    name=row['name'],
                    brand=row['brand'],
                    price=row['price'],
                    category_id=row['category_id'],
                    description=row.get('description', '')
                )
                db.session.add(prod)
                count += 1
        
        db.session.commit()
        return jsonify({'message': f'{count} produtos importados com sucesso!'})
    except Exception as e:
        return jsonify({'error': f'Erro ao processar CSV: {str(e)}'}), 500    

if __name__ == '__main__':
    app.run(debug=True, port=5000)