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
