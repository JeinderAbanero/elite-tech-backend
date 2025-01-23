import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Contact from './models/Contact.js';
import Lead from './models/Lead.js';

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
        const { name, email, service, budget, description } = req.body;

        // Validaciones básicas
        if (!name || !email || !service || !budget || !description) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        // Validar servicio
        const serviciosValidos = ['ensamble-personalizado', 'pc-preensamblada', 'asesoria-tecnica'];
        if (!serviciosValidos.includes(service)) {
            return res.status(400).json({ error: 'Servicio no válido' });
        }

        // Validar presupuesto
        if (budget < 500 || budget > 5000) {
            return res.status(400).json({ error: 'El presupuesto debe estar entre $500 y $5000' });
        }

        // Crear nuevo contacto
        const contact = new Contact({
            name,
            email,
            service,
            budget,
            description
        });

        await contact.save();
        res.status(201).json({ message: 'Contacto guardado exitosamente', contact });
    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Lead Route
app.post('/api/leads', async (req, res) => {
    try {
        const { email, userType, interests } = req.body;

        // Validaciones básicas
        if (!email || !userType || !interests || interests.length === 0) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Crear nuevo lead
        const lead = new Lead({
            email,
            userType,
            interests
        });

        await lead.save();
        res.status(201).json({ message: 'Lead creado exitosamente', lead });
    } catch (error) {
        console.error('Error al crear lead:', error);
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
