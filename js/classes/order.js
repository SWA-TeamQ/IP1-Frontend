// Order and OrderQueue classes

class Order {
    constructor(userId, cartId) {
        this.userId = userId;
        this.cartId = cartId;
        this.orderDate = new Date();
    }
}

class OrderQueue {
    orders = [];
    enqueue(orderId) {
        this.orders.push(orderId);
    }
    dequeue() {
        return this.orders.shift();
    }
}

export { Order, OrderQueue };
