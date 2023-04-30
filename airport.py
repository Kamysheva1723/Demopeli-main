import config
import math
import random


class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active

        q = get_question_from_db()

        self.question = {
            "question": q[0][0],
            "right_option": q[0][1],
            "wrong_option1": q[0][2],
            "wrong_option2": q[0][3]
        }

        # vältetään kauhiaa määrää hakuja
        if data is None:
            # find airport from DB
            sql = "SELECT ident, name, latitude_deg, longitude_deg, iso_country, continent FROM Airport WHERE ident='" + ident + "';"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.ident = res[0][0]
                self.name = res[0][1]
                self.latitude = float(res[0][2])
                self.longitude = float(res[0][3])
                self.iso_country = res[0][4]
                self.continent = res[0][5]
        else:
            self.ident = data['ident']
            self.name = data['name']
            self.latitude = float(data['latitude'])
            self.longitude = float(data['longitude'])
            self.iso_country = data['iso_country']
            self.continent = data['continent']



    #find 60 random from different continents
    def find_random_airports(self):
        list = []
        lands = ["AN","AS","EU","NA","OC","AF","SA"]
        for land in lands:
            sql = 'SELECT ident, name, iso_country, continent, latitude_deg, longitude_deg FROM airport WHERE continent = "' + land +'" ORDER BY RAND() LIMIT 10'
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            for r in res:

                # lisätty data, jottei jokaista kenttää tartte hakea
                # uudestaan konstruktorissa
                data = {'ident':r[0] ,'name': r[1], 'iso_country': r[2], 'continent': r[3], 'latitude': r[4], 'longitude':r[5]}
                print(data)
                apt = Airport(r[0], False, data)
                list.append(apt)
            print (str(list))
        return list


#shake answers
def shuffleList(list):
  for i in range(list.length):
      randomIndex = math.floor(math.random() * (i + 1))
      temp = list[i]
      list[i] = list[randomIndex]
      list[randomIndex] = temp
      return list

def get_question_from_db():
    random_id = random.randint(1, 28)
    sql = "select questions.question, questions.option_1, questions.option_2,"+\
          " questions.option_3  from questions where id = " +  str(random_id)
    cur = config.conn.cursor()
    cur.execute(sql)
    res = cur.fetchall()

    return res


