# DuckDB Server API Documentation

## Overview

This API provides endpoints for managing product-store mappings, lookups, and store information for an online grocery extension system. The server uses Flask with DuckDB as the database backend.

## Demo
<video src="../demos/videos/duckdb-server-demo.mp4" controls></video>

## Base URL

```
http://localhost:5000
```

## Authentication

No authentication is currently required for any endpoints.

## Response Format

All responses are in JSON format.

---

## Health Check

### GET /health

Check if the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

## Store Endpoints

### GET /stores

Retrieve all stores from the database.

**Response:**
```json
{
  "stores": [
    {
      "store_uuid": "241535d5-f279-4147-a78a-affda6331c6e",
      "store_name": "Loblaws"
    },
    {
      "store_uuid": "b9409c67-be5b-40e9-ba4d-e78fafae9781",
      "store_name": "Costco Canada"
    },
    {
      "store_uuid": "9a3ef65a-ac54-4dfc-b16b-bac0df4f2d9e",
      "store_name": "Walmart Canada"
    }
  ]
}
```

---

## Mapping Endpoints

### GET /mappings

Retrieve all product-store mappings.

**Response:**
```json
{
  "mappings": [
    {
      "id": "mapping-uuid",
      "store_uuid": "store-uuid",
      "store_product_id": "product-id",
      "barcode": "barcode",
      "submission_count": 1,
      "is_verified": false,
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ]
}
```

### GET /submissions

Retrieve all mapping submissions.

**Response:**
```json
{
  "submissions": [
    {
      "id": "submission-uuid",
      "mapping_id": "mapping-uuid",
      "extension_id": "extension-id",
      "submitted_at": "2024-01-01T00:00:00"
    }
  ]
}
```

### POST /api/v1/stores/{store_uuid}/mappings

Submit a new product-store mapping or update an existing one.

**URL Parameters:**
- `store_uuid` (string, required): The UUID of the store

**Request Body:**
```json
{
  "store_product_id": "product-123",
  "barcode": "1234567890123",
  "extension_id": "extension-456"
}
```

**Required Fields:**
- `store_product_id` (string): The product ID as used by the store
- `barcode` (string): The product barcode (will be normalized to 13 digits)
- `extension_id` (string): The ID of the extension submitting the mapping

**Response:**
```json
{
  "status": "success",
  "mapping_id": "mapping-uuid",
  "message": "Mapping done successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
  ```json
  {
    "error": "store_product_id, barcode and extension_id are required"
  }
  ```
- `404 Not Found`: Store not found
  ```json
  {
    "error": "Store 'store-uuid' not found"
  }
  ```

**Behavior:**
- If a mapping already exists from the same extension, returns existing mapping
- If mapping exists but from different extension, increments submission count
- New mappings start with `submission_count = 1` and `is_verified = false`
- Mappings become verified when `submission_count >= VERIFICATION_THRESHOLD` (default: 3)

---

## Lookup Endpoints

### GET /api/v1/stores/lookup

Lookup a product-store mapping by store UUID and store product ID.

**Query Parameters:**
- `store_uuid` (string, required): The UUID of the store
- `store_product_id` (string, required): The product ID as used by the store

**Response:**
```json
{
  "success": true,
  "lookup_status": true,
  "mapping": [
    {
      "id": "mapping-uuid",
      "store_uuid": "store-uuid",
      "store_product_id": "product-123",
      "barcode": "1234567890123",
      "submission_count": 5,
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Missing required parameters
  ```json
  {
    "error": "store_uuid and store_product_id are required"
  }
  ```
- `404 Not Found`: No mapping found
  ```json
  {
    "error": "No mapping found"
  }
  ```

**Behavior:**
- Returns the mapping with the highest submission count for the given store and product
- Returns an array of mappings (typically one item due to LIMIT 1)
- Uses pandas DataFrame for data processing

### GET /api/v1/products

Lookup a product by barcode or store product ID.

**Query Parameters:**
- `store_uuid` (string, required): The UUID of the store
- `type` (string, required): Either "barcode" or "store_product_id"
- `value` (string, required): The barcode or store product ID to search for
- `fields` (string, optional): Comma-separated list of product fields to return

**Responses:**

**Success (Product Found):**
```json
{
  "success": true,
  "product_status": true,
  "product": [
    {
      "code": "1234567890123",
      "brands": "Brand Name",
      ...
    }
  ]
}
```

**Success (Product Not Found):**
```json
{
  "success": true,
  "product_status": false,
  "product": null
}
```

**Error Responses:**
- `400 Bad Request`: Missing required parameters
  ```json
  {
    "error": "store_uuid, type and value are required"
  }
  ```
- `400 Bad Request`: Invalid type
  ```json
  {
    "error": "invalid type"
  }
  ```

**Behavior:**
- When `type=barcode`: Searches products table directly by barcode (normalized to 13 digits)
- When `type=store_product_id`: Searches through product-store mappings to find the product
- Optional `fields` parameter allows selecting specific product columns
- Returns product data

---

## Database Schema

### Stores Table
```sql
CREATE TABLE stores (
    store_uuid  VARCHAR UNIQUE NOT NULL,
    store_name  VARCHAR NOT NULL
)
```

### Product Store Mappings Table
```sql
CREATE TABLE product_store_mappings (
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
```

### Mapping Submissions Table
```sql
CREATE TABLE mapping_submissions (
    id           VARCHAR PRIMARY KEY,
    mapping_id   VARCHAR REFERENCES product_store_mappings(id),
    extension_id VARCHAR NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## Environment Variables

- `VERIFICATION_THRESHOLD`: Number of submissions required for a mapping to be verified (default: 3)

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK`: Successful request
- `201 Created`: Resource successfully created
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses follow this format:
```json
{
  "error": "Error description"
}
```

---

## Available Stores

The system comes pre-configured with these stores:

1. **Loblaws** - `241535d5-f279-4147-a78a-affda6331c6e`
2. **Costco Canada** - `b9409c67-be5b-40e9-ba4d-e78fafae9781`
3. **Walmart Canada** - `9a3ef65a-ac54-4dfc-b16b-bac0df4f2d9e`

---

## Usage Examples

### Submit a new mapping
```bash
curl -X POST http://localhost:5000/api/v1/stores/241535d5-f279-4147-a78a-affda6331c6e/mappings \
  -H "Content-Type: application/json" \
  -d '{
    "store_product_id": "12345",
    "barcode": "1234567890123",
    "extension_id": "ext-001"
  }'
```

### Lookup product by barcode
```bash
curl "http://localhost:5000/api/v1/products?store_uuid=241535d5-f279-4147-a78a-affda6331c6e&type=barcode&value=1234567890123"
```

### Lookup product with specific fields
```bash
curl "http://localhost:5000/api/v1/products?store_uuid=241535d5-f279-4147-a78a-affda6331c6e&type=barcode&value=1234567890123&fields=product_name,brands"
```

### Get store mapping
```bash
curl "http://localhost:5000/api/v1/stores/lookup?store_uuid=241535d5-f279-4147-a78a-affda6331c6e&store_product_id=12345"
```
