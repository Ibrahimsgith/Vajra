const { MongoClient } = require('mongodb');
const fs = require('fs/promises');
const path = require('path');

const DEFAULT_DB_NAME = 'vajra';
const productsSeedPath = path.join(__dirname, 'data', 'products.json');

let cachedClient = null;
let cachedDb = null;
let connectionPromise = null;
let initialized = false;

function buildMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const host = process.env.MONGODB_HOST;
  const port = process.env.MONGODB_PORT || '27017';
  const username = process.env.MONGODB_USER || process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const authSource = process.env.MONGODB_AUTH_SOURCE;

  if (!host) {
    return null;
  }

  const credentials = username && password
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : '';

  const queryParams = [];
  if (authSource) {
    queryParams.push(`authSource=${encodeURIComponent(authSource)}`);
  }

  const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  return `mongodb://${credentials}${host}:${port}/${query}`;
}

function getDbName(client) {
  return (
    process.env.MONGODB_DB ||
    process.env.MONGODB_DATABASE ||
    (client && client.options && client.options.dbName) ||
    DEFAULT_DB_NAME
  );
}

function isEnabled() {
  return Boolean(buildMongoUri());
}

async function connect() {
  if (cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!isEnabled()) {
    throw new Error('MongoDB connection is not configured.');
  }

  if (!connectionPromise) {
    const uri = buildMongoUri();
    const client = new MongoClient(uri, {
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || undefined,
    });

    connectionPromise = client
      .connect()
      .then((connectedClient) => {
        cachedClient = connectedClient;
        cachedDb = connectedClient.db(getDbName(connectedClient));
        return { client: cachedClient, db: cachedDb };
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

async function seedProducts(collection) {
  const existingCount = await collection.estimatedDocumentCount();
  if (existingCount > 0) {
    return;
  }

  try {
    const fileContents = await fs.readFile(productsSeedPath, 'utf8');
    const products = JSON.parse(fileContents);

    if (!Array.isArray(products) || products.length === 0) {
      console.warn('Products seed file is empty or invalid.');
      return;
    }

    await collection.insertMany(products);
  } catch (error) {
    console.error('Failed to seed products collection from file.', error);
  }
}

async function ensureIndexes(db) {
  const productsCollection = db.collection('products');
  const ordersCollection = db.collection('orders');

  await Promise.all([
    productsCollection.createIndex({ id: 1 }, { unique: true, name: 'product_id_unique' }),
    ordersCollection.createIndex(
      { orderNumber: 1 },
      { unique: true, name: 'order_orderNumber_unique' }
    ),
  ]);
}

async function initializeDatabase() {
  if (!isEnabled()) {
    return false;
  }

  if (initialized) {
    return true;
  }

  try {
    const { db } = await connect();
    await ensureIndexes(db);
    await seedProducts(db.collection('products'));
    initialized = true;
    return true;
  } catch (error) {
    initialized = false;
    throw error;
  }
}

async function getAllProducts() {
  const { db } = await connect();
  return db.collection('products').find({}).sort({ id: 1 }).toArray();
}

async function getAllOrders() {
  const { db } = await connect();
  return db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
}

async function insertOrder(order) {
  const { db } = await connect();
  await db.collection('orders').insertOne(order);
  return order;
}

async function findOrder(orderNumber) {
  const { db } = await connect();
  return db.collection('orders').findOne({ orderNumber });
}

module.exports = {
  initializeDatabase,
  isEnabled,
  getAllProducts,
  getAllOrders,
  insertOrder,
  findOrder,
};
