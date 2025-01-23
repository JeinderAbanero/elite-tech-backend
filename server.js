import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Contact from './models/Contact.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validaciones básicas
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        // Crear nuevo contacto
        const contact = new Contact({
            name,
            email,
            phone,
            message
        });

        // Guardar en la base de datos
        await contact.save();

        res.status(201).json({ 
            message: 'Mensaje enviado exitosamente',
            contact
        });

    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Chatbase verification endpoint
const CHATBASE_SECRET = process.env.CHATBASE_SECRET;

app.post('/api/chatbase-auth', (req, res) => {
    try {
        // Generar un ID único para el usuario basado en su IP y timestamp
        const userIp = req.ip;
        const timestamp = Date.now();
        const userId = `${userIp}_${timestamp}`;
        
        // Generar el hash HMAC
        const hash = crypto
            .createHmac('sha256', CHATBASE_SECRET)
            .update(userId)
            .digest('hex');
        
        res.json({
            userId,
            hash
        });
    } catch (error) {
        console.error('Error generating Chatbase auth:', error);
        res.status(500).json({ error: 'Error generating authentication' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
