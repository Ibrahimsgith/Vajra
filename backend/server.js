const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const db = require('./db');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const productsFilePath = path.join(__dirname, 'data', 'products.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

let productsCache = null;
let ordersCache = null;
let mongoReady = false;
let mongoInitPromise = null;

if (db.isEnabled()) {
  mongoInitPromise = db
    .initializeDatabase()
    .then(() => {
      mongoReady = true;
      console.log('MongoDB datastore initialised and ready.');
    })
    .catch((error) => {
      console.warn('MongoDB datastore initialisation failed. Using filesystem fallback.', error);
    });
} else {
  console.log('MongoDB datastore not configured. Using filesystem storage.');
}

async function ensureMongoReady() {
  if (!mongoInitPromise) {
    return mongoReady;
  }

  try {
    await mongoInitPromise;
    return mongoReady;
  } catch (_error) {
    return false;
  }
}

function normalise(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return value.toString().trim().toLowerCase();
}

function slugify(value) {
  return normalise(value).replace(/[^a-z0-9]+/g, '');
}

async function loadProducts() {
  if (productsCache) {
    return productsCache;
  }

  const mongoAvailable = await ensureMongoReady();
  if (mongoAvailable) {
    try {
      productsCache = await db.getAllProducts();
      return productsCache;
    } catch (error) {
      console.warn('Failed to load products from MongoDB. Falling back to filesystem storage.', error);
    }
  }

  const fileContents = await fs.readFile(productsFilePath, 'utf8');
  const parsed = JSON.parse(fileContents);

  if (!Array.isArray(parsed)) {
    throw new Error('Products data file must contain an array.');
  }

  productsCache = parsed;
  return productsCache;
}

async function loadOrdersFromFile() {
  try {
    const fileContents = await fs.readFile(ordersFilePath, 'utf8');
    const parsed = JSON.parse(fileContents);

    if (Array.isArray(parsed)) {
      ordersCache = parsed;
    } else {
      console.warn('Orders data file did not contain an array. Reinitialising.');
      ordersCache = [];
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      ordersCache = [];
      await fs.writeFile(ordersFilePath, JSON.stringify(ordersCache, null, 2));
    } else {
      throw error;
    }
  }

  return ordersCache;
}

async function loadOrders({ forceFile = false } = {}) {
  if (!forceFile && ordersCache) {
    return ordersCache;
  }

  if (!forceFile) {
    const mongoAvailable = await ensureMongoReady();
    if (mongoAvailable) {
      try {
        ordersCache = await db.getAllOrders();
        return ordersCache;
      } catch (error) {
        console.warn('Failed to load orders from MongoDB. Falling back to filesystem storage.', error);
      }
    }
  }

  return loadOrdersFromFile();
}

async function persistOrdersToFile(orders) {
  ordersCache = orders;
  await fs.writeFile(ordersFilePath, JSON.stringify(ordersCache, null, 2));
}

function filterProducts(products, { category, productType, search, limit } = {}) {
  let result = products;

  if (category) {
    const categorySlug = slugify(category);
    result = result.filter((product) => slugify(product.category) === categorySlug);
  }

  if (productType) {
    const productTypeSlug = slugify(productType);
    result = result.filter((product) => slugify(product.productType) === productTypeSlug);
  }

  if (search) {
    const term = normalise(search);
    result = result.filter((product) => {
      const searchable = [
        product.name,
        product.description,
        product.category,
        product.productType,
      ]
        .map(normalise)
        .join(' ');

      return searchable.includes(term);
    });
  }

  if (limit) {
    const parsedLimit = Number(limit);
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      result = result.slice(0, parsedLimit);
    }
  }

  return result;
}

function calculateOrderSummary(items) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + taxes + shipping;

  return { subtotal, taxes, shipping, total };
}

