import os
import duckdb

_conn = None


def get_db():
    global _conn
    if _conn is None:
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        db_path = os.path.abspath(os.path.join(base_path, os.getenv("OFF_DB_PATH")))
        
        if not db_path:
            raise RuntimeError("Path not found")
        
        _conn = duckdb.connect(db_path)
        print(f"[DB] Connected")
    return _conn


def close_db():
    global _conn
    if _conn is not None:
        _conn.commit()
        _conn.close()
        _conn = None
        print("[DB] Connection closed")