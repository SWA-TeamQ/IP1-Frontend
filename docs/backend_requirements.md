# Backend Requirements: ShopLight E-Commerce API (PHP + Postgres)

This document specifies the technical requirements and API contract for the ShopLight backend. The backend must be built using **PHP** for the logic layer and **Postgres** for data persistence.

---

## 1. Core Architecture
*   **API Style**: RESTful JSON API.
*   **Authentication**: JWT (JSON Web Tokens) for stateless session management. 
*   **Database**: PostgreSQL (Structured for relational integrity and JSONB support).
*   **Currency Handling**: All prices MUST be stored in **cents** (integers) to avoid floating-point errors. The frontend will convert to dollars for display.

---

## 2. Database Schema (Postgres)

### 2.1. `users`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `gen_random_uuid()` |
| `first_name` | VARCHAR(100) | NOT NULL |
| `last_name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE, Indexed |
| `password_hash`| TEXT | NOT NULL (Bcrypt/Argon2) |
| `role` | VARCHAR(20) | Default: 'user' (user, admin) |
| `avatar_url` | TEXT | NULL |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

### 2.2. `products`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | NOT NULL |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE, Indexed |
| `description`| TEXT | NOT NULL |
| `price_cents` | INTEGER | NOT NULL |
| `sale_price_cents`| INTEGER | NULL |
| `images` | TEXT[] | NOT NULL (Array of URLs) |
| `category` | VARCHAR(50) | NOT NULL (accessories, apparel, etc.) |
| `rating` | NUMERIC(3,2) | Default: 0 |
| `review_count`| INTEGER | Default: 0 |
| `badge` | VARCHAR(50) | NULL (New, Sale, Popular) |
| `attributes` | JSONB | NOT NULL (For dynamic specs: color, material) |
| `features` | TEXT[] | NOT NULL |
| `highlights` | TEXT[] | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

### 2.3. `reviews`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `product_id` | UUID | Foreign Key (products.id), ON DELETE CASCADE |
| `user_id` | UUID | Foreign Key (users.id), ON DELETE SET NULL |
| `rating` | INTEGER | NOT NULL (1-5) |
| `comment` | TEXT | NOT NULL |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

### 2.4. `orders`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key (users.id) |
| `subtotal_cents`| INTEGER | NOT NULL |
| `tax_cents` | INTEGER | NOT NULL |
| `shipping_cents`| INTEGER | NOT NULL |
| `total_cents` | INTEGER | NOT NULL |
| `status` | VARCHAR(20) | (pending, completed, shipped, cancelled) |
| `shipping_address`| JSONB | { firstName, lastName, address, city, postalCode } |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

### 2.5. `order_items`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | BIGSERIAL | Primary Key |
| `order_id` | UUID | Foreign Key (orders.id) |
| `product_id` | UUID | Foreign Key (products.id) |
| `quantity` | INTEGER | NOT NULL |
| `price_cents` | INTEGER | NOT NULL (Price at time of purchase) |

---

## 3. API Endpoints

### 3.1. Authentication (`/auth`)
*   `POST /auth/register`: Create a new user.
    *   **Payload**: `{ firstName, lastName, email, password, phone }`
*   `POST /auth/login`: Authenticate and return JWT + User object.
    *   **Payload**: `{ email, password }`
*   `GET /auth/me`: Validates JWT and returns current user data.

### 3.2. Products (`/products`)
*   `GET /products`: List products.
    *   **Params**: `category`, `search`, `sortBy`, `sortOrder`, `page`, `limit`.
    *   **Response**: `{ data: Product[], total: number, page: number }`
*   `GET /products/{id_or_slug}`: Get single product with details and reviews.
*   `POST /products`: (Admin Only) Create a product.
*   `PATCH /products/{id}`: (Admin Only) Update product.
*   `DELETE /products/{id}`: (Admin Only) Delete product.

### 3.3. Reviews (`/reviews`)
*   `POST /products/{id}/reviews`: (Auth Required) Submit a review.
    *   **Payload**: `{ rating, comment }`
*   `DELETE /reviews/{id}`: (Admin Only) Remove harmful reviews.

### 3.4. Orders (`/orders`)
*   `POST /orders`: (Auth Required) Create an order.
    *   **Payload**: `{ items: [{ productId, quantity, price }], shippingAddress, subtotal, tax, shipping, total }`
*   `GET /orders`: (Auth Required) List authenticated user's orders.
*   `GET /orders/all`: (Admin Only) List all orders in the system.

---

## 4. Technical Constants (Frontend Sync)

*   **Tax Rate**: Current frontend uses **15%**.
*   **Shipping**: Current frontend uses a flat **$5.00** (500 cents).
*   **Slugs**: Backend must auto-generate slugs from product names if not provided.

---

## 5. Security Requirements
1.  **CORS**: Configure to allow requests only from the frontend domain.
2.  **Input Validation**: Strict server-side validation for all fields (XSS prevention).
3.  **Password Safety**: Never store plain passwords. Use `password_hash()` in PHP.
4.  **JWT Integrity**: Secret keys must be managed in environment variables.

---
