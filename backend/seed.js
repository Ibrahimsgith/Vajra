// seed.js

const { MongoClient } = require('mongodb');
const productsData = require('./products.json'); // Load the local JSON file

// --- DATABASE CONFIGURATION ---
// IMPORTANT: Use the same URI and credentials as in your server.js
const uri = "mongodb+srv://ebrahimrafeeq_db_user:EJHp4LdhREYSjo2K@vajracluster.fp2zsjr.mongodb.net/?retryWrites=true&w=majority&appName=VajraCluster"; 
const client = new MongoClient(uri);

const DB_NAME = "vajra_db"; 
const PRODUCTS_COLLECTION = "products";

async function seedDatabase() {
    console.log("Starting database seeding process...");
    let connection;

    try {
        // 1. Establish connection
        connection = await client.connect();
        const db = connection.db(DB_NAME);
        const productsCollection = db.collection(PRODUCTS_COLLECTION);
        
        console.log(`Successfully connected to database: ${DB_NAME}`);

        // 2. Clear existing data (optional, but safe for a one-time seed)
        const deleteResult = await productsCollection.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing products from the collection.`);

        // 3. Insert new data from products.json
        if (productsData.length > 0) {
            const insertResult = await productsCollection.insertMany(productsData);
            console.log(`Successfully inserted ${insertResult.insertedCount} products.`);
        } else {
            console.log("products.json is empty. No data inserted.");
        }

    } catch (e) {
        console.error("An error occurred during database seeding:", e);
    } finally {
        // 4. Close the connection
        if (connection) {
            await connection.close();
            console.log("Database connection closed.");
        }
        console.log("Seeding process finished.");
    }
}

seedDatabase();