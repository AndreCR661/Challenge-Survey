from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db = SQLAlchemy(app)

from models.models import People, Users, Surveys, Votes

# Endpoint para obtener todas las encuestas
@app.route('/surveys', methods=['GET'])
def get_surveys():
    surveys = Surveys.query.all()
    result = [
        {'id': survey.id, 'state': survey.state, 'question': survey.question, 'answer1': survey.answer1, 'answer2': survey.answer2, 'answer3': survey.answer3, 'answer4': survey.answer4}
        for survey in surveys
    ]
    return jsonify(result)

# Endpoint para obtener una encuesta por su ID
@app.route('/surveys/<int:survey_id>', methods=['GET'])
def get_survey(survey_id):
    survey = Surveys.query.get(survey_id)

    if not survey:
        return jsonify({'error': 'Encuesta no encontrada'}), 404

    result = {
        'id': survey.id,
        'state': survey.state,
        'question': survey.question,
        'answer1': survey.answer1,
        'answer2': survey.answer2,
        'answer3': survey.answer3,
        'answer4': survey.answer4
    }

    return jsonify(result)

# Endpoint para obtener todas las personas
@app.route('/people', methods=['GET'])
def get_people():
    people = People.query.all()
    result = [
        {'id': person.id, 'name': person.name, 'email': person.email}
        for person in people
    ]
    return jsonify(result)

# Endpoint para obtener todos los usuarios
@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    result = [
        {'id': user.id, 'id_person': user.id_person, 'username': user.username, 'password': user.password}
        for user in users
    ]
    return jsonify(result)

# Endpoint para obtener todas los votos de usuarios
@app.route('/votes', methods=['GET'])
def get_votes():
    votes = Votes.query.all()
    result = [
        {'id': vote.id, 'reply': vote.reply, 'user_id': vote.user_id, 'survey_id': vote.survey_id}
        for vote in votes
    ]
    return jsonify(result)



# Crear encuesta
@app.route('/surveys', methods=['POST'])
def create_survey():
    data = request.get_json()

    state = data.get('state')
    question = data.get('question')
    answer1 = data.get('answer1')
    answer2 = data.get('answer2')
    answer3 = data.get('answer3')
    answer4 = data.get('answer4')

    if not question or not answer1 or not answer2:
        return jsonify({'error': 'Question and at least two answers are required'}), 400

    new_survey = Surveys(
        state=state,
        question=question,
        answer1=answer1,
        answer2=answer2,
        answer3=answer3,
        answer4=answer4
    )

    try:
        db.session.add(new_survey)
        db.session.commit()
        return jsonify({'message': 'Survey created successfully', 'survey_id': new_survey.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create survey', 'details': str(e)}), 500

# Endpoint para obtener encuestas activas de un usuario
@app.route('/usersurveys/active', methods=['POST'])
def get_active_user_surveys():
    data = request.get_json()

    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    # Usamos un join para obtener encuestas activas asociadas al usuario
    active_surveys = (
        db.session.query(Surveys)
        .join(Votes, Votes.survey_id == Surveys.id)
        .filter(Votes.user_id == user_id, Surveys.state == True)
        .all()
    )

    result = [
        {
            'id': survey.id,
            'question': survey.question,
            'answer1': survey.answer1,
            'answer2': survey.answer2,
            'answer3': survey.answer3,
            'answer4': survey.answer4
        }
        for survey in active_surveys
    ]

    return jsonify(result)

# Verificar usuario
@app.route('/verify_user', methods=['POST'])
def verify_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña son requeridos'}), 400

    user = Users.query.filter_by(username=username, password=password).first()

    if user:
        return jsonify({'message': 'Autenticación exitosa', 'user_id': user.id})
    else:
        return jsonify({'error': 'Credenciales inválidas'}), 401

# Votar en la encuesta
@app.route('/votesurvey', methods=['POST'])
def create_vote():
    data = request.get_json()

    reply = data.get('reply')
    user_id = data.get('user_id')
    survey_id = data.get('survey_id')

    if not all([user_id, survey_id]):
        return jsonify({'error': 'user_id y survey_id son requeridos'}), 400

    new_vote = Votes(reply=reply, user_id=user_id, survey_id=survey_id)

    try:
        db.session.add(new_vote)
        db.session.commit()
        return jsonify({'message': 'Vote registrado correctamente', 'id': new_vote.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error al registrar Vote: {str(e)}'}), 500

# Contar respuestas de encuesta
@app.route('/votes/count', methods=['POST'])
def count_votes():
    data = request.get_json()

    survey_id = data.get('survey_id')
    reply = data.get('reply')

    if survey_id is None or reply is None:
        return jsonify({'error': 'survey_id y reply es requerido'}), 400

    count = Votes.query.filter_by(survey_id=survey_id, reply=reply).count()

    return jsonify({'Matches': count})



# Consultar encuestas con state True
@app.route('/surveys/active', methods=['GET'])
def get_active_surveys():
    active_surveys = Surveys.query.filter_by(state=True).all()

    result = [
        {
            # 'id': survey.id,
            'question': survey.question
            # 'answer1': survey.answer1,
            # 'answer2': survey.answer2,
            # 'answer3': survey.answer3,
            # 'answer4': survey.answer4
        }
        for survey in active_surveys
    ]

    return jsonify(result)

# Consultar encuestas con state True y para una survey en especifico
@app.route('/surveys/active/<int:survey_id>', methods=['GET'])
def get_active_survey(survey_id):
    active_survey = Surveys.query.filter_by(id=survey_id, state=True).first()

    if not active_survey:
        return jsonify({'error': 'Encuesta no encontrada'}), 404

    result = {
        'id': active_survey.id,
        'question': active_survey.question,
        'answer1': active_survey.answer1,
        'answer2': active_survey.answer2,
        'answer3': active_survey.answer3,
        'answer4': active_survey.answer4
    }

    return jsonify(result)

# Consultar el ID de un survey por su pregunta
@app.route('/id_surveys', methods=['POST'])
def get_survey_id():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({'error': 'question is required'}), 400

    survey = Surveys.query.filter_by(question=question).first()

    if not survey:
        return jsonify({'error': 'Encuesta no encontrada'}), 404

    return jsonify({'id': survey.id})

# Consultar solo el nombre de las encuestas
@app.route('/surveys/names', methods=['GET'])
def get_surveys_names():
    surveys = Surveys.query.all()
    result = [
        {'question': survey.question}
        for survey in surveys
    ]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
