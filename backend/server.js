// server.js

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
const { MongoClient, ObjectId } = require('mongodb'); // <-- NEW: MongoDB driver and ObjectId

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- 1. DATABASE CONFIGURATION ---
// The MongoDB connection string must be supplied via the MONGODB_URI environment variable.
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('MONGODB_URI environment variable is not set. Unable to establish database connection.');
    process.exit(1);
}

const client = new MongoClient(mongoUri);

// Global variables for the database connection
let db;
const DB_NAME = process.env.MONGODB_DB_NAME || "vajra_db";
const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

// --- CONNECTION FUNCTION ---
async function connectToDb() {
    if (db) {
        return db;
    }

    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log(`Connected successfully to MongoDB database "${DB_NAME}".`);
        return db;
    } catch (e) {
        console.error("Failed to connect to MongoDB! Check URI, User, and Network Access in Atlas.", e);
        throw e;
    }
}

async function startServer() {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server because the database connection failed.", error);
        process.exit(1);
    }
}

startServer();


// --- 2. EMAIL TRANSPORTER CONFIGURATION (Your Gmail Setup) ---
// Make sure you have substituted the App Password in the 'pass' field!
const emailUser = process.env.EMAIL_USER || 'ebrahimrafeeq@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'pgoyhgxxdssdzpom';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || emailUser;

const isEmailConfigured = Boolean(emailUser && emailPass && RECEIVER_EMAIL);
const transporter = isEmailConfigured
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    })
    : null;

// ... (createOrderEmailHtml function remains the same) ...
function createOrderEmailHtml(order) {
    // ... (same as before) ...
    const itemsList = order.items.map(item => `
        <li>
            ${item.quantity} x ${item.name} ($${item.price.toFixed(2)} each)
        </li>
    `).join('');

    return `
        <h1>New Order Placed: #${order.orderNumber}</h1>
        <p>A customer has successfully placed an order on your site.</p>
        
        <h2>Order Details</h2>
        <ul>
            ${itemsList}
        </ul>
        <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
        <p><strong>Taxes:</strong> $${order.taxes.toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${order.shipping.toFixed(2)}</p>
        <p><strong>TOTAL PAID:</strong> $${order.total.toFixed(2)}</p>

        <h2>Shipping Information</h2>
        <p>Name: ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
        <p>Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.zipCode}</p>
        <p>Email: ${order.shippingInfo.email}</p>
        <p>Phone: ${order.shippingInfo.phone}</p>
        <p>Payment Method: ${order.paymentMethod || 'Not provided'}</p>

        <p>Order Time: ${new Date(order.createdAt).toLocaleString()}</p>
    `;
}


// --- API Routes with MongoDB ---

// 1. GET /api/products 
app.get('/api/products', async (req, res) => {
    // Wait until the database connection is established
    if (!db) {
        return res.status(503).json({ message: "Database service unavailable." });
    }
    try {
        const products = await db.collection(PRODUCTS_COLLECTION).find({}).toArray();
        res.json(products);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).json({ message: "Failed to retrieve products from database." });
    }
});


// 2. POST /api/orders
app.post('/api/orders', async (req, res) => {
    if (!db) {
        return res.status(503).json({ message: "Database service unavailable." });
    }
    const { cartItems, shippingInfo, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty.' });
    }

    const requiredShippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
    const missingField = requiredShippingFields.find(field => !shippingInfo?.[field]);
    if (missingField) {
        return res.status(400).json({ message: `Missing shipping field: ${missingField}.` });
    }

    // Order Calculation (Logic remains on backend)
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + taxes + shipping;

    const newOrder = {
        orderNumber: `VAJRA-${Date.now()}`,
        items: cartItems,
        shippingInfo,
        subtotal,
        taxes,
        shipping,
        total,
        paymentMethod,
        createdAt: new Date().toISOString()
    };
    
    try {
        // SAVE ORDER to MongoDB
        const insertResult = await db.collection(ORDERS_COLLECTION).insertOne(newOrder);

        if (!insertResult.acknowledged) {
            throw new Error('Order was not acknowledged by MongoDB.');
        }

        console.log(`Order saved to database: ${newOrder.orderNumber}`);

        if (transporter) {
            const mailOptions = {
                from: `"Vajra Jewels Orders" <${emailUser}>`,
                to: RECEIVER_EMAIL,
                subject: `NEW ORDER RECEIVED: #${newOrder.orderNumber}`,
                html: createOrderEmailHtml(newOrder),
            };

            transporter.sendMail(mailOptions).then(() => {
                console.log(`Email notification sent.`);
            }).catch((emailError) => {
                console.error('Failed to send order notification email.', emailError);
            });
        }

        res.status(201).json({
            ...newOrder,
            _id: insertResult.insertedId,
        });
    } catch (e) {
        console.error("Error during order processing/saving:", e);
        res.status(500).json({ message: "Failed to finalize order. Internal error." });
    }
});

process.on('SIGINT', async () => {
    await client.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await client.close();
    process.exit(0);
});
