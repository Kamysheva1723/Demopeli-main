import random
import config



class Airport:
    # lisätty data, jottei tartte jokaista lentokenttää hakea erikseen
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active

        # vältetään kauhiaa määrää hakuja
        if data is None:
            # find airport from DB
            sql = "SELECT ident, name, iso_country FROM Airport WHERE ident='" + ident + "'"
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.ident = res[0][0]
                self.name = res[0][1]
            else:
                self.name = data['name']



