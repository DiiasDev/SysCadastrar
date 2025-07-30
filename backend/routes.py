from flask import Blueprint, jsonify, request
from sqlalchemy import text
from conn import db

api_bp = Blueprint('api', __name__)


@api_bp.route('/create_users', methods=["POST"])
def create_user():
    data = request.get_json()
    if not data:
        return "Sem dados"

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    sql = text(
        "INSERT INTO usuarios (name, email, password) VALUES (:name, :email, :password) ")
    db.session.execute(
        sql, {'name': name, 'email': email, 'password': password})
    db.session.commit()

    return jsonify({'status': 'sucess', 'message': 'Usuário Criado com sucesso'}), 201


@api_bp.route("/usuarios", methods=["GET"])
def get_users():
    try:
        sql = text("SELECT * FROM usuarios")
        result = db.session.execute(sql)
        usuarios = [
            {"id": row.id, "name": row.name,
                "email": row.email, "password": row.password}
            for row in result
        ]
        return jsonify({"status": "sucess", "usuarios": usuarios})
    except Exception as e:
        print("Não consegui capturar usuários")
        return jsonify({"error": "Erro ao buscar usuários"}), 500
