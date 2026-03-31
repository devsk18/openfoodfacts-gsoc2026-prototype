import numpy as np
from flask import Blueprint, request, jsonify
from app.db import get_db

lookups_bp = Blueprint("lookups", __name__)

def normalize_barcode(barcode):
    return barcode.strip().zfill(13)

@lookups_bp.route("/api/v1/stores/lookup", methods=["GET"])
def get_lookup():
    db = get_db()
    store_uuid       = request.args.get("store_uuid")
    store_product_id = request.args.get("store_product_id")

    if not all([store_uuid, store_product_id]):
        return jsonify({"error": "store_uuid and store_product_id are required"}), 400

    mapping = db.execute("""
        SELECT * FROM product_store_mappings
        WHERE store_uuid = ? AND store_product_id = ?
        ORDER BY submission_count DESC LIMIT 1
    """, (store_uuid, store_product_id)).fetchdf()

    if mapping.empty:
        return jsonify({"error": "No mapping found"}), 404

    return jsonify({
        "success": True,
        "lookup_status": True,
        "mapping": mapping.to_dict(orient="records")
    })


@lookups_bp.route("/api/v1/products", methods=["GET"])
def get_product():
    db               = get_db()
    store_uuid       = request.args.get("store_uuid")
    type             = request.args.get("type")
    value            = request.args.get("value")
    fields           = request.args.get("fields")

    if not all([store_uuid, type, value]):
        return jsonify({"error": "store_uuid, type and value are required"}), 400

    # TODO: need to parse response and handle nested columns properly

    columns = ", ".join(f"p.{f.strip()}" for f in fields.split(",")) if fields else "p.*"

    if type == "barcode":
        barcode = normalize_barcode(value)
        product = db.execute(
            f"SELECT {columns} FROM products p WHERE p.code = ?",
            (barcode,)
        ).fetchdf()

    elif type == "store_product_id":
        product = db.execute(f"""
            SELECT {columns}
            FROM product_store_mappings ps
            JOIN products p ON ps.barcode = p.code
            WHERE ps.store_product_id = ? AND ps.store_uuid = ?
        """, (value, store_uuid)).fetchdf()

    else:
        return jsonify({"error": "invalid type"}), 400

    if product.empty:
        return jsonify({"success": True, "product_status": False, "product": None})

    return jsonify({
        "success":        True,
        "product_status": True,
        "product":        serialize_row(product.to_dict(orient="records")[0]),
    })


def serialize_row(row):
    clean = {}
    for key, value in row.items():
        if isinstance(value, np.ndarray):
            clean[key] = value.tolist()
        elif isinstance(value, np.integer):
            clean[key] = int(value)
        elif isinstance(value, np.floating):
            clean[key] = float(value)
        elif isinstance(value, np.bool_):
            clean[key] = bool(value)
        else:
            clean[key] = value
    return clean