const PAGE_FILTERS = {
  bestseller: { category: 'Bestseller' },
  newarrivals: { category: 'New Arrivals' },
  combos: { productType: 'Combos' },
  gifting: { category: 'Gifting' },
  rings: { productType: 'Rings' },
  necklaces: { productType: 'Chains' },
  bracelets: { productType: 'Bracelets' },
  earrings: { productType: 'Earrings' },
  anklets: { productType: 'Anklets' },
  antiques: { productType: 'Antiques' },
  collections: {},
  home: {},
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const filtered = filterProducts(products, {
      category: Array.isArray(req.query.category) ? req.query.category[0] : req.query.category,
      productType: Array.isArray(req.query.productType) ? req.query.productType[0] : req.query.productType,
      search: Array.isArray(req.query.search) ? req.query.search[0] : req.query.search,
      limit: Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit,
    });

    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: 'Product id must be a number.' });
    }

    const product = products.find((item) => item.id === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.get('/api/categories', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const categoryMap = new Map();

    products.forEach((product) => {
      const key = product.category;
      const slug = slugify(product.category);
      const existing = categoryMap.get(slug) || { name: product.category, slug, count: 0 };
      existing.count += 1;
      categoryMap.set(slug, existing);
    });

    res.json(Array.from(categoryMap.values()));
  } catch (error) {
    next(error);
  }
});

app.get('/api/categories/:category/products', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const category = req.params.category;
    const filtered = filterProducts(products, { category });
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

app.get('/api/product-types/:type/products', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const productType = req.params.type;
    const filtered = filterProducts(products, { productType });
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

app.get('/api/search', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const term = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q || req.query.query;

    if (!term || normalise(term).length === 0) {
      return res.status(400).json({ message: 'Search term is required.' });
    }

    const filtered = filterProducts(products, { search: term });
    res.json(filtered);
  } catch (error) {
    next(error);
  }
});

app.get('/api/pages/:slug/products', async (req, res, next) => {
  try {
    const products = await loadProducts();
    const slug = slugify(req.params.slug);
    const filter = PAGE_FILTERS[slug];

    if (filter === undefined) {
      return res.status(404).json({ message: 'Page not found.' });
    }

    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const filtered = filterProducts(products, { ...filter, limit });

    res.json({
      page: slug,
      total: filtered.length,
      products: filtered,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/orders', async (req, res, next) => {
  try {
    const { cartItems, items, shippingInfo, paymentMethod } = req.body || {};
    const orderItems = Array.isArray(cartItems) && cartItems.length > 0 ? cartItems : items;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
    const missingField = requiredShippingFields.find((field) => !shippingInfo || !shippingInfo[field]);

    if (missingField) {
      return res.status(400).json({ message: `Missing shipping field: ${missingField}.` });
    }

    const enhancedItems = orderItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    const { subtotal, taxes, shipping, total } = calculateOrderSummary(enhancedItems);

    const order = {
      orderNumber: `VAJRA-${Date.now()}`,
      items: enhancedItems,
      shippingInfo,
      subtotal,
      taxes,
      shipping,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    let persistedToMongo = false;
    const mongoAvailable = await ensureMongoReady();

    if (mongoAvailable) {
      try {
        await db.insertOrder(order);
        ordersCache = null;
        persistedToMongo = true;
      } catch (error) {
        console.error('Failed to insert order into MongoDB. Falling back to filesystem storage.', error);
      }
    }

    if (!persistedToMongo) {
      const existingOrders = await loadOrders({ forceFile: true });
      existingOrders.push(order);
      await persistOrdersToFile(existingOrders);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders/:orderNumber', async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const mongoAvailable = await ensureMongoReady();

    if (mongoAvailable) {
      try {
        const order = await db.findOrder(orderNumber);
        if (order) {
          return res.json(order);
        }
      } catch (error) {
        console.warn('Failed to retrieve order from MongoDB. Falling back to filesystem storage.', error);
      }
    }

    const orders = await loadOrders({ forceFile: true });
    const order = orders.find((entry) => entry.orderNumber === orderNumber);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, _next) => {
  console.error('Unhandled error in API', err);
  res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Vajra API server listening on http://localhost:${PORT}`);
});
