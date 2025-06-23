const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET toutes les motos avec détails
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT m.numero_chassis, m.kilometrage, m.id_client,
             mo.nom as modele_nom, ma.nom as marque_nom,
             c.nom as client_nom, c.telephone as client_telephone
      FROM motos m
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      ORDER BY c.nom
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching motos:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des motos' });
  }
});

// GET moto par numéro de châssis
router.get('/:chassis', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT m.numero_chassis, m.kilometrage, m.id_client,
             mo.nom as modele_nom, ma.nom as marque_nom,
             c.nom as client_nom, c.telephone as client_telephone
      FROM motos m
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      WHERE m.numero_chassis = ?
    `, [req.params.chassis]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Moto non trouvée' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching moto:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la moto' });
  }
});

// POST nouvelle moto
router.post('/', async (req, res) => {
  try {
    const { numero_chassis, id_modele, id_client, kilometrage } = req.body;
    
    await db.execute(
      'INSERT INTO motos (numero_chassis, id_modele, id_client, kilometrage) VALUES (?, ?, ?, ?)',
      [numero_chassis, id_modele, id_client, kilometrage]
    );
    
    const [newMoto] = await db.execute(`
      SELECT m.numero_chassis, m.kilometrage, m.id_client,
             mo.nom as modele_nom, ma.nom as marque_nom,
             c.nom as client_nom, c.telephone as client_telephone
      FROM motos m
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      WHERE m.numero_chassis = ?
    `, [numero_chassis]);
    
    res.status(201).json(newMoto[0]);
  } catch (error) {
    console.error('Error creating moto:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la moto' });
  }
});

// PUT modifier moto
router.put('/:chassis', async (req, res) => {
  try {
    const { kilometrage } = req.body;
    await db.execute(
      'UPDATE motos SET kilometrage = ? WHERE numero_chassis = ?',
      [kilometrage, req.params.chassis]
    );
    
    const [updatedMoto] = await db.execute(`
      SELECT m.numero_chassis, m.kilometrage, m.id_client,
             mo.nom as modele_nom, ma.nom as marque_nom,
             c.nom as client_nom, c.telephone as client_telephone
      FROM motos m
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      WHERE m.numero_chassis = ?
    `, [req.params.chassis]);
    
    res.json(updatedMoto[0]);
  } catch (error) {
    console.error('Error updating moto:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de la moto' });
  }
});

module.exports = router;