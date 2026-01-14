import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Configura o banco de dados na aplicação Flask."""
    
    # 1. Tenta pegar a URL do banco do Railway (Variável de Ambiente)
    db_url = os.environ.get('DATABASE_URL')
    
    # 2. Correção necessária para o SQLAlchemy 
    # (O Railway fornece 'postgres://' mas o SQLAlchemy moderno exige 'postgresql://')
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    # 3. Se NÃO tiver URL do Railway (ou seja, estamos rodando local), configura o SQLite
    if not db_url:
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        db_url = f'sqlite:///{os.path.join(BASE_DIR, "smartmart.db")}'
    
    # 4. Aplica a configuração final no App
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Cria as tabelas se não existirem
    with app.app_context():
        db.create_all()