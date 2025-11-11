// 1. Importar los "compas"
require('dotenv').config(); // Para poder leer el archivo .env
const express = require('express');
const mongoose = require('mongoose');

// 2. Crear la App de Express
const app = express();
app.use(express.json()); // ¡Importante! Para que Express entienda JSONs

// 3. Conectarse a la "Bodega" (Mongo Atlas)
const mongoUri = process.env.MONGO_URI; // Sacamos la llave del .env

// ¡Asegurémonos de que la llave se está leyendo!
// console.log("La URI de Mongo es:", mongoUri); 

mongoose.connect(mongoUri)
    .then(() => console.log('¡Conectado a Mongo Atlas! 😎'))
    .catch((err) => console.error('Error de conexión a Mongo:', err));

// 4. Definir el "Molde" (Esquema) y el "Modelo"
const cartaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    rareza: String,
    precio: { type: Number, default: 0 },
    enVenta: { type: Boolean, default: true }
});

const Carta = mongoose.model('Carta', cartaSchema);

// 5. Crear las "Recetas" (Rutas del CRUD)

// --- CREATE (Crear una carta nueva) ---
app.post('/cartas', async (req, res) => {
    try {
        const nuevaCarta = new Carta(req.body);
        await nuevaCarta.save();
        res.status(201).json(nuevaCarta);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// --- READ (Leer todas las cartas) ---
app.get('/cartas', async (req, res) => {
    try {
        const todasLasCartas = await Carta.find();
        res.json(todasLasCartas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// --- UPDATE (Actualizar una carta) ---
app.put('/cartas/:id', async (req, res) => {
    try {
        const cartaActualizada = await Carta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cartaActualizada) {
            return res.status(404).json({ mensaje: 'Carta no encontrada' });
        }
        res.json(cartaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// --- DELETE (Borrar una carta) ---
app.delete('/cartas/:id', async (req, res) => {
    try {
        const cartaBorrada = await Carta.findByIdAndDelete(req.params.id);
        if (!cartaBorrada) {
            return res.status(404).json({ mensaje: 'Carta no encontrada' });
        }
        res.json({ mensaje: 'Carta borrada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


// 6. Poner el Servidor a Escuchar
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor corriendo en http://localhost:${PORT}! 🚀`);
});