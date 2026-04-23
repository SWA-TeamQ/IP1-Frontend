/**
 * @typedef {Object} Product
 * @property {string} id - UUID from Postgres
 * @property {string} name
 * @property {string} slug - Necessary for Public URLs
 * @property {string} description
 * @property {number} price
 * @property {number | null} salePrice
 * @property {string[]} images
 * @property {Category} category - Flattened for better performance
 * @property {number} rating - Flattened for better performance
 * @property {number} reviewCount - Flattened for better performance
 * @property {string | null} badge - Flattened for better performance
 * @property {Object.<string, any>} attributes - JSONB Fields (Postgres)
 * @property {string[]} features
 * @property {string[]} highlights
 * @property {import('./review').Review[]} [reviews] - Relational
 */

/**
 * @typedef {'accessories' | 'apparel' | 'electronics' | 'home' | 'footwear' | 'wellness' | 'wearables'} Category
 */

export {};
