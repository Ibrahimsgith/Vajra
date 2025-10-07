
import express from 'express';
import cors from 'cors';
import knex from 'knex';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CartItem, ShippingInfo, Order } from '../types';

// Initialize Knex to connect to your PostgreSQL database
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL, // Use an environment variable for the connection string
});

// Main async function to start the server
const startServer = async () => {
  // Setup Express app
  const app = express();
  app.use(cors());
  app.use(express.json());

  const PORT = 3001;

  // --- API Endpoints ---

  // GET /api/products - Fetches all products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await db('products').select('*');
      res.json(products);
    } catch (error) {
      console.error("Failed to fetch products from database", error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // POST /api/orders - Creates a new order
  app.post('/api/orders', async (req, res) => {
    const { shippingInfo, items, paymentMethod }: { shippingInfo: ShippingInfo, items: CartItem[], paymentMethod?: string } = req.body;

    if (!shippingInfo || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing shipping information or cart items.' });
    }

    const fullName = shippingInfo.fullName && shippingInfo.fullName.trim().length > 0
      ? shippingInfo.fullName
      : `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + taxes + shipping;

    try {
      await db.transaction(async (trx) => {
        const [newOrder] = await trx('orders').insert({
          orderNumber: `VAJRA-${Date.now()}`,
          fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          subtotal,
          taxes,
          total,
        }).returning('*');

        const orderItems = items.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.quantity,
        }));

        await trx('order_items').insert(orderItems);

        res.status(201).json({
          ...newOrder,
          shippingInfo: {
            ...shippingInfo,
            fullName,
          },
          items,
          paymentMethod,
          subtotal,
          taxes,
          total,
        });
      });
    } catch (error) {
      console.error("Failed to save order to database", error);
      res.status(500).json({ error: 'Failed to create order' });
    }
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
