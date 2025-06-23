const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET tous les modèles avec marques
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT m.id, m.nom, m.id_marque, ma.nom as marque_nom
      FROM modeles m
      JOIN marques ma ON m.id_marque = ma.id
      ORDER BY ma.nom, m.nom
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching modeles:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des modèles' });
  }
});

// POST nouveau modèle
router.post('/', async (req, res) => {
  try {
    const { nom, id_marque } = req.body;
    const [result] = await db.execute(
      'INSERT INTO modeles (nom, id_marque) VALUES (?, ?)',
      [nom, id_marque]
    );
    
    const [newModele] = await db.execute(`
      SELECT m.id, m.nom, m.id_marque, ma.nom as marque_nom
      FROM modeles m
      JOIN marques ma ON m.id_marque = ma.id
      WHERE m.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newModele[0]);
  } catch (error) {
    console.error('Error creating modele:', error);
    res.status(500).json({ error: 'Erreur lors de la création du modèle' });
  }
});

module.exports = router;