import pandas as pd
import os
from database import db
from models import Category, Product, Sale

def run_seeds(app):
    """Lê CSVs e popula o banco se estiver vazio."""
    print("Verificando necessidade de popular banco de dados...")
    
    with app.app_context():
        # Se já existir o primeiro produto, assumimos que o banco já está populado
        if Product.query.first():
            print("Banco de dados já contém dados. Seed pulado.")
            return

        print("Iniciando carga de dados dos CSVs...")
        try:
            # Caminho base para garantir que o script encontre os CSVs
            BASE_DIR = os.path.abspath(os.path.dirname(__file__))
            
            # Leitura
            df_cat = pd.read_csv(os.path.join(BASE_DIR, 'categories.csv'))
            df_prod = pd.read_csv(os.path.join(BASE_DIR, 'products.csv'))
            df_sales = pd.read_csv(os.path.join(BASE_DIR, 'sales.csv'), parse_dates=['date'])

            # Inserção Categorias
            for _, row in df_cat.iterrows():
                if not Category.query.get(row['id']):
                    db.session.add(Category(id=row['id'], name=row['name']))
            
            # Inserção Produtos
            for _, row in df_prod.iterrows():
                if not Product.query.get(row['id']):
                    db.session.add(Product(
                        id=row['id'], name=row['name'], description=row['description'],
                        price=row['price'], category_id=row['category_id'], brand=row['brand']
                    ))
            
            # Inserção Vendas
            for _, row in df_sales.iterrows():
                if not Sale.query.get(row['id']):
                    db.session.add(Sale(
                        id=row['id'], product_id=row['product_id'], 
                        quantity=row['quantity'], total_price=row['total_price'],
                        date=row['date'].date()
                    ))

            db.session.commit()
            print("Carga de dados (Seed) concluída com sucesso!")
            
        except Exception as e:
            print(f"Erro ao rodar seeds: {e}")
            db.session.rollback()