import os
from flask import Blueprint, request, jsonify
from app.db import get_db
from app.schema import new_id


mappings_bp = Blueprint("mappings", __name__)

VERIFICATION_THRESHOLD = int(os.environ.get("VERIFICATION_THRESHOLD", 3))

@mappings_bp.route("/api/v1/stores/<store_uuid>/mappings", methods=["POST"])
def submit_mapping(store_uuid):
    body = request.get_json()

    # Validate required fields
    store_product_id = body.get("store_product_id")
    barcode          = body.get("barcode")
    extension_id     = body.get("extension_id")

    if not all([store_product_id, barcode, extension_id]):
        return jsonify({"error": "store_product_id, barcode and extension_id are required"}), 400

    db = get_db()

    # TODO:: add rate limiting middleware
    # TODO:: keep stores in cache - also move this check to middleware
    
    # Check store exists
    store = is_store_present(store_uuid)
    if not store:
        return jsonify({"error": f"Store '{store_uuid}' not found"}), 404

    # Check if mapping already exists
    existing = is_mapping_present(store_uuid, store_product_id, barcode, extension_id)

    if existing:
        mapping_id = update_mapping(existing)
    else:
        mapping_id = create_mapping(store_uuid, store_product_id, barcode)

    # Record individual submission
    if not existing or not existing["submission_id"]: 
        log_submission(mapping_id, extension_id)
        
    # reject if submission from same ext_id already exists
    if existing and existing["submission_id"]:
        message = "Mapping already exists"
    else:
        message = "Mapping done successfully"
    
    db.commit()

    return jsonify({
        "status": "success",
        "mapping_id": mapping_id,
        "message": message
    }), 201


# Update existing mapping
def update_mapping(existing):
    db = get_db()

    mapping_id    = existing["id"]
    if existing["submission_id"]:
        return mapping_id
    new_count     = existing["submission_count"] + 1
    is_verified   = new_count >= VERIFICATION_THRESHOLD

    db.execute("""
        UPDATE product_store_mappings
        SET submission_count = ?,
            is_verified      = ?,
            updated_at       = CURRENT_TIMESTAMP
        WHERE id = ?
    """, [new_count, is_verified, mapping_id])

    return mapping_id

# Create new mapping
def create_mapping(store_uuid, store_product_id, barcode):
    db = get_db()
    mapping_id = new_id()

    db.execute("""
        INSERT INTO product_store_mappings
            (id, store_uuid, store_product_id, barcode, submission_count, is_verified)
        VALUES (?, ?, ?, ?, 1, FALSE)
    """, [mapping_id, store_uuid, store_product_id, barcode])
    
    return mapping_id

# Check if mapping exists
def is_mapping_present(store_uuid, store_product_id, barcode, extension_id):
    db = get_db()
    result = db.execute("""
        SELECT psm.id, psm.submission_count, ms.id AS submission_id
        FROM product_store_mappings AS psm
        LEFT JOIN mapping_submissions AS ms
            ON psm.id = ms.mapping_id AND ms.extension_id = ?
        WHERE psm.store_uuid = ? AND psm.store_product_id = ? AND psm.barcode = ?
    """, (extension_id, store_uuid, store_product_id, barcode)).fetchone()
    
    if result is None:
        return None
    
    return {
        "id": result[0],
        "submission_count": result[1],
        "submission_id": result[2]
    }

# Check if store exists
def is_store_present(store_uuid):
    db = get_db()
    store = db.execute(
        "SELECT store_uuid FROM stores WHERE store_uuid = ?", [store_uuid]
    ).fetchone()
    return store

# Log individual submission
def log_submission(mapping_id, extension_id):
    db = get_db()
    db.execute("""
        INSERT INTO mapping_submissions (id, mapping_id, extension_id)
        VALUES (?, ?, ?)
    """, [new_id(), mapping_id, extension_id])

