
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CartItem, ShippingInfo, Order } from '../types';
import { fileURLToPath } from 'url';

// Define the structure of our database file
interface Schema {
  products: Product[];
  orders: Order[];
}

// FIX: Define __dirname for ES modules compatibility, as it's not available by default.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the database file
const dbPath = path.resolve(__dirname, 'db.json');

// Helper function to read the database
const readDb = (): Schema => {
  try {
    // Check if the file exists before trying to read
    if (!fs.existsSync(dbPath)) {
        // If not, create it with default data
        const defaultData: Schema = { products: [], orders: [] };
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), 'utf-8');
        return defaultData;
    }
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    // Handle case where file is empty
    if (fileContent.trim() === '') {
        return { products: [], orders: [] };
    }
    return JSON.parse(fileContent) as Schema;
  } catch (error) {
    console.error("Could not read or parse db.json, returning default data.", error);
    return { products: [], orders: [] };
  }
};

// Helper function to write to the database
const writeDb = async (data: Schema): Promise<void> => {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write to db.json", error);
  }
};

// Main async function to start the server
const startServer = async () => {
  // Initialize DB by reading it. This also creates it if it doesn't exist.
  readDb();

  // Setup Express app
  const app = express();
  // FIX: The `app.use()` function can have trouble with TypeScript's overload resolution
  // when multiple middleware functions are passed at once. Registering each middleware
  // in a separate `app.use()` call resolves this.
  app.use(cors());
  app.use(express.json());

  const PORT = 3001;

  // --- API Endpoints ---

  // GET /api/products - Fetches all products
  app.get('/api/products', (req, res) => {
    const currentDb = readDb();
    res.json(currentDb.products);
  });

  // POST /api/orders - Creates a new order
  app.post('/api/orders', async (req, res) => {
    const { shippingInfo, items }: { shippingInfo: ShippingInfo, items: CartItem[] } = req.body;

    if (!shippingInfo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing shipping information or cart items.' });
    }
    
    // Server-side calculation for security
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + taxes + shipping;

    const newOrder: Order = {
      orderNumber: `VAJRA-${Date.now()}`,
      items,
      shippingInfo,
      subtotal,
      taxes,
      total,
    };
    
    const currentDb = readDb();
    currentDb.orders.push(newOrder);
    await writeDb(currentDb);
    
    res.status(201).json(newOrder);
  });


  // POST /api/style-advice - Securely fetches advice from Gemini API
  app.post('/api/style-advice', async (req, res) => {
      const { occasion } = req.body;

      if (!occasion) {
          return res.status(400).json({ error: 'Occasion is required.' });
      }
      
      if (!process.env.API_KEY) {
          return res.status(500).json({ error: 'API key is not configured on the server.' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const styleAdviceSchema = {
        type: Type.OBJECT,
        properties: {
          jewelryType: { type: Type.STRING },
          metal: { type: Type.STRING },
          gemstone: { type: Type.STRING },
          styleDescription: { type: Type.STRING },
        },
        required: ["jewelryType", "metal", "gemstone", "styleDescription"],
      };

      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `As a luxury jewelry stylist for a brand named Vajra, recommend the perfect jewelry for a customer attending the following event: "${occasion}". Provide one specific recommendation.`,
              config: {
                  responseMimeType: 'application/json',
                  responseSchema: styleAdviceSchema,
              },
          });

          res.json({ advice: response.text });

      } catch (error) {
          console.error('Error calling Gemini API:', error);
          res.status(500).json({ error: 'Failed to get style advice from the AI.' });
      }
  });


  // Start server
  app.listen(PORT, () => {
    console.log(`Vajra server running on http://localhost:${PORT}`);
  });
};

// Run the server
startServer();