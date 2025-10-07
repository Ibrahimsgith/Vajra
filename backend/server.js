// server.js

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
const { MongoClient, ObjectId } = require('mongodb'); // <-- NEW: MongoDB driver and ObjectId

const app = express();
const PORT = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- 1. DATABASE CONFIGURATION (REPLACE URI) ---
// PASTE your full connection string here, replacing <db_password> manually.
// DO NOT COMMIT YOUR REAL PASSWORD TO GIT! Use environment variables later.
const uri ="mongodb+srv://ebrahimrafeeq_db_user:EJHp4LdhREYSjo2K@vajracluster.fp2zsjr.mongodb.net/?retryWrites=true&w=majority&appName=VajraCluster";
const client = new MongoClient(uri);

// Global variables for the database connection
let db; 
const DB_NAME = "vajra_db"; 
const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

// --- CONNECTION FUNCTION ---
async function connectToDb() {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log("Connected successfully to MongoDB Atlas.");
    } catch (e) {
        console.error("Failed to connect to MongoDB! Check URI, User, and Network Access in Atlas.", e);
        process.exit(1); 
    }
}
connectToDb(); // Start connection attempt


// --- 2. EMAIL TRANSPORTER CONFIGURATION (Your Gmail Setup) ---
// Make sure you have substituted the App Password in the 'pass' field!
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, 
    auth: {
        user: 'ebrahimrafeeq@gmail.com', 
        pass: 'pgoyhgxxdssdzpom' 
    }
});
const RECEIVER_EMAIL = 'ebrahimrafeeq@gmail.com'; 

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
    const { cartItems, shippingInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty.' });
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
        total,
        createdAt: new Date().toISOString() 
    };
    
    try {
        // SAVE ORDER to MongoDB
        await db.collection(ORDERS_COLLECTION).insertOne(newOrder); 
        console.log(`Order saved to database: ${newOrder.orderNumber}`);

        // SEND EMAIL NOTIFICATION (same as before)
        const mailOptions = {
            from: `"Vajra Jewels Orders" <ebrahimrafeeq@gmail.com>`, 
            to: RECEIVER_EMAIL, 
            subject: `NEW ORDER RECEIVED: #${newOrder.orderNumber}`, 
            html: createOrderEmailHtml(newOrder), 
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent.`);
        
        res.status(201).json(newOrder); 
    } catch (e) {
        console.error("Error during order processing/saving:", e);
        // Return 500 only if saving the order fails.
        res.status(500).json({ message: "Failed to finalize order. Internal error." });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});