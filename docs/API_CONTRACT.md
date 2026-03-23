# Backend API Contract (PHP) — Base Path: `/api`

This document defines the required backend endpoints, data models, validation rules, and responsibilities for the ShopLight frontend.

---

## 1) General Conventions

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **Auth**: Session cookie or JWT (choose one). Endpoints marked **Auth Required** must validate the user.
- **Timestamps**: ISO 8601 strings.
- **Errors**: Standard error payload:
  ```json
  {
    "error": {
      "code": "STRING_CODE",
      "message": "Human readable message",
      "details": {}
    }
  }
  ```

---

## 2) Data Models

### 2.1 User
```json
{
  "id": "u_123",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+251911000000",
  "createdAt": "2026-03-23T12:00:00Z",
  "updatedAt": "2026-03-23T12:00:00Z"
}
```

### 2.2 Product
```json
{
  "id": "p1",
  "name": "Minimalist Watch",
  "description": "Sleek stainless steel watch with leather strap.",
  "price": 129.0,
  "salePrice": 45.0,
  "images": ["https://..."],
  "details": {
    "category": "accessories",
    "rating": 4.6,
    "badge": "New",
    "color": "Silver",
    "reviewCount": 3
  },
  "features": ["⌚ Stainless Steel Case", "🪶 Lightweight Design"],
  "highlights": ["✔️ Timeless minimalist style"],
  "reviews": [
    { "id": "r1", "user": "Sara T.", "rating": 5, "comment": "Great!" }
  ],
  "createdAt": "2026-03-23T12:00:00Z",
  "updatedAt": "2026-03-23T12:00:00Z"
}
```

### 2.3 Cart Item
```json
{
  "productId": "p1",
  "quantity": 2
}
```

### 2.4 Order
```json
{
  "id": "o_123",
  "userId": "u_123",
  "items": [
    { "productId": "p1", "quantity": 2, "unitPrice": 45.0 }
  ],
  "subtotal": 90.0,
  "taxRate": 15,
  "tax": 13.5,
  "total": 103.5,
  "shipping": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Nairobi",
    "postalCode": "00100"
  },
  "payment": {
    "method": "card",
    "status": "paid"
  },
  "status": "confirmed",
  "createdAt": "2026-03-23T12:00:00Z"
}
```

### 2.5 Review
```json
{
  "id": "r1",
  "productId": "p1",
  "userId": "u_123",
  "rating": 5,
  "comment": "Great!",
  "createdAt": "2026-03-23T12:00:00Z"
}
```

---

## 3) Auth Endpoints

### 3.1 Register
- **POST** `/api/auth/register`
- **Body**:
  ```json
  { "fullName": "Jane Doe", "email": "jane@example.com", "phone": "+251...", "password": "Secret123" }
  ```
- **Validation**:
  - `email` valid + unique
  - `password` min 8, upper/lower/number
- **Response**:
  ```json
  { "user": { ...User } }
  ```

