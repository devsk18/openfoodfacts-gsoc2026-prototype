import uuid
from app.db import get_db

def new_id():
    return str(uuid.uuid4())

def init_schema():
    db = get_db()
    drop_tables()

    db.execute("""
        CREATE TABLE IF NOT EXISTS stores (
            store_uuid  VARCHAR UNIQUE NOT NULL,
            store_name  VARCHAR NOT NULL
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS product_store_mappings (
            id                VARCHAR PRIMARY KEY,
            store_uuid        VARCHAR REFERENCES stores(store_uuid),
            store_product_id  VARCHAR NOT NULL,
            barcode           VARCHAR NOT NULL,
            submission_count  INTEGER DEFAULT 1,
            is_verified       BOOLEAN DEFAULT FALSE,
            created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (store_uuid, store_product_id)
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS mapping_submissions (
            id           VARCHAR PRIMARY KEY,
            mapping_id   VARCHAR REFERENCES product_store_mappings(id),
            extension_id VARCHAR NOT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    stores = [
        ("241535d5-f279-4147-a78a-affda6331c6e", "Loblaws"),
        ("b9409c67-be5b-40e9-ba4d-e78fafae9781", "Costco Canada"),
        ("9a3ef65a-ac54-4dfc-b16b-bac0df4f2d9e", "Walmart Canada"),
    ]

    for store in stores:
        db.execute("""
            INSERT INTO stores (store_uuid, store_name)
            VALUES (?, ?)
            ON CONFLICT (store_uuid) DO NOTHING
        """, store)

    db.commit()
    print("[DB] Schema ready")

def drop_tables():
    db = get_db()
    db.execute("DROP TABLE IF EXISTS mapping_submissions")
    db.execute("DROP TABLE IF EXISTS product_store_mappings")
    db.execute("DROP TABLE IF EXISTS stores")
    db.commit()
    print("[DB] Tables dropped")

