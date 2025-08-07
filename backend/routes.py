from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from conn import db
from datetime import datetime

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


@api_bp.route("/create-clients", methods=["POST"])
def create_clients():
    try:
        data = request.get_json()

        nome = data.get("nome")
        telefone = data.get("telefone")
        email = data.get("email")

        sql = text(
            "INSERT INTO clientes (nome, telefone, email) VALUES (:nome, :telefone, :email)")
        db.session.execute(sql, {
            "nome": nome,
            "telefone": telefone,
            "email": email
        })

        db.session.commit()

        return jsonify({"status": "sucess", "message": "Sucesso ao cadastrar cliente"})
    except:
        return jsonify({"status": "error", "message": "Erro ao cadastrar clientes"})


@api_bp.route("/clients", methods=["GET"])
def get_clients():
    try:

        sql = text("SELECT * FROM clientes")
        result = db.session.execute(sql)
        clientes = [
            {
                "id": row.id,
                "nome": row.nome,
                "telefone": row.telefone,
                "email": row.email
            }
            for row in result
        ]

        return jsonify({f"status": "sucess", "clients":  clientes})
    except:
        return jsonify({"status": "error", "message": "Erro ao buscar clientes"})


@api_bp.route("/delete-client/<int:id_client>", methods=["DELETE"])
def delete_clients(id_client):
    try:

        sql = text("DELETE FROM clientes WHERE id = :id_client")
        db.session.execute(sql, {"id_client": id_client})
        db.session.commit()

        return jsonify({"status": "sucess", "message": "Sucesso ao deletar cliente"})
    except Exception as e:
        print("Erro ao deletar cliente", e)
        return jsonify({"status": "error", "message": "Erro ao deletar cliente"})


@api_bp.route("/create-orcamento", methods=["POST"])
def create_orcamento():
    try:
        print("=== CRIANDO ORÇAMENTO ===")
        data = request.get_json()
        print(f"Dados recebidos: {data}")
        
        if not data:
            return jsonify({"status": "error", "message": "Dados não fornecidos"}), 400

        cliente_id = data.get("cliente_id")
        carro_id = data.get("carro_id")
        servicos = data.get("servicos")
        valor = data.get("valor")
        data_orcamento = data.get("data_orcamento")
        pecas = data.get("pecas")

        print(f"Cliente ID: {cliente_id}, Carro ID: {carro_id}")

        # Validar campos obrigatórios
        if not cliente_id:
            return jsonify({"status": "error", "message": "Cliente ID é obrigatório"}), 400
        if not carro_id:
            return jsonify({"status": "error", "message": "Carro ID é obrigatório"}), 400
        if not servicos:
            return jsonify({"status": "error", "message": "Serviços são obrigatórios"}), 400
        if not valor:
            return jsonify({"status": "error", "message": "Valor é obrigatório"}), 400

        # Tratar pecas - pode vir como string JSON ou lista
        if pecas:
            if isinstance(pecas, str):
                try:
                    import json
                    pecas = json.loads(pecas)
                except json.JSONDecodeError:
                    return jsonify({"status": "error", "message": "Formato de peças inválido"}), 400
            
            if not isinstance(pecas, list):
                return jsonify({"status": "error", "message": "Peças devem ser uma lista"}), 400

        # Converter data_orcamento para formato YYYY-MM-DD
        if data_orcamento:
            try:
                data_orcamento = datetime.strptime(
                    data_orcamento, "%d/%m/%Y").strftime("%Y-%m-%d")
            except ValueError:
                return jsonify({"status": "error", "message": "Formato de data inválido. Use DD/MM/YYYY."}), 400

        # 1. Inserir orçamento e obter o ID corretamente
        sql = text(
            "INSERT INTO orcamentos (cliente_id, carro_id, servicos, valor, data_orcamento) VALUES (:cliente_id, :carro_id, :servicos, :valor, :data_orcamento)"
        )
        result = db.session.execute(sql, {
            "cliente_id": cliente_id,
            "carro_id": carro_id,
            "servicos": servicos,
            "valor": valor,
            "data_orcamento": data_orcamento
        })
        
        # Commit imediatamente após inserir o orçamento
        db.session.flush()  # Flush para obter o ID sem commit completo
        
        # Obter o ID do orçamento inserido
        orcamento_id = result.lastrowid
        print(f"ID do orçamento criado: {orcamento_id}")
        
        # Verificar se o ID foi obtido corretamente
        if not orcamento_id:
            db.session.rollback()
            return jsonify({"status": "error", "message": "Erro ao obter ID do orçamento"}), 500

        # 2. Inserir peças do orçamento (se houver)
        if pecas:
            print(f"Inserindo {len(pecas)} peças")
            for peca in pecas:
                if not isinstance(peca, dict):
                    continue
                    
                peca_id = peca.get("peca_id")
                quantidade = peca.get("quantidade", 1)
                
                if peca_id:
                    sql_peca = text(
                        "INSERT INTO orcamento_pecas (orcamento_id, peca_id, quantidade) VALUES (:orcamento_id, :peca_id, :quantidade)"
                    )
                    db.session.execute(sql_peca, {
                        "orcamento_id": orcamento_id,
                        "peca_id": peca_id,
                        "quantidade": quantidade
                    })
                    print(f"Peça {peca_id} inserida com quantidade {quantidade}")
        
        # Commit tudo de uma vez
        db.session.commit()
        print("Orçamento criado com sucesso!")

        # 3. Buscar dados completos do orçamento criado
        sql_orcamento = text("""
            SELECT o.id, o.servicos, o.valor, o.data_orcamento,
                   c.nome as cliente_nome, 
                   ca.modelo as carro_modelo, 
                   ca.placa as carro_placa
            FROM orcamentos o
            JOIN clientes c ON o.cliente_id = c.id
            JOIN carros ca ON o.carro_id = ca.id
            WHERE o.id = :orcamento_id
        """)
        orcamento_result = db.session.execute(
            sql_orcamento, {"orcamento_id": orcamento_id})
        orcamento_row = orcamento_result.fetchone()

        if not orcamento_row:
            return jsonify({"status": "error", "message": "Orçamento criado mas não encontrado"}), 500

        # 4. Buscar peças do orçamento
        sql_pecas = text("""
            SELECT op.peca_id, op.quantidade, p.nome, p.categoria, p.preco
            FROM orcamento_pecas op
            JOIN pecas p ON op.peca_id = p.id
            WHERE op.orcamento_id = :orcamento_id
        """)
        pecas_result = db.session.execute(
            sql_pecas, {"orcamento_id": orcamento_id})
        pecas_data = [
            {
                "peca_id": peca_row.peca_id,
                "nome": peca_row.nome,
                "categoria": peca_row.categoria,
                "preco": float(peca_row.preco) if peca_row.preco else 0,
                "quantidade": peca_row.quantidade
            }
            for peca_row in pecas_result
        ]

        orcamento_criado = {
            "id": orcamento_row.id,
            "cliente_nome": orcamento_row.cliente_nome,
            "carro_modelo": orcamento_row.carro_modelo,
            "carro_placa": orcamento_row.carro_placa,
            "servicos": orcamento_row.servicos,
            "valor": float(orcamento_row.valor) if orcamento_row.valor else 0,
            "data_orcamento": orcamento_row.data_orcamento,
            "pecas": pecas_data
        }

        return jsonify({"status": "sucess", "message": "Sucesso ao criar orçamentos", "orcamento": orcamento_criado})
        
    except Exception as e:
        db.session.rollback()
        print("Erro ao criar orçamento:", e)
        return jsonify({"status": "error", "message": f"Erro ao criar orçamentos: {str(e)}"}), 500


