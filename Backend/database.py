import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Configura o banco de dados na aplicação Flask."""
    # Define o caminho absoluto para o banco (evita erros de caminho relativo)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DB_URI = f'sqlite:///{os.path.join(BASE_DIR, "smartmart.db")}'
    
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Cria as tabelas se não existirem
    with app.app_context():
        db.create_all()