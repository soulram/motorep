const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET toutes les interventions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT i.id, i.numero_chassis, i.modele_moto, i.nom_client, 
             i.telephone_client, i.type_entretien, i.date_intervention,
             i.kilometrage, i.commentaire,
             m.nom as mecanicien_nom
      FROM interventions i
      JOIN mecaniciens m ON i.id_mecanicien = m.id
      ORDER BY i.date_intervention DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des interventions' });
  }
});

// GET intervention par ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT i.id, i.numero_chassis, i.modele_moto, i.nom_client, 
             i.telephone_client, i.type_entretien, i.date_intervention,
             i.kilometrage, i.commentaire,
             m.nom as mecanicien_nom
      FROM interventions i
      JOIN mecaniciens m ON i.id_mecanicien = m.id
      WHERE i.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Intervention non trouvée' });
    }
    
    // Récupérer les prestations et pièces de l'intervention
    const [prestations] = await db.execute(`
      SELECT p.nom, ip.quantite
      FROM intervention_prestations ip
      JOIN prestations p ON ip.id_prestation = p.id
      WHERE ip.id_intervention = ?
    `, [req.params.id]);
    
    const [pieces] = await db.execute(`
      SELECT p.nom, ip.quantite
      FROM intervention_pieces ip
      JOIN pieces p ON ip.id_piece = p.id
      WHERE ip.id_intervention = ?
    `, [req.params.id]);
    
    const intervention = {
      ...rows[0],
      prestations,
      pieces
    };
    
    res.json(intervention);
  } catch (error) {
    console.error('Error fetching intervention:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'intervention' });
  }
});

// POST nouvelle intervention
router.post('/', async (req, res) => {
  try {
    const { 
      numero_chassis, modele_moto, nom_client, telephone_client,
      type_entretien, kilometrage, id_mecanicien, commentaire,
      prestations, pieces
    } = req.body;
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // Créer l'intervention
      const [result] = await connection.execute(
        'INSERT INTO interventions (numero_chassis, modele_moto, nom_client, telephone_client, type_entretien, date_intervention, kilometrage, id_mecanicien, commentaire) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
        [numero_chassis, modele_moto, nom_client, telephone_client, type_entretien, kilometrage, id_mecanicien, commentaire]
      );
      
      const interventionId = result.insertId;
      
      // Ajouter les prestations
      if (prestations && prestations.length > 0) {
        for (const prestation of prestations) {
          await connection.execute(
            'INSERT INTO intervention_prestations (id_intervention, id_prestation, quantite) VALUES (?, ?, ?)',
            [interventionId, prestation.id_prestation, prestation.quantite]
          );
        }
      }
      
      // Ajouter les pièces
      if (pieces && pieces.length > 0) {
        for (const piece of pieces) {
          await connection.execute(
            'INSERT INTO intervention_pieces (id_intervention, id_piece, quantite) VALUES (?, ?, ?)',
            [interventionId, piece.id_piece, piece.quantite]
          );
        }
      }
      
      await connection.commit();
      
      // Récupérer l'intervention complète
      const [newIntervention] = await db.execute(`
        SELECT i.id, i.numero_chassis, i.modele_moto, i.nom_client, 
               i.telephone_client, i.type_entretien, i.date_intervention,
               i.kilometrage, i.commentaire,
               m.nom as mecanicien_nom
        FROM interventions i
        JOIN mecaniciens m ON i.id_mecanicien = m.id
        WHERE i.id = ?
      `, [interventionId]);
      
      res.status(201).json(newIntervention[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating intervention:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'intervention' });
  }
});

module.exports = router;