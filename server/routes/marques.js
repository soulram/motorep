const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET toutes les marques
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM marques ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching marques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des marques' });
  }
});

// POST nouvelle marque
router.post('/', async (req, res) => {
  try {
    const { nom } = req.body;
    const [result] = await db.execute(
      'INSERT INTO marques (nom) VALUES (?)',
      [nom]
    );
    
    const [newMarque] = await db.execute('SELECT * FROM marques WHERE id = ?', [result.insertId]);
    res.status(201).json(newMarque[0]);
  } catch (error) {
    console.error('Error creating marque:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la marque' });
  }
});

module.exports = router;