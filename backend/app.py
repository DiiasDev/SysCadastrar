from flask import Flask
from routes import api_bp
from flask_cors import CORS

try:
    def create_app():
        app = Flask(__name__)
        CORS(app)
        app.register_blueprint(api_bp)
        return app

    if __name__ == "__main__":
        app = create_app()
        app.run(debug=True)
except:
    print("erro")
