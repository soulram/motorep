const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET tous les contrats avec détails
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT cc.id, cc.numero_chassis, cc.date_debut, cc.date_fin, 
             cc.kilometrage_depart, cc.actif,
             tc.nom as type_contrat, tc.description as type_description,
             c.nom as client_nom, c.telephone as client_telephone,
             mo.nom as modele_nom, ma.nom as marque_nom,
             m.kilometrage as kilometrage_actuel
      FROM contrats_clients cc
      JOIN types_contrat tc ON cc.id_type_contrat = tc.id
      JOIN motos m ON cc.numero_chassis = m.numero_chassis
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      ORDER BY cc.date_debut DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contrats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
  }
});

// GET contrat par numéro de châssis
router.get('/chassis/:chassis', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT cc.id, cc.numero_chassis, cc.date_debut, cc.date_fin, 
             cc.kilometrage_depart, cc.actif,
             tc.nom as type_contrat, tc.description as type_description,
             c.nom as client_nom, c.telephone as client_telephone,
             mo.nom as modele_nom, ma.nom as marque_nom,
             m.kilometrage as kilometrage_actuel
      FROM contrats_clients cc
      JOIN types_contrat tc ON cc.id_type_contrat = tc.id
      JOIN motos m ON cc.numero_chassis = m.numero_chassis
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      WHERE cc.numero_chassis = ? AND cc.actif = TRUE
    `, [req.params.chassis]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contrat actif non trouvé pour ce châssis' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching contrat:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du contrat' });
  }
});

// POST nouveau contrat
router.post('/', async (req, res) => {
  try {
    const { numero_chassis, id_type_contrat, date_debut, date_fin, kilometrage_depart } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO contrats_clients (numero_chassis, id_type_contrat, date_debut, date_fin, kilometrage_depart) VALUES (?, ?, ?, ?, ?)',
      [numero_chassis, id_type_contrat, date_debut, date_fin, kilometrage_depart]
    );
    
    const [newContrat] = await db.execute(`
      SELECT cc.id, cc.numero_chassis, cc.date_debut, cc.date_fin, 
             cc.kilometrage_depart, cc.actif,
             tc.nom as type_contrat, tc.description as type_description,
             c.nom as client_nom, c.telephone as client_telephone,
             mo.nom as modele_nom, ma.nom as marque_nom,
             m.kilometrage as kilometrage_actuel
      FROM contrats_clients cc
      JOIN types_contrat tc ON cc.id_type_contrat = tc.id
      JOIN motos m ON cc.numero_chassis = m.numero_chassis
      JOIN modeles mo ON m.id_modele = mo.id
      JOIN marques ma ON mo.id_marque = ma.id
      JOIN clients c ON m.id_client = c.id
      WHERE cc.id = ?
    `, [result.insertId]);
    
    res.status(201).json(newContrat[0]);
  } catch (error) {
    console.error('Error creating contrat:', error);
    res.status(500).json({ error: 'Erreur lors de la création du contrat' });
  }
});

module.exports = router;