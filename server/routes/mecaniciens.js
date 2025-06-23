const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET tous les mécaniciens
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM mecaniciens ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching mecaniciens:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des mécaniciens' });
  }
});

// POST nouveau mécanicien
router.post('/', async (req, res) => {
  try {
    const { nom } = req.body;
    const [result] = await db.execute(
      'INSERT INTO mecaniciens (nom) VALUES (?)',
      [nom]
    );
    
    const [newMecanicien] = await db.execute('SELECT * FROM mecaniciens WHERE id = ?', [result.insertId]);
    res.status(201).json(newMecanicien[0]);
  } catch (error) {
    console.error('Error creating mecanicien:', error);
    res.status(500).json({ error: 'Erreur lors de la création du mécanicien' });
  }
});

module.exports = router;