import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    service: {
        type: String,
        required: [true, 'El tipo de servicio es requerido'],
        enum: {
            values: ['ensamble-personalizado', 'pc-preensamblada', 'asesoria-tecnica'],
            message: 'Por favor seleccione un servicio válido'
        }
    },
    budget: {
        type: Number,
        required: true,
        min: [500, 'El presupuesto mínimo es $500'],
        max: [5000, 'El presupuesto máximo es $5000']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        minlength: [10, 'La descripción debe tener al menos 10 caracteres']
    },
    status: {
        type: String,
        enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'],
        default: 'pendiente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

export default mongoose.model('Contact', contactSchema);
