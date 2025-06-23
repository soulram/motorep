const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET toutes les pièces
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pieces ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pieces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des pièces' });
  }
});

// POST nouvelle pièce
router.post('/', async (req, res) => {
  try {
    const { nom } = req.body;
    const [result] = await db.execute(
      'INSERT INTO pieces (nom) VALUES (?)',
      [nom]
    );
    
    const [newPiece] = await db.execute('SELECT * FROM pieces WHERE id = ?', [result.insertId]);
    res.status(201).json(newPiece[0]);
  } catch (error) {
    console.error('Error creating piece:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la pièce' });
  }
});

module.exports = router;