@api_bp.route("/orcamentos", methods=["GET"])
def get_orcamentos():
    try:
        sql = text("""
            SELECT o.id, o.servicos, o.valor, o.data_orcamento,
                   c.nome as cliente_nome, 
                   ca.modelo as carro_modelo, 
                   ca.placa as carro_placa
            FROM orcamentos o
            JOIN clientes c ON o.cliente_id = c.id
            JOIN carros ca ON o.carro_id = ca.id
        """)
        result = db.session.execute(sql)

        orcamentos = []
        for row in result:
            # Buscar peças usadas no orçamento
            sql_pecas = text("""
                SELECT op.peca_id, op.quantidade, p.nome, p.categoria, p.preco
                FROM orcamento_pecas op
                JOIN pecas p ON op.peca_id = p.id
                WHERE op.orcamento_id = :orcamento_id
            """)
            pecas_result = db.session.execute(
                sql_pecas, {"orcamento_id": row.id})
            pecas = [
                {
                    "peca_id": peca_row.peca_id,
                    "nome": peca_row.nome,
                    "categoria": peca_row.categoria,
                    "preco": peca_row.preco,
                    "quantidade": peca_row.quantidade
                }
                for peca_row in pecas_result
            ]

            orcamentos.append({
                "id": row.id,
                "cliente_nome": row.cliente_nome,
                "carro_modelo": row.carro_modelo,
                "carro_placa": row.carro_placa,
                "servicos": row.servicos,
                "valor": row.valor,
                "data_orcamento": row.data_orcamento,
                "pecas": pecas
            })
        return jsonify({"status": "Sucess", "orcamentos": orcamentos})
    except:
        return jsonify({"status": "error", "message": "Erro ao buscar orçamentos"})


@api_bp.route("/delete-orcamento/<int:id_orcamento>", methods=["DELETE"])
def delete_orcamento(id_orcamento):
    try:

        sql = text("DELETE FROM orcamentos WHERE id = :id_orcamento")
        db.session.execute(sql, {"id_orcamento": id_orcamento})
        db.session.commit()

        return jsonify({"status": "sucess", "message": "Sucesso ao deletar orçamento"})
    except:
        return jsonify({"status": "error", "message": "Erro ao deletar orçamento"})
