from flask import Flask, request, jsonify
from functools import wraps
import jwt, random

app = Flask(__name__)
secret_key = "secret"
secret_num = random.randint(1, 100)


@app.route("/login", methods=["POST"])
def login():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        username = request.json.get("username")
        password = request.json.get("password")

        if username is None or password is None:
            return (
                jsonify({"message": "El usuario y la contraseña son requeridos"}),
                400,
            )

        if username == "admin" and password == "123":
            payload = {"username": username}
            token = jwt.encode(payload, secret_key, algorithm="HS256")
            return jsonify({"token": token}), 200

        return jsonify({"message": "Autenticacion fallida"}), 401
    except Exception as e:
        print(f"Error en login: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "")
        if not token:
            return jsonify({"message": "No se ha provisto ningun token"}), 401

        token_parts = token.split(" ")
        if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
            return jsonify({"message": "Formato de token invalido"}), 401

        token = token_parts[1]
        try:
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            request.username = payload["username"]
            return func(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token invalido"}), 401

    return wrapper


@app.route("/protected", methods=["GET"])
@verify_token
def protected():
    return jsonify({"message": f"Tienes acceso, bienvenido {request.username}"}), 200


@app.route("/")
@verify_token
def index():
    return "Welcome to the flask API!"


@app.route("/adivinar", methods=["POST"])
@verify_token
def adivinar():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        num = request.json.get("numero")

        if not isinstance(num, int):
            return jsonify({"message": "El valor ingresado debe ser un entero"}), 400

        respuesta = (
            "Prueba con uno menor"
            if secret_num < num
            else "Prueba con uno mayor" if secret_num > num else "Ganaste!"
        )
        return jsonify({"resultado": respuesta}), 200

    except Exception as e:
        print(f"Error en adivinar: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
