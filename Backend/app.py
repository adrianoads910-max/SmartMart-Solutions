from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import func
import pandas as pd # Importante para ler o CSV enviado
import io # Para ler o arquivo da memória sem salvar no disco
# Nossos módulos
from database import db, init_db
from models import Category, Product, Sale
from seeds import run_seeds

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
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # --- 1. DADOS MENSAIS ---
    query_sales = db.session.query(
        func.strftime('%Y-%m', Sale.date).label('month'),
        func.sum(Sale.total_price).label('revenue'),
        func.sum(Sale.quantity).label('quantity')
    )
    if start_date and end_date:
        query_sales = query_sales.filter(Sale.date >= start_date, Sale.date <= end_date)
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
    if start_date and end_date:
        query_products = query_products.filter(Sale.date >= start_date, Sale.date <= end_date)
    top_products_data = query_products.group_by(Product.id).order_by(func.sum(Sale.total_price).desc()).limit(5).all()

    top_products = []
    for p in top_products_data:
        p_total = p.total or 0
        percentage = (p_total / total_revenue * 100) if total_revenue > 0 else 0
        top_products.append({
            "name": p.name, "quantity": p.qty, "total": round(p_total, 2), "percentage": round(percentage, 1)
        })

    # --- 3. SHARE POR BRAND (NOVO!) ---
    query_brands = db.session.query(
        Product.brand,
        func.sum(Sale.total_price).label('total')
    ).join(Sale, Product.id == Sale.product_id)
    
    if start_date and end_date:
        query_brands = query_brands.filter(Sale.date >= start_date, Sale.date <= end_date)
        
    brands_data = query_brands.group_by(Product.brand).all()
    
    sales_by_brand = []
    for b in brands_data:
        # Só adiciona se tiver valor relevante
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
        "sales_by_brand": sales_by_brand # <--- Novo campo no JSON
    })

# --- NOVA ROTA DE UPLOAD ---
@app.route('/products/upload', methods=['POST'])
def upload_products_csv():
    """Recebe um CSV e insere/atualiza produtos."""
    
    # 1. Verifica se o arquivo foi enviado
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nome do arquivo vazio'}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Formato inválido. Envie um arquivo .csv'}), 400

    try:
        # 2. Lê o CSV da memória (não precisa salvar no disco)
        # O stream do arquivo vem em bytes, o pandas lê direto
        df = pd.read_csv(file)
        
        # 3. Validação básica das colunas
        required_columns = ['name', 'price', 'category_id']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': f'O CSV deve conter as colunas: {required_columns}'}), 400

        processed_count = 0
        errors = []

        # 4. Itera sobre as linhas e salva no banco
        for index, row in df.iterrows():
            try:
                # Verifica se a categoria existe (Evita erro de Foreign Key)
                category = Category.query.get(row['category_id'])
                if not category:
                    errors.append(f"Linha {index+1}: Categoria ID {row['category_id']} não existe.")
                    continue

                # Verifica se o produto já existe pelo ID (se fornecido) ou cria novo
                product_id = row.get('id')
                product = None
                
                if product_id and not pd.isna(product_id):
                    product = Product.query.get(product_id)
                
                if product:
                    # ATUALIZAÇÃO (Update)
                    product.name = row['name']
                    product.description = row.get('description', product.description)
                    product.price = row['price']
                    product.brand = row.get('brand', product.brand)
                    product.category_id = row['category_id']
                else:
                    # CRIAÇÃO (Insert)
                    # Se vier ID no CSV mas não existir no banco, usamos ele, senão o banco cria auto
                    new_id = int(product_id) if product_id and not pd.isna(product_id) else None
                    
                    product = Product(
                        id=new_id, 
                        name=row['name'],
                        description=row.get('description', ''),
                        price=row['price'],
                        brand=row.get('brand', ''),
                        category_id=row['category_id']
                    )
                    db.session.add(product)
                
                processed_count += 1
                
            except Exception as e:
                errors.append(f"Erro na linha {index+1}: {str(e)}")

        db.session.commit()

        return jsonify({
            'message': 'Processamento concluído',
            'success_count': processed_count,
            'errors': errors
        }), 200 if not errors else 207 # 207 Multi-Status (sucesso parcial)

    except Exception as e:
        return jsonify({'error': f'Erro ao processar arquivo: {str(e)}'}), 500
    
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)