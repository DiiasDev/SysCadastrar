from flask import Blueprint, jsonify, request, current_app
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


@api_bp.route("/create-pecas", methods=["POST"])
def create_pecas():
    try:
        print("Cadastrando peças...")
        data = request.get_json()

        id = data.get("id")
        nome = data.get("nome")
        categoria = data.get("categoria")
        estoque = data.get("estoque")
        preco = data.get("preco")

        sql = text(
            "INSERT INTO pecas (id ,nome, categoria, estoque, preco) VALUES (:id, :nome, :categoria, :estoque, :preco)"
        )
        db.session.execute(
            sql,
            {
                "id": id,
                "nome": nome,
                "categoria": categoria,
                "estoque": estoque,
                "preco": preco
            }
        )
        db.session.commit()

        return jsonify({"status": "success", "message": "Peça cadastrada com sucesso!"}), 201
    except Exception as e:
        print("Erro ao cadastrar peças:", e)
        return jsonify({"status": "error", "message": "Erro ao cadastrar peça."}), 500


@api_bp.app_errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Endpoint not found"}), 404


@api_bp.route("/get-pecas", methods=["GET"])
def get_pecas():
    try:
        sql = text("SELECT * FROM pecas")
        result = db.session.execute(sql)
        pecas = [{
            "id": row.id,
            "nome": row.nome,
            "categoria": row.categoria,
            "estoque": row.estoque,
            "preco": row.preco,

        }
            for row in result
        ]
        return jsonify({"mensagem": "Sucess", "pecas": pecas})
    except:
        return jsonify({"mensagem": "Erro ao criar usuário"})


@api_bp.route("/delete-pecas/<int:id_peca>", methods=["DELETE"])
def delete_pecas(id_peca):
    try:
        sql = text("DELETE FROM pecas WHERE id = :id_peca ")
        resutl = db.session.execute(sql, {"id_peca": id_peca})
        db.session.commit()

        return jsonify({"mensagem": "Sucess", "deleted": id_peca})
    except:
        return jsonify({"mensagem": "Erro ao deletar peça..."})


@api_bp.route("/create-cars", methods=["POST"])
def create_cars():
    try:
        print("Cadastrando carros...")

        data = request.get_json()

        placa = data.get("placa")
        modelo = data.get("modelo")
        marca = data.get("marca")
        ano = data.get("ano")
        motor = data.get("motor")

        sql = text(
            "INSERT INTO carros  (modelo, marca, ano, motor, placa) VALUES (:modelo, :marca, :ano, :motor, :placa)")
        db.session.execute(
            sql,
            {
                "placa": placa,
                "modelo": modelo,
                "marca": marca,
                "ano": ano,
                "motor": motor
            }
        )

        db.session.commit()

        return jsonify({"status": "Sucess", "message": "Sucesso ao cadastrar carro..."})
    except Exception as e:
        db.session.rollback()
        print("Erro ao cadastrar carros..", e)
        return jsonify({"status": "error", "message": "Erro ao cadastrar carro"}), 500


@api_bp.route("/get-cars", methods=["GET"])
def get_cars():
    try:
        print("Pegando carros...")

        sql = text("SELECT * FROM carros")
        result = db.session.execute(sql)
        carros = [
            {
                "id": row.id,
                "modelo": row.modelo,
                "marca": row.marca,
                "ano": row.ano,
                "motor": row.motor,
                "placa": row.placa
            }
            for row in result
        ]
        return jsonify({"status": "Sucess", "carros": carros})
    except Exception as e:
        print("Erro ao pegar carros...", e)
        return jsonify({"status": "error", "message": "Erro ao buscar carros"}), 500


@api_bp.route("/delete-cars/<int:id_carro>", methods=["DELETE"])
def delete_car(id_carro):
    try:
        print("Deletando carro")

        sql = text("DELETE FROM carros WHERE id = :id_carro")
        db.session.execute(sql, {"id_carro": id_carro})
        db.session.commit()

        return jsonify({"status": "Sucess", "message": "Sucesso ao deletar carro"})
    except Exception as e:
        print("Erro ao deletar carro:", e)
        return jsonify({"status": "Error", "message": "Erro ao deletar carro"})
