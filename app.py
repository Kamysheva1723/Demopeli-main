import json
import os
import random

import mysql.connector

from flask import Flask, request
from flask_cors import CORS
import config
from game import Game



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

def fly(id, dest):
    if id==0:
        game = Game(0, dest, player)
    else:
        game = Game(id, dest)

    return json_data


# http://127.0.0.1:5000/flyto?game=fEC7n0loeL95awIxgY7M&dest=EFHK&consumption=123
@app.route('/flyto')
def flyto():
    args = request.args
    id = args.get("game")
    dest = args.get("dest")
    consumption = args.get("consumption")
    json_data = fly(id, dest, consumption)
    print("*** Called flyto endpoint ***")
    return json_data


# http://127.0.0.1:5000/newgame?player=Vesa&loc=EFHK
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
