// User, Customer, and Admin classes

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }
}

import { Cart } from "./cart.js";

class Customer extends User {
    constructor(username, email) {
        super(username, email);
        this.cart = new Cart();
    }
}

class Admin extends User {
    constructor(username, email) {
        super(username, email);
    }
    manageProducts() {
        // Admin-specific product management logic
    }
}

export { User, Customer, Admin };
