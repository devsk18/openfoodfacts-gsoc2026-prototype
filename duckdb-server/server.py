from flask import Flask
from dotenv import load_dotenv
from app.db import close_db, get_db
from app.routes.mappings import mappings_bp
from app.routes.lookups import lookups_bp
from app.schema import init_schema

import atexit
import signal
import os

# save db on exit
atexit.register(close_db)
signal.signal(signal.SIGTERM, lambda sig, frame: close_db())
signal.signal(signal.SIGINT, lambda sig, frame: close_db())

load_dotenv()
app = Flask(__name__)

if os.getenv("INIT_SCHEMA", "false").lower() == "true":
    init_schema()
    os.environ["INIT_SCHEMA"] = "false"

app.register_blueprint(mappings_bp)
app.register_blueprint(lookups_bp)

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/stores")
def stores():
    db = get_db()
    store = db.execute("SELECT * FROM stores").fetchdf()
    return {"stores": store.to_dict(orient="records")}

@app.route("/mappings")
def mappings():
    db = get_db()
    mapping = db.execute("SELECT * FROM product_store_mappings").fetchdf()
    return {"mappings": mapping.to_dict(orient="records")}

@app.route("/submissions")
def submissions():
    db = get_db()
    submission = db.execute("SELECT * FROM mapping_submissions").fetchdf()
    return {"submissions": submission.to_dict(orient="records")}

if __name__ == "__main__":
    app.run(debug=True)