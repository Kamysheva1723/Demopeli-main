import json
import os
import random

import mysql.connector

from dotenv import load_dotenv

from flask import Flask, request
from flask_cors import CORS
import config
from game import Game

load_dotenv()

app = Flask(__name__)
# lisätty cors
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Tietokantayhteys
config.conn = mysql.connector.connect(
         host=os.environ.get('HOST'),
         port= 3306,
         database=os.environ.get('DB_NAME'),
         user=os.environ.get('DB_USER'),
         password=os.environ.get('DB_PASS'),
         autocommit=True
         )

def fly(id, dest, player=None):
    if id==0:
        game = Game(0, dest, player)
    else:
        game = Game(id, dest)

    nearby = game.location[0].find_nearby_airports()
    for a in nearby:
        game.location.append(a)
    json_data = json.dumps(game, default=lambda o: o.__dict__, indent=4)
    return json_data


# http://127.0.0.1:5000/flyto?game=fEC7n0loeL95awIxgY7M&dest=EFHK&consumption=123
@app.route('/flyto')
def flyto():
    args = request.args
    id = args.get("game")
    dest = args.get("dest")
    json_data = fly(id, dest)
    print("*** Called flyto endpoint ***")
    return json_data


# http://127.0.0.1:5000/newgame?player=Vesa&loc=EFHK
# request.args is a dictionary-like object in Flask that contains the parsed
# contents of the query string in a URL. When a client makes a GET request
# to a Flask endpoint and includes query parameters in the URL,
# Flask automatically parses these parameters into a MultiDict object and assigns it to request.args.
@app.route('/newgame')
def newgame():
    args = request.args
    player = args.get("player")
    dest = args.get("loc")
    json_data = fly(0, dest, 0, player)
    return json_data

def get_question_from_db():
    yhteys = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,  # MariaDB port
        database='flight_game',
        user='userN',
        password='1234',
        autocommit=True)

    random_id = random.randint(1, 29)
    sql = "select questions.id, questions.question, questions.option_1, questions.option_2,"+\
          " questions.option_3  from questions where id = " +  str(random_id)

    kursori = yhteys.cursor()
    kursori.execute(sql)
    tulos = kursori.fetchone()
    return tulos



if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
