# ============================================================
# CONSUMER BEHAVIOR INTELLIGENCE
# FLASK PRODUCTION BACKEND
# ============================================================

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
import numpy as np


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "dashboard_data"
)


# ============================================================
# APPLICATION
# ============================================================

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

CORS(app)


# ============================================================
# DATASETS
# ============================================================

DATASETS = {
    "kpis": "kpis.csv",
    "monthly": "monthly_revenue.csv",
    "countries": "country_revenue.csv",
    "segments": "customer_segments.csv",
    "products": "product_revenue.csv",
    "pairs": "product_pairs.csv",
    "days": "day_revenue.csv",
    "hours": "hour_revenue.csv"
}


# ============================================================
# LOAD CSV
# ============================================================

def load_csv(filename):

    path = os.path.join(DATA_DIR, filename)

    if not os.path.isfile(path):

        raise FileNotFoundError(
            f"Dataset not found: {filename}"
        )

    df = pd.read_csv(path)

    # Remove accidental whitespace from column names
    df.columns = [
        str(column).strip()
        for column in df.columns
    ]

    # Convert pandas NaN / inf into JSON-safe values
    df = df.replace(
        [np.inf, -np.inf],
        np.nan
    )

    df = df.astype(object).where(
        pd.notnull(df),
        None
    )

    return df


# ============================================================
# CSV RESPONSE
# ============================================================

def csv_response(filename):

    try:

        df = load_csv(filename)

        records = df.to_dict(
            orient="records"
        )

        return jsonify(records)

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
# HOME
# ============================================================

@app.route("/")
def index():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ============================================================
# FRONTEND FILES
# ============================================================

@app.route("/<path:filename>")
def frontend_files(filename):

    path = os.path.join(
        FRONTEND_DIR,
        filename
    )

    if os.path.isfile(path):

        return send_from_directory(
            FRONTEND_DIR,
            filename
        )

    return jsonify({
        "error": "Frontend file not found",
        "file": filename
    }), 404


# ============================================================
# API ROUTES
# ============================================================

@app.route("/api/kpis")
def api_kpis():

    return csv_response(
        DATASETS["kpis"]
    )


@app.route("/api/monthly")
def api_monthly():

    return csv_response(
        DATASETS["monthly"]
    )


@app.route("/api/countries")
def api_countries():

    return csv_response(
        DATASETS["countries"]
    )


@app.route("/api/segments")
def api_segments():

    return csv_response(
        DATASETS["segments"]
    )


@app.route("/api/products")
def api_products():

    return csv_response(
        DATASETS["products"]
    )


@app.route("/api/pairs")
def api_pairs():

    return csv_response(
        DATASETS["pairs"]
    )


@app.route("/api/days")
def api_days():

    return csv_response(
        DATASETS["days"]
    )


@app.route("/api/hours")
def api_hours():

    return csv_response(
        DATASETS["hours"]
    )


# ============================================================
# API STATUS
# ============================================================

@app.route("/api/status")
def api_status():

    result = {}

    for key, filename in DATASETS.items():

        path = os.path.join(
            DATA_DIR,
            filename
        )

        result[key] = {
            "file": filename,
            "exists": os.path.isfile(path)
        }

        if os.path.isfile(path):

            try:

                df = pd.read_csv(path)

                result[key]["rows"] = len(df)
                result[key]["columns"] = list(
                    df.columns
                )

            except Exception as error:

                result[key]["error"] = str(error)

    available = sum(
        item["exists"]
        for item in result.values()
    )

    return jsonify({

        "project":
            "Consumer Behavior Intelligence",

        "status":
            "healthy",

        "datasets_available":
            available,

        "datasets_total":
            len(DATASETS),

        "datasets":
            result

    })


# ============================================================
# HEALTH
# ============================================================

@app.route("/health")
def health():

    return jsonify({

        "status":
            "healthy",

        "service":
            "Consumer Behavior Intelligence",

        "frontend":
            os.path.isdir(
                FRONTEND_DIR
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
# START SERVER
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
