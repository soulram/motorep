from flask import Blueprint, request, jsonify, abort
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, User, MotoModel, Moto, Contract, Checklist, Repair, Service, Part, MaintenanceThreshold, Marque, TypeContrat, ContratPrestation
from datetime import datetime

api = Blueprint('api', __name__)

# Users endpoints
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'full_name': u.full_name,
        'phone': u.phone,
        'role': u.role,
        'created_at': u.created_at.isoformat()
    } for u in users])

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'phone': user.phone,
            'role': user.role
        })
    return jsonify({'error': 'Invalid credentials'}), 401
  
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'phone': user.phone,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })

@api.route('/users', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('motDePasse')
    full_name = f"{data.get('prenom', '')} {data.get('nom', '')}".strip()
    phone = data.get('telephone')
    role = data.get('role', 'mecanicien')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    password_hash = generate_password_hash(password)

    new_user = User(
        username=username,
        password_hash=password_hash,
        full_name=full_name,
        phone=phone,
        role=role
    )
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    return jsonify({
        'id': new_user.id,
        'username': new_user.username,
        'full_name': new_user.full_name,
        'phone': new_user.phone,
        'role': new_user.role,
        'created_at': new_user.created_at.isoformat()
    }), 201
  
@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json

    prenom = data.get('prenom')
    nom = data.get('nom')
    username = data.get('username')
    telephone = data.get('telephone')
    role = data.get('role')
    motDePasse = data.get('motDePasse')

    if username:
        existing_user = User.query.filter(User.username == username, User.id != user_id).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 400
        user.username = username
  
    if prenom is not None or nom is not None:
        full_name = f"{prenom or ''} {nom or ''}".strip()
        user.full_name = full_name

    if telephone is not None:
        user.phone = telephone

    if role is not None:
        user.role = role

    if motDePasse:
        user.password_hash = generate_password_hash(motDePasse)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500

    return jsonify({
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'phone': user.phone,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })
  
  # ContratPrestation endpoints
@api.route('/contrat_prestations', methods=['GET'])
def get_contrat_prestations():
      contrats = ContratPrestation.query.all()
      return jsonify([{
          'id': c.id,
          'moto_id': c.moto_id,
          'start_date': c.start_date.isoformat(),
          'end_date': c.end_date.isoformat(),
          'price': c.price,
          'is_active': c.is_active
      } for c in contrats])
  
@api.route('/contrat_prestations/<int:contrat_id>', methods=['GET'])
def get_contrat_prestation(contrat_id):
      contrat = ContratPrestation.query.get_or_404(contrat_id)
      return jsonify({
          'id': contrat.id,
          'moto_id': contrat.moto_id,
          'start_date': contrat.start_date.isoformat(),
          'end_date': contrat.end_date.isoformat(),
          'price': contrat.price,
          'is_active': contrat.is_active
      })
  
@api.route('/contrat_prestations', methods=['POST'])
def create_contrat_prestation():
      data = request.json
      moto_id = data.get('moto_id')
      start_date = datetime.fromisoformat(data.get('start_date'))
      end_date = datetime.fromisoformat(data.get('end_date'))
      price = data.get('price')
      is_active = data.get('is_active', True)
  
      new_contrat = ContratPrestation(
          moto_id=moto_id,
          start_date=start_date,
          end_date=end_date,
          price=price,
          is_active=is_active
      )
      try:
          db.session.add(new_contrat)
          db.session.commit()
      except Exception as e:
          db.session.rollback()
          return jsonify({'error': f'Database error: {str(e)}'}), 500
  
      return jsonify({
          'id': new_contrat.id,
          'moto_id': new_contrat.moto_id,
          'start_date': new_contrat.start_date.isoformat(),
          'end_date': new_contrat.end_date.isoformat(),
          'price': new_contrat.price,
          'is_active': new_contrat.is_active
      }), 201
  
@api.route('/contrat_prestations/<int:contrat_id>', methods=['PUT'])
def update_contrat_prestation(contrat_id):
      contrat = ContratPrestation.query.get_or_404(contrat_id)
      data = request.json
  
      if 'moto_id' in data:
          contrat.moto_id = data['moto_id']
      if 'start_date' in data:
          contrat.start_date = datetime.fromisoformat(data['start_date'])
      if 'end_date' in data:
          contrat.end_date = datetime.fromisoformat(data['end_date'])
      if 'price' in data:
          contrat.price = data['price']
      if 'is_active' in data:
          contrat.is_active = data['is_active']
  
      try:
          db.session.commit()
      except Exception as e:
          db.session.rollback()
          return jsonify({'error': 'Database error'}), 500
  
      return jsonify({
          'id': contrat.id,
          'moto_id': contrat.moto_id,
          'start_date': contrat.start_date.isoformat(),
          'end_date': contrat.end_date.isoformat(),
          'price': contrat.price,
          'is_active': contrat.is_active
      })
  
@api.route('/contrat_prestations/<int:contrat_id>', methods=['DELETE'])
def delete_contrat_prestation(contrat_id):
      contrat = ContratPrestation.query.get_or_404(contrat_id)
      try:
          db.session.delete(contrat)
          db.session.commit()
      except Exception as e:
          db.session.rollback()
          return jsonify({'error': 'Database error'}), 500
  
      return jsonify({'result': 'ContratPrestation deleted'}), 204
  
@api.route('/type_contrats', methods=['GET'])
def get_type_contrats():
    type_contrats = TypeContrat.query.all()
    return jsonify([{
        'id': tc.id,
        'name': tc.name
    } for tc in type_contrats])

@api.route('/type_contrats', methods=['POST'])
def create_type_contrat():
    data = request.json
    name = data.get('name')
    if not name or not name.strip():
        return jsonify({'error': 'Name is required'}), 400

    if TypeContrat.query.filter_by(name=name).first():
        return jsonify({'error': 'TypeContrat with this name already exists'}), 400

    new_type_contrat = TypeContrat(name=name.strip())
    try:
        db.session.add(new_type_contrat)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500

    return jsonify({
        'id': new_type_contrat.id,
        'name': new_type_contrat.name
    }), 201

# The remaining endpoints for Marques, MotoModels, Motos, Contracts, Checklists, Repairs, Services, Parts, MaintenanceThresholds, and TypeContrats remain unchanged.
