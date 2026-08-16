# ============================================================
# CONSUMER BEHAVIOR INTELLIGENCE
# FLASK PRODUCTION BACKEND
# ============================================================

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os


# ============================================================
# APPLICATION CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "dashboard_data"
)

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

CORS(app)


# ============================================================
# DATA LOADER
# ============================================================

def load_csv(filename):

    path = os.path.join(
        DATA_DIR,
        filename
    )

    if not os.path.isfile(path):
        raise FileNotFoundError(
            f"Dataset not found: {filename}"
        )

    df = pd.read_csv(path)

    # Convert NaN / inf values to JSON-safe None
    df = df.replace(
        [float("inf"), float("-inf")],
        None
    )

    df = df.where(
        pd.notnull(df),
        None
    )

    return df


def csv_response(filename):

    try:

        df = load_csv(filename)

        return jsonify(
            df.to_dict(
                orient="records"
            )
        )

    except FileNotFoundError as error:

        return jsonify({
            "error": str(error)
        }), 404

    except Exception as error:

        return jsonify({
            "error": "Unable to load dataset",
            "details": str(error)
        }), 500


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
def frontend_files(filename):

    file_path = os.path.join(
        FRONTEND_DIR,
        filename
    )

    if os.path.isfile(file_path):

        return send_from_directory(
            FRONTEND_DIR,
            filename
        )

    return jsonify({
        "error": "Frontend file not found"
    }), 404


# ============================================================
# DASHBOARD API
# ============================================================

@app.route("/api/kpis", methods=["GET"])
def api_kpis():

    return csv_response(
        "kpis.csv"
    )


@app.route("/api/monthly", methods=["GET"])
def api_monthly():

    return csv_response(
        "monthly_revenue.csv"
    )


@app.route("/api/countries", methods=["GET"])
def api_countries():

    return csv_response(
        "country_revenue.csv"
    )


@app.route("/api/products", methods=["GET"])
def api_products():

    return csv_response(
        "product_revenue.csv"
    )


@app.route("/api/segments", methods=["GET"])
def api_segments():

    return csv_response(
        "customer_segments.csv"
    )


@app.route("/api/days", methods=["GET"])
def api_days():

    return csv_response(
        "day_revenue.csv"
    )


@app.route("/api/hours", methods=["GET"])
def api_hours():

    return csv_response(
        "hour_revenue.csv"
    )


@app.route("/api/pairs", methods=["GET"])
def api_pairs():

    return csv_response(
        "product_pairs.csv"
    )


# ============================================================
# API STATUS
# ============================================================

@app.route("/api/status", methods=["GET"])
def api_status():

    datasets = [
        "kpis.csv",
        "monthly_revenue.csv",
        "country_revenue.csv",
        "product_revenue.csv",
        "customer_segments.csv",
        "day_revenue.csv",
        "hour_revenue.csv",
        "product_pairs.csv"
    ]

    available = []
    missing = []

    for filename in datasets:

        path = os.path.join(
            DATA_DIR,
            filename
        )

        if os.path.isfile(path):
            available.append(filename)
        else:
            missing.append(filename)

    return jsonify({

        "project":
            "Consumer Behavior Intelligence",

        "status":
            "healthy",

        "datasets_available":
            len(available),

        "datasets_total":
            len(datasets),

        "available":
            available,

        "missing":
            missing

    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({

        "status":
            "healthy",

        "service":
            "Consumer Behavior Intelligence",

        "frontend":
            os.path.isfile(
                os.path.join(
                    FRONTEND_DIR,
                    "index.html"
                )
            ),

        "data_directory":
            os.path.isdir(
                DATA_DIR
            )

    })


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({
        "error": "Resource not found"
    }), 404


@app.errorhandler(500)
def server_error(error):

    return jsonify({
        "error": "Internal server error"
    }), 500


# ============================================================
# APPLICATION START
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
        port=port,
        debug=False
    )
