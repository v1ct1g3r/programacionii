from flask import Flask, request, jsonify
from math import sqrt
from others import es_primo

app = Flask(__name__)


@app.route("/")
def index():
    return "Welcome to the flask API!"


@app.route("/reto01", methods=["POST"])
def reto01():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 2:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de dos digitos"
                    }
                ),
                400,
            )

        resultado = numero // 10 + numero % 10
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto01: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto02", methods=["POST"])
def reto02():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(abs(numero))) != 2:
            return (
                jsonify(
                    {"message": "El valor ingresado debe ser un entero de dos digitos"}
                ),
                400,
            )

        resultado = "es primo" if es_primo(numero) else "no es primo"
        resultado += " y "
        resultado += "es negativo" if numero < 0 else "no es negativo"
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto02: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto03", methods=["POST"])
def reto03():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 2:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de dos digitos"
                    }
                ),
                400,
            )

        resultado = "primer digito " + (
            "es primo" if es_primo(numero // 10) else "no es primo"
        )
        resultado += " y "
        resultado += "segundo digito " + (
            "es primo" if es_primo(numero % 10) else "no es primo"
        )
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto03: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto04", methods=["POST"])
def reto04():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        primer_numero = request.json.get("primer_numero")
        segundo_numero = request.json.get("segundo_numero")

        if (
            not isinstance(primer_numero, int)
            or len(str(primer_numero)) != 2
            or not isinstance(segundo_numero, int)
            or len(str(segundo_numero)) != 2
        ):
            return (
                jsonify(
                    {
                        "message": "Los valores ingresados deben ser enteros positivos de dos digitos"
                    }
                ),
                400,
            )

        resultado = (
            str(primer_numero + segundo_numero)
            + " "
            + ("es par" if (primer_numero + segundo_numero) % 2 == 0 else "es impar")
        )
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto04: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto05", methods=["POST"])
def reto05():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 3:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de tres digitos"
                    }
                ),
                400,
            )

        str_numero = str(numero)
        max_digit = max(str_numero)
        resultado = "El mayor dígito está en la posición " + (
            "1"
            if max_digit == str_numero[0]
            else "2" if max_digit == str_numero[1] else "3"
        )
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto05: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto06", methods=["POST"])
def reto06():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 3:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de tres digitos"
                    }
                ),
                400,
            )

        str_numero = str(numero)

        es_multiplo = [[False for _ in range(3)] for _ in range(3)]

        for i in range(3):
            for j in range(3):
                es_multiplo[i][j] = int(str_numero[i]) % int(str_numero[j]) == 0

        resultado = "; ".join(
            set(
                f"{str_numero[i]} es multiplo de {str_numero[j]}"
                for j in range(3)
                for i in range(3)
                if es_multiplo[i][j] and i != j
            )
        )

        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto06: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto07", methods=["POST"])
def reto07():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        primero = request.json.get("primero")
        segundo = request.json.get("segundo")
        tercero = request.json.get("tercero")

        if (
            not isinstance(primero, int)
            or not isinstance(segundo, int)
            or not isinstance(tercero, int)
        ):
            return (
                jsonify({"message": "Los valores ingresados deben ser enteros"}),
                400,
            )

        mayor = primero
        actual = segundo
        mayor = actual if actual > mayor else mayor
        actual = tercero
        mayor = actual if actual > mayor else mayor
        resultado = mayor
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto07: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto08", methods=["POST"])
def reto08():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 5:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de cinco digitos"
                    }
                ),
                400,
            )

        resultado = (
            "Es capicua" if str(numero) == str(numero)[::-1] else "No es capicua"
        )
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto08: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto09", methods=["POST"])
def reto09():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        numero = request.json.get("numero")

        if not isinstance(numero, int) or len(str(numero)) != 4:
            return (
                jsonify(
                    {
                        "message": "El valor ingresado debe ser un entero positivo de cinco digitos"
                    }
                ),
                400,
            )

        resultado = (
            "El segundo digito"
            + (" " if str(numero)[1] == str(numero)[2] else " no ")
            + "es igual al penultimo digito"
        )

        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto09: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


@app.route("/reto10", methods=["POST"])
def reto10():
    try:
        if not request.is_json:
            return jsonify({"message": "El cuerpo de la solicitud debe ser JSON"}), 400

        primero = request.json.get("primero")
        segundo = request.json.get("segundo")

        if not isinstance(primero, int) or not isinstance(segundo, int):
            return (
                jsonify({"message": "Los valores ingresados deben ser enteros"}),
                400,
            )

        if primero > segundo:
            primero ^= segundo
            segundo ^= primero
            primero ^= segundo

        resultado = (
            " ".join(x for x in range(primero, segundo + 1))
            if segundo - primero <= 10
            else ""
        )
        return jsonify({"resultado": resultado}), 200

    except Exception as e:
        print(f"Error en reto10: {e}")
        return jsonify({"message": "Error interno del servidor"}), 500


if __name__ == "__main__":
    app.run(debug=True)
