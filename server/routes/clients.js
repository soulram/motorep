const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET tous les clients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clients ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
  }
});

// GET client par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du client' });
  }
});

// POST nouveau client
router.post('/', async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    const [result] = await db.execute(
      'INSERT INTO clients (nom, telephone) VALUES (?, ?)',
      [nom, telephone]
    );
    
    const [newClient] = await db.execute('SELECT * FROM clients WHERE id = ?', [result.insertId]);
    res.status(201).json(newClient[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
});

// PUT modifier client
router.put('/:id', async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    await db.execute(
      'UPDATE clients SET nom = ?, telephone = ? WHERE id = ?',
      [nom, telephone, req.params.id]
    );
    
    const [updatedClient] = await db.execute('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    res.json(updatedClient[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Erreur lors de la modification du client' });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM clients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du client' });
  }
});

module.exports = router;