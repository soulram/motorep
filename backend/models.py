from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
  
db = SQLAlchemy()
  
class User(db.Model):
      __tablename__ = 'users'
      id = db.Column(db.Integer, primary_key=True)
      username = db.Column(db.String(50), unique=True, nullable=False)
      password_hash = db.Column(db.String(255), nullable=False)
      full_name = db.Column(db.String(100))
      phone = db.Column(db.String(30))
      role = db.Column(db.Enum('admin', 'mecanicien', 'receptionniste'), default='mecanicien')
      created_at = db.Column(db.DateTime, default=datetime.utcnow)
  
      repairs = db.relationship('Repair', backref='mecanicien', lazy=True)
      checklists = db.relationship('Checklist', backref='mecanicien', lazy=True)
  
class MotoModel(db.Model):
      __tablename__ = 'moto_models'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
  
      motos = db.relationship('Moto', backref='model', lazy=True)
      maintenance_thresholds = db.relationship('MaintenanceThreshold', backref='model', lazy=True)
  
class Moto(db.Model):
      __tablename__ = 'motos'
      id = db.Column(db.Integer, primary_key=True)
      model_id = db.Column(db.Integer, db.ForeignKey('moto_models.id'), nullable=False)
      chassis_number = db.Column(db.String(100), unique=True, nullable=False)
      registration_number = db.Column(db.String(50), unique=True, nullable=False)
      client_name = db.Column(db.String(100))
      client_phone = db.Column(db.String(30))
  
      contracts = db.relationship('Contract', backref='moto', lazy=True)
      checklists = db.relationship('Checklist', backref='moto', lazy=True)
  
class Contract(db.Model):
      __tablename__ = 'contracts'
      id = db.Column(db.Integer, primary_key=True)
      moto_id = db.Column(db.Integer, db.ForeignKey('motos.id'), nullable=False)
      start_date = db.Column(db.Date, nullable=False)
      end_date = db.Column(db.Date, nullable=False)
      start_km = db.Column(db.Integer, nullable=False)
      end_km = db.Column(db.Integer, nullable=False)
      is_active = db.Column(db.Boolean, default=True)
  
      checklists = db.relationship('Checklist', backref='contract', lazy=True)
      services = db.relationship('Service', secondary='contract_services', backref='contracts')
  
class Checklist(db.Model):
      __tablename__ = 'checklists'
      id = db.Column(db.Integer, primary_key=True)
      checklist_number = db.Column(db.String(50), unique=True, nullable=False)
      moto_id = db.Column(db.Integer, db.ForeignKey('motos.id'), nullable=False)
      client_phone = db.Column(db.String(30))
      repair_type = db.Column(db.String(100))
      mileage = db.Column(db.Integer, nullable=False)
      mecanicien_id = db.Column(db.Integer, db.ForeignKey('users.id'))
      client_name = db.Column(db.String(100))
      is_validated = db.Column(db.Boolean, default=False)
      contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'))
      created_at = db.Column(db.DateTime, default=datetime.utcnow)
  
      repairs = db.relationship('Repair', backref='checklist', lazy=True)
  
class Repair(db.Model):
      __tablename__ = 'repairs'
      id = db.Column(db.Integer, primary_key=True)
      repair_number = db.Column(db.String(50), unique=True, nullable=False)
      checklist_id = db.Column(db.Integer, db.ForeignKey('checklists.id'), nullable=False)
      mecanicien_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
      date = db.Column(db.Date)
      mileage = db.Column(db.Integer)
  
class Service(db.Model):
      __tablename__ = 'services'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
      description = db.Column(db.String(255))
  
class Part(db.Model):
      __tablename__ = 'parts'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
      description = db.Column(db.String(255))
      stock_quantity = db.Column(db.Integer, default=0)
  
class MaintenanceThreshold(db.Model):
      __tablename__ = 'maintenance_thresholds'
      id = db.Column(db.Integer, primary_key=True)
      model_id = db.Column(db.Integer, db.ForeignKey('moto_models.id'), nullable=False)
      km_threshold = db.Column(db.Integer, nullable=False)
      description = db.Column(db.String(255))
  
class ContractService(db.Model):
      __tablename__ = 'contract_services'
      contract_id = db.Column(db.Integer, db.ForeignKey('contracts.id'), primary_key=True)
      service_id = db.Column(db.Integer, db.ForeignKey('services.id'), primary_key=True)
  
class Marque(db.Model):
      __tablename__ = 'marques'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
  
      modeles = db.relationship('Modele', backref='marque', lazy=True)
  
class Modele(db.Model):
      __tablename__ = 'modeles'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
      marque_id = db.Column(db.Integer, db.ForeignKey('marques.id'), nullable=False)
  
class TypeContrat(db.Model):
      __tablename__ = 'type_contrats'
      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(100), unique=True, nullable=False)
  
      contrats = db.relationship('ContratPrestation', backref='type_contrat', lazy=True)
  
class ContratPrestation(db.Model):
    __tablename__ = 'contrat_prestations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_type_contrat = db.Column(db.Integer, db.ForeignKey('type_contrats.id'), nullable=False)
    id_modele = db.Column(db.Integer, db.ForeignKey('modeles.id'), nullable=False)
    kilometrage_cible = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    id_piece = db.Column(db.Integer, nullable=False)
    id_prestation = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('id_type_contrat', 'id_modele', 'kilometrage_cible', name='uq_type_modele_km'),
        db.Index('idx_modele', 'id_modele', mysql_using='BTREE'),
    )
