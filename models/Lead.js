import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
    },
    userType: {
        type: String,
        required: [true, 'El tipo de usuario es requerido'],
        enum: ['Diseñador', 'Programador', 'Estudiante', 'Gamer', 'Creador de Contenido', 'Profesional', 'Otro']
    },
    interests: [{
        type: String,
        enum: ['PC Gaming', 'Workstation', 'Servicio Técnico', 'Asesoría']
    }],
    source: {
        type: String,
        enum: ['popup', 'newsletter'],
        default: 'popup'
    },
    status: {
        type: String,
        enum: ['nuevo', 'contactado', 'convertido', 'inactivo'],
        default: 'nuevo'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastContact: {
        type: Date
    }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
