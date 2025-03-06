from app import db

# Model People
class People(db.Model):
    __tablename__ = 'people'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)

# Model Users
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    id_person = db.Column(db.Integer, db.ForeignKey('people.id'), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Model Surveys
class Surveys(db.Model):
    __tablename__ = 'surveys'
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.Boolean, nullable=False)
    question = db.Column(db.String(255), nullable=True)
    answer1 = db.Column(db.String(255), nullable=True)
    answer2 = db.Column(db.String(255), nullable=True)
    answer3 = db.Column(db.String(255), nullable=False)
    answer4 = db.Column(db.String(255), nullable=False)

# Model Votes
class Votes(db.Model):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True)
    reply = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
