const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Pour la démo, on accepte des comptes prédéfinis
    const demoAccounts = {
      'admin@atelier.com': { id: 1, nom: 'Admin', role: 'admin', password: 'admin123' },
      'mecanicien@atelier.com': { id: 2, nom: 'Mécanicien', role: 'mecanicien', password: 'meca123' },
      'receptionniste@atelier.com': { id: 3, nom: 'Réceptionniste', role: 'receptionniste', password: 'recep123' }
    };

    const user = demoAccounts[username];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      nom: user.nom,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;