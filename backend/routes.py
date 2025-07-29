from flask import Blueprint, jsonify, request

api_bp = Blueprint('api', __name__)

usuarios = []


@api_bp.route('/create_users', methods=["POST"])
def create_user():
    data = request.get_json()
    if not data:
        return "Sem dados"

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    user = {
        "name": name,
        "email": email,
        "password": password
    }

    usuarios.append(user)

    return jsonify(user), 201


@api_bp.route("/usuarios", methods=["GET"])
def get_users():
    try:
        return jsonify(usuarios)
    except Exception as e:
        print("Não consegui capturar usuários")
        return jsonify({"error": "Erro ao buscar usuários"}), 500
