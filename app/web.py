from .classes import Message

from dotenv import load_dotenv
import os

try:
    from flask import (
        Flask, render_template, request, url_for, jsonify, session)
except ImportError:
    raise RuntimeError('Unable to import flask module. Install by running '
                       'pip install flask')

load_dotenv("../.env")
SECRET_KEY = os.getenv("SECRET_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

from openai import OpenAI

client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
app.secret_key = SECRET_KEY

messages = []

@app.route('/invia', methods=['POST'])
def invia():  # define a function called submit
    msg = request.json['input']
    messages.append(Message(True, msg))
    completion = client.chat.completions.create(model="gpt-3.5-turbo",
    temperature=0.2,
    messages=[item.chat() for item in messages])
    messages.append(Message(False, completion.choices[0].message.content))

    return (jsonify(messages[-1].chat()))


@app.route('/')
@app.route('/index')
@app.route('/login')
def login():
    messages = []
    messages.append(Message(False, "Ciao, ChatGPT. Sei un recruiter dell'azienda Mundys, agisci come tale. É molto importante che tu rimanga nel ruolo. Nello specifico devi supportarmi a trovare l'offerta di lavoro adatta a me all'interno della tua azienda, Mundys. Mi raccomando non consigliarmi di cercare lavoro altrove o su altre piattaforme, tu sei qui apposta per fare questo compito. Mundys è una holding italiana che possiede diverse aziende fra cui aeroporti, autostrade e molto altro. È presente in diversi paesi europei. Io ti farò domande su possibili posizioni aperte, tu chiedimi i miei interessi in modo da capire quale lavoro sia più adatto per me poi consigliamene qualcuno. Mi raccomando la cosa importante è che scrivi risposte brevi e concise."))
    return render_template('login.html')

@app.route('/404')
@app.route('/404.html')
@app.errorhandler(404)
def error(e):
    return render_template('error-404.html')

@app.route('/videocall')
@app.route('/videocall.html')
def videocall():
    return render_template('videocall.html')

@app.route('/profile')
@app.route('/profile.html')
def profile():
    return render_template('profile.html')

@app.route('/experiences')
@app.route('/experiences.html')
def experiences():
    return render_template('experiences.html')

@app.route('/chat')
def human():
    return render_template('chat.html')