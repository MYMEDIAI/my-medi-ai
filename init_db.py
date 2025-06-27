from app import app, db

def init_database():
    """Initialize the database with all tables"""
    with app.app_context():
        # Drop all tables (if they exist) and recreate them
        db.drop_all()
        db.create_all()
        print("Database initialized successfully!")
        print("Tables created:")
        print("- user")
        print("- health_record") 
        print("- vital")
        print("- health_goal")

if __name__ == '__main__':
    init_database()
