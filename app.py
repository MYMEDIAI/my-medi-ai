from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here-change-in-production')

# Use SQLite for local development
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medi_ai_local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    health_records = db.relationship('HealthRecord', backref='user', lazy=True)
    vitals = db.relationship('Vital', backref='user', lazy=True)
    goals = db.relationship('HealthGoal', backref='user', lazy=True)

# Health Records Model
class HealthRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    record_type = db.Column(db.String(50))  # lab_result, prescription, diagnosis, etc.
    record_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Vitals Model
class Vital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vital_type = db.Column(db.String(50), nullable=False)  # blood_pressure, weight, heart_rate, etc.
    value = db.Column(db.String(50), nullable=False)
    unit = db.Column(db.String(20))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

# Health Goals Model
class HealthGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    target_value = db.Column(db.String(50))
    current_value = db.Column(db.String(50))
    target_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='active')  # active, completed, paused
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    recent_records = HealthRecord.query.filter_by(user_id=current_user.id).order_by(HealthRecord.created_at.desc()).limit(5).all()
    recent_vitals = Vital.query.filter_by(user_id=current_user.id).order_by(Vital.recorded_at.desc()).limit(5).all()
    active_goals = HealthGoal.query.filter_by(user_id=current_user.id, status='active').count()
    
    return render_template('dashboard.html', 
                         user=current_user,
                         recent_records=recent_records,
                         recent_vitals=recent_vitals,
                         active_goals=active_goals)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'error')
            return render_template('register.html')
        
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name
        )
        db.session.add(user)
        db.session.commit()
        
        login_user(user)
        flash('Registration successful!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('register.html')

@app.route('/records')
@login_required
def records():
    records = HealthRecord.query.filter_by(user_id=current_user.id).order_by(HealthRecord.record_date.desc()).all()
    return render_template('records.html', records=records)

@app.route('/records/add', methods=['GET', 'POST'])
@login_required
def add_record():
    if request.method == 'POST':
        record = HealthRecord(
            user_id=current_user.id,
            title=request.form['title'],
            description=request.form['description'],
            record_type=request.form['record_type'],
            record_date=datetime.strptime(request.form['record_date'], '%Y-%m-%d').date()
        )
        db.session.add(record)
        db.session.commit()
        flash('Health record added successfully!', 'success')
        return redirect(url_for('records'))
    
    return render_template('add_record.html')

@app.route('/vitals')
@login_required
def vitals():
    vitals = Vital.query.filter_by(user_id=current_user.id).order_by(Vital.recorded_at.desc()).all()
    return render_template('vitals.html', vitals=vitals)

@app.route('/vitals/add', methods=['GET', 'POST'])
@login_required
def add_vital():
    if request.method == 'POST':
        vital = Vital(
            user_id=current_user.id,
            vital_type=request.form['vital_type'],
            value=request.form['value'],
            unit=request.form['unit']
        )
        db.session.add(vital)
        db.session.commit()
        flash('Vital sign recorded successfully!', 'success')
        return redirect(url_for('vitals'))
    
    return render_template('add_vital.html')

@app.route('/goals')
@login_required
def goals():
    goals = HealthGoal.query.filter_by(user_id=current_user.id).order_by(HealthGoal.created_at.desc()).all()
    return render_template('goals.html', goals=goals)

@app.route('/goals/add', methods=['GET', 'POST'])
@login_required
def add_goal():
    if request.method == 'POST':
        goal = HealthGoal(
            user_id=current_user.id,
            title=request.form['title'],
            description=request.form['description'],
            target_value=request.form['target_value'],
            target_date=datetime.strptime(request.form['target_date'], '%Y-%m-%d').date() if request.form['target_date'] else None
        )
        db.session.add(goal)
        db.session.commit()
        flash('Health goal created successfully!', 'success')
        return redirect(url_for('goals'))
    
    return render_template('add_goal.html')

@app.route('/ai-assistant')
@login_required
def ai_assistant():
    return render_template('ai_assistant.html')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html', user=current_user)

@app.route('/settings/update', methods=['POST'])
@login_required
def update_settings():
    current_user.first_name = request.form['first_name']
    current_user.last_name = request.form['last_name']
    current_user.phone = request.form['phone']
    if request.form['date_of_birth']:
        current_user.date_of_birth = datetime.strptime(request.form['date_of_birth'], '%Y-%m-%d').date()
    
    db.session.commit()
    flash('Settings updated successfully!', 'success')
    return redirect(url_for('settings'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
