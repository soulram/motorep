-- Base de données pour l'atelier moto
-- Création des tables selon le schéma fourni

-- 1. Tables de référence
CREATE TABLE marques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE modeles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    id_marque INT NOT NULL,
    FOREIGN KEY (id_marque) REFERENCES marques(id)
);

CREATE TABLE types_contrat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE prestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    code CHAR(1) NOT NULL CHECK (code IN ('R','N','V')) -- R: Remplacer, N: Nettoyer, V: Vérifier
);

-- 2. Gestion des clients, motos et contrats
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20)
);

CREATE TABLE motos (
    numero_chassis VARCHAR(30) PRIMARY KEY,
    id_modele INT NOT NULL,
    id_client INT NOT NULL,
    kilometrage INT,
    FOREIGN KEY (id_modele) REFERENCES modeles(id),
    FOREIGN KEY (id_client) REFERENCES clients(id)
);

CREATE TABLE contrats_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_chassis VARCHAR(30) NOT NULL,
    id_type_contrat INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    kilometrage_depart INT,
    actif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (numero_chassis) REFERENCES motos(numero_chassis),
    FOREIGN KEY (id_type_contrat) REFERENCES types_contrat(id)
);

-- 3. Étapes d'entretien programmées
CREATE TABLE etapes_entretien (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_type_contrat INT NOT NULL,
    id_modele INT NOT NULL,
    kilometrage_cible INT NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (id_type_contrat) REFERENCES types_contrat(id),
    FOREIGN KEY (id_modele) REFERENCES modeles(id),
    UNIQUE (id_type_contrat, id_modele, kilometrage_cible)
);

CREATE TABLE etape_pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_etape_entretien INT NOT NULL,
    id_piece INT NOT NULL,
    quantite INT NOT NULL,
    FOREIGN KEY (id_etape_entretien) REFERENCES etapes_entretien(id),
    FOREIGN KEY (id_piece) REFERENCES pieces(id)
);

CREATE TABLE etape_prestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_etape_entretien INT NOT NULL,
    id_prestation INT NOT NULL,
    quantite INT NOT NULL,
    FOREIGN KEY (id_etape_entretien) REFERENCES etapes_entretien(id),
    FOREIGN KEY (id_prestation) REFERENCES prestations(id)
);

-- 4. Suivi de la consommation
CREATE TABLE consommation_pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contrat_client INT NOT NULL,
    id_piece INT NOT NULL,
    quantite INT NOT NULL,
    date_utilisation DATE NOT NULL,
    FOREIGN KEY (id_contrat_client) REFERENCES contrats_clients(id),
    FOREIGN KEY (id_piece) REFERENCES pieces(id)
);

CREATE TABLE consommation_prestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contrat_client INT NOT NULL,
    id_prestation INT NOT NULL,
    quantite INT NOT NULL,
    date_utilisation DATE NOT NULL,
    FOREIGN KEY (id_contrat_client) REFERENCES contrats_clients(id),
    FOREIGN KEY (id_prestation) REFERENCES prestations(id)
);

-- 5. Gestion des interventions
CREATE TABLE mecaniciens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE interventions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_chassis VARCHAR(30) NOT NULL,
    modele_moto VARCHAR(50) NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    telephone_client VARCHAR(20) NOT NULL,
    type_entretien VARCHAR(50) NOT NULL,
    date_intervention DATETIME NOT NULL,
    kilometrage INT,
    id_mecanicien INT NOT NULL,
    commentaire TEXT,
    FOREIGN KEY (numero_chassis) REFERENCES motos(numero_chassis),
    FOREIGN KEY (id_mecanicien) REFERENCES mecaniciens(id)
);

CREATE TABLE intervention_prestations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_intervention INT NOT NULL,
    id_prestation INT NOT NULL,
    quantite INT NOT NULL,
    FOREIGN KEY (id_intervention) REFERENCES interventions(id),
    FOREIGN KEY (id_prestation) REFERENCES prestations(id)
);

CREATE TABLE intervention_pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_intervention INT NOT NULL,
    id_piece INT NOT NULL,
    quantite INT NOT NULL,
    FOREIGN KEY (id_intervention) REFERENCES interventions(id),
    FOREIGN KEY (id_piece) REFERENCES pieces(id)
);

-- 6. Checklist détaillée
CREATE TABLE checklist_intervention (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_intervention INT NOT NULL,
    id_prestation INT NOT NULL,
    etat CHAR(1) NOT NULL, -- R: Remplacer, N: Nettoyer, V: Vérifier
    fait BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_intervention) REFERENCES interventions(id),
    FOREIGN KEY (id_prestation) REFERENCES prestations(id)
);

-- Données d'exemple
INSERT INTO marques (nom) VALUES 
('Yamaha'), ('Honda'), ('Kawasaki'), ('Suzuki'), ('BMW'), ('Ducati');

INSERT INTO modeles (nom, id_marque) VALUES 
('MT-07', 1), ('MT-09', 1), ('CBR600RR', 2), ('CB650R', 2), 
('Z900', 3), ('GSX-R750', 4), ('S1000RR', 5), ('Panigale V2', 6);

INSERT INTO types_contrat (nom, description) VALUES 
('Standard', 'Contrat d\'entretien standard'),
('Premium', 'Contrat d\'entretien premium avec services étendus'),
('Sport', 'Contrat spécialisé pour motos sportives');

INSERT INTO pieces (nom) VALUES 
('Filtre à huile'), ('Huile moteur'), ('Plaquettes frein AV'), 
('Plaquettes frein AR'), ('Pneu avant'), ('Pneu arrière'), 
('Bougie d\'allumage'), ('Filtre à air'), ('Chaîne'), ('Kit chaîne');

INSERT INTO prestations (nom, code) VALUES 
('Vidange moteur', 'R'), ('Contrôle freins', 'V'), ('Nettoyage filtre à air', 'N'),
('Remplacement plaquettes', 'R'), ('Réglage chaîne', 'V'), ('Contrôle pneus', 'V'),
('Remplacement bougies', 'R'), ('Contrôle suspension', 'V');

INSERT INTO mecaniciens (nom) VALUES 
('Jean Dupont'), ('Marie Martin'), ('Pierre Durand'), ('Sophie Leroy');