const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET toutes les prestations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM prestations ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching prestations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des prestations' });
  }
});

// POST nouvelle prestation
router.post('/', async (req, res) => {
  try {
    const { nom, code } = req.body;
    const [result] = await db.execute(
      'INSERT INTO prestations (nom, code) VALUES (?, ?)',
      [nom, code]
    );
    
    const [newPrestation] = await db.execute('SELECT * FROM prestations WHERE id = ?', [result.insertId]);
    res.status(201).json(newPrestation[0]);
  } catch (error) {
    console.error('Error creating prestation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la prestation' });
  }
});

module.exports = router;