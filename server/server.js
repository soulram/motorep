const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/motos', require('./routes/motos'));
app.use('/api/contrats', require('./routes/contrats'));
app.use('/api/interventions', require('./routes/interventions'));
app.use('/api/pieces', require('./routes/pieces'));
app.use('/api/prestations', require('./routes/prestations'));
app.use('/api/mecaniciens', require('./routes/mecaniciens'));
app.use('/api/modeles', require('./routes/modeles'));
app.use('/api/marques', require('./routes/marques'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});