### 3.2 Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  { "email": "jane@example.com", "password": "Secret123" }
  ```
- **Response**:
  ```json
  { "user": { ...User } }
  ```

### 3.3 Logout
- **POST** `/api/auth/logout` (**Auth Required**)
- **Response**: `{ "ok": true }`

### 3.4 Session
- **GET** `/api/auth/session` (**Auth Required**)
- **Response**:
  ```json
  { "user": { ...User } }
  ```

---

## 4) Products

### 4.1 List Products
- **GET** `/api/products`
- **Query Params**:
  - `category` (optional)
  - `search` (optional)
  - `sortBy` (`name|price|rating`)
  - `order` (`asc|desc`)
- **Response**:
  ```json
  { "items": [ ...Product ] }
  ```

### 4.2 Product Detail
- **GET** `/api/products/{id}`
- **Response**: `{ "item": { ...Product } }`

### 4.3 Create Product (Admin)
- **POST** `/api/products`
- **Response**: `{ "item": { ...Product } }`

### 4.4 Update Product (Admin)
- **PUT** `/api/products/{id}`
- **Response**: `{ "item": { ...Product } }`

### 4.5 Delete Product (Admin)
- **DELETE** `/api/products/{id}`
- **Response**: `{ "ok": true }`

---

## 5) Reviews

### 5.1 Create Review
- **POST** `/api/products/{id}/reviews` (**Auth Required**)
- **Body**:
  ```json
  { "rating": 5, "comment": "Great!" }
  ```
- **Response**:
  ```json
  { "review": { ...Review } }
  ```

### 5.2 List Reviews
- **GET** `/api/products/{id}/reviews`
- **Response**:
  ```json
  { "items": [ ...Review ] }
  ```

---

## 6) Favorites

### 6.1 List Favorites
- **GET** `/api/favorites` (**Auth Required**)
- **Response**:
  ```json
  { "items": ["p1", "p2"] }
  ```

### 6.2 Toggle Favorite
- **POST** `/api/favorites/toggle` (**Auth Required**)
- **Body**:
  ```json
  { "productId": "p1" }
  ```
- **Response**:
  ```json
  { "items": ["p2"] }
  ```

---

## 7) Cart

### 7.1 Get Cart
- **GET** `/api/cart` (**Auth Required**)
- **Response**:
  ```json
  { "items": [ ...CartItem ] }
  ```

### 7.2 Add Item
- **POST** `/api/cart/items` (**Auth Required**)
- **Body**:
  ```json
  { "productId": "p1", "quantity": 1 }
  ```
- **Response**:
  ```json
  { "items": [ ...CartItem ] }
  ```

### 7.3 Update Quantity
- **PATCH** `/api/cart/items/{productId}` (**Auth Required**)
- **Body**:
  ```json
  { "quantity": 2 }
  ```
- **Response**:
  ```json
  { "items": [ ...CartItem ] }
  ```

### 7.4 Remove Item
- **DELETE** `/api/cart/items/{productId}` (**Auth Required**)
- **Response**:
  ```json
  { "items": [ ...CartItem ] }
  ```

### 7.5 Clear Cart
- **DELETE** `/api/cart` (**Auth Required**)
- **Response**: `{ "ok": true }`

---

## 8) Orders

### 8.1 Create Order
- **POST** `/api/orders` (**Auth Required**)
- **Body**:
  ```json
  {
    "shipping": { "firstName": "John", "lastName": "Doe", "address": "123 Main St", "city": "Nairobi", "postalCode": "00100" },
    "payment": { "method": "card", "token": "token_or_reference" }
  }
  ```
- **Response**:
  ```json
  { "order": { ...Order } }
  ```

### 8.2 List Orders (User)
- **GET** `/api/orders` (**Auth Required**)
- **Response**:
  ```json
  { "items": [ ...Order ] }
  ```

### 8.3 Order Detail
- **GET** `/api/orders/{id}` (**Auth Required**)
- **Response**:
  ```json
  { "order": { ...Order } }
  ```

---

## 9) System/Health

- **GET** `/api/health`
- **Response**:
  ```json
  { "ok": true, "timestamp": "2026-03-23T12:00:00Z" }
  ```

---

## 10) Validation Rules Summary
- `email`: must be valid and unique.
- `password`: min 8 chars, uppercase + lowercase + number.
- `rating`: integer 1–5.
- `quantity`: integer >= 1.
- `price`: non-negative float.

---

## 11) Team Task Allocation

### Team A — Auth & Users
- Implement user registration/login/logout/session endpoints.
- Password hashing + session/JWT management.
- Input validation and error responses.

### Team B — Products & Reviews
- CRUD products (admin protected).
- Reviews create/list endpoints.
- Rating aggregation and review counts.

### Team C — Cart & Orders
- Cart CRUD endpoints.
- Order creation + totals (tax rate 15%).
- Order list/detail for user.

### Team D — Platform & Utilities
- Routing, middleware, CORS, env config.
- Health endpoint, API base config `/api`.
- DB migrations, seed data.

### Team E — QA & Docs
- Endpoint tests (Postman/REST).
- Contract verification with frontend.
- Error catalog and status code coverage.

---

## 12) Status Codes
- `200 OK`, `201 Created`, `204 No Content`
- `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`