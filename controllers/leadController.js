import Lead from '../models/Lead.js';

export const createLead = async (req, res) => {
    try {
        const { email, userType, interests } = req.body;

        // Verificar si el lead ya existe
        const existingLead = await Lead.findOne({ email });
        if (existingLead) {
            // Actualizar intereses si son diferentes
            if (interests && !interests.every(i => existingLead.interests.includes(i))) {
                existingLead.interests = [...new Set([...existingLead.interests, ...interests])];
            }
            existingLead.lastContact = new Date();
            await existingLead.save();
            
            return res.status(200).json({
                message: 'Información actualizada correctamente',
                lead: existingLead
            });
        }

        // Crear nuevo lead
        const lead = new Lead({
            email,
            userType,
            interests,
            source: 'popup'
        });

        await lead.save();

        res.status(201).json({
            message: 'Suscripción exitosa',
            lead
        });
    } catch (error) {
        console.error('Error al crear/actualizar lead:', error);
        res.status(400).json({
            error: 'Error al procesar la suscripción',
            message: error.message
        });
    }
};

export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error al obtener leads:', error);
        res.status(500).json({
            error: 'Error al obtener leads',
            message: error.message
        });
    }
};
