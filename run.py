from app import app, db

if __name__ == '__main__':
    # Ensure database tables exist
    with app.app_context():
        db.create_all()
        print("Database tables created/verified")
    
    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5000)
