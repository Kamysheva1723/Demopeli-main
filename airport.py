import config
from geopy import distance

class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active

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
            self.name = data['name']
            self.latitude = float(data['latitude'])
            self.longitude = float(data['longitude'])
            self.name = data['iso_country']
            self.name = data['continent']


    def find_random_airports(self):

        list = []
        lands = ["AN_","AS_","EU_","NA_","OC_","AF_","SA_"]
        for land in lands:
            sql = 'SELECT ident, name, iso_country, continent FROM airports WHERE continent = ' + land +\
            + "ORDER BY RAND() LIMIT 10"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            for r in res:
                if r[3] != self.continent:
                    # lisätty data, jottei jokaista kenttää tartte hakea
                    # uudestaan konstruktorissa
                    data = {'ident':r[0] ,'name': r[1], 'iso_country': r[2], 'continent': r[3]}
                    print(data)
                    apt = Airport(r[0], False, data)
                    list.append(apt)
        return list

    def distanceTo(self, target):

        coords_1 = (self.latitude, self.longitude)
        coords_2 = (target.latitude, target.longitude)
        dist = distance.distance(coords_1, coords_2).km
        return int(dist)





