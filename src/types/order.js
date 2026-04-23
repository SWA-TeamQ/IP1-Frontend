/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} userId
 * @property {import('./cart').CartItem[]} items
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} shipping
 * @property {number} total
 * @property {ShippingAddress} shippingAddress
 * @property {OrderStatus} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} city
 * @property {string} postalCode
 */

/**
 * @typedef {'pending' | 'completed' | 'cancelled' | 'shipped'} OrderStatus
 */

export {};
