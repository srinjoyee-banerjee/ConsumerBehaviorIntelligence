
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "dashboard_data"
)

app = Flask(__name__)
CORS(app)


def load_csv(filename):

    path = os.path.join(
        DATA_DIR,
        filename
    )

    if not os.path.exists(path):
        return None

    return pd.read_csv(path)


def csv_response(filename):

    data = load_csv(filename)

    if data is None:
        return jsonify({
            "error": filename + " not found"
        }), 404

    data = data.where(
        pd.notnull(data),
        None
    )

    return jsonify(
        data.to_dict(
            orient="records"
        )
    )


# ============================================================
# FRONTEND
# ============================================================

@app.route("/")
def index():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


@app.route("/<path:filename>")
def frontend(filename):

    return send_from_directory(
        FRONTEND_DIR,
        filename
    )


# ============================================================
# API ENDPOINTS
# ============================================================

@app.route("/api/kpis")
def kpis():

    return csv_response(
        "kpis.csv"
    )


@app.route("/api/monthly")
def monthly():

    return csv_response(
        "monthly_revenue.csv"
    )


@app.route("/api/countries")
def countries():

    return csv_response(
        "country_revenue.csv"
    )


@app.route("/api/products")
def products():

    return csv_response(
        "product_revenue.csv"
    )


@app.route("/api/segments")
def segments():

    return csv_response(
        "customer_segments.csv"
    )


@app.route("/api/days")
def days():

    return csv_response(
        "day_revenue.csv"
    )


@app.route("/api/hours")
def hours():

    return csv_response(
        "hour_revenue.csv"
    )


@app.route("/api/pairs")
def pairs():

    return csv_response(
        "product_pairs.csv"
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/health")
def health():

    return jsonify({
        "status": "healthy",
        "project":
            "Consumer Behavior Intelligence"
    })


# ============================================================
# RENDER
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )
