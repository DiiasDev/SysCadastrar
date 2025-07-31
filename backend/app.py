from flask import Flask, jsonify
from routes import api_bp
from flask_cors import CORS
from conn import db
from sqlalchemy import text


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Gabgrv123@localhost:3306/cadastrousers'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)
    app.register_blueprint(api_bp)

    @app.route('/test-db')
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return jsonify({'status': 'success', 'message': 'Conexão feita com sucesso!'}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Erro na conexão: {str(e)}'}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port= 3000)
