import os
from datetime import datetime, timedelta
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
from supabase import Client, create_client
from werkzeug.security import check_password_hash, generate_password_hash

# ==========================
# Configuración inicial
# ==========================

load_dotenv()

app = Flask(__name__)

# Permitir peticiones desde React
CORS(app, origins=["http://localhost:5173"])

SECRET_KEY = "secret"

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# ==========================
# Middleware JWT
# ==========================


def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token not provided"}), 401

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Invalid token format"}), 401

        token = parts[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.username = payload["username"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 403

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 403

        return func(*args, **kwargs)

    return wrapper


# ==========================
# Crear usuario
# ==========================


@app.route("/usuarios", methods=["POST"])
def crear_usuario():
    try:
        datos = request.get_json()
        password_hash = generate_password_hash(datos["clave"])

        response = (
            supabase.table("usuarios")
            .insert(
                {
                    "nombre": datos["nombre"],
                    "apellido": datos["apellido"],
                    "correo": datos["correo"],
                    "clave": password_hash,
                    "telefono": datos["telefono"],
                    "edad": datos["edad"],
                }
            )
            .execute()
        )

        return jsonify(response.data), 201

    except Exception as e:
        return jsonify({"message": "Error creating user", "error": str(e)}), 500


# ==========================
# Listar usuarios
# ==========================


@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    try:
        response = (
            supabase.table("usuarios")
            .select("id,nombre,apellido,correo,telefono,edad")
            .execute()
        )

        return jsonify(response.data), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving users", "error": str(e)}), 500


# ==========================
# Login
# ==========================


@app.route("/login", methods=["POST"])
def login():
    try:
        datos = request.get_json()

        username = datos.get("username")
        password = datos.get("password")

        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        response = (
            supabase.table("usuarios")
            .select("*")
            .eq("correo", username)
            .limit(1)
            .execute()
        )

        if len(response.data) == 0:
            return jsonify({"message": "Authentication failed"}), 401

        usuario = response.data[0]

        if not check_password_hash(usuario["clave"], password):
            return jsonify({"message": "Authentication failed"}), 401

        token = jwt.encode(
            {"username": username, "exp": datetime.utcnow() + timedelta(hours=2)},
            SECRET_KEY,
            algorithm="HS256",
        )

        return jsonify({"token": token}), 200

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


# ==========================
# Ruta protegida
# ==========================


@app.route("/protected", methods=["GET"])
@verify_token
def protected():
    return jsonify({"message": f"Welcome {request.username}"}), 200


# ==========================
# Ejecutar aplicación
# ==========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
