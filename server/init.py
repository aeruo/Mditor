from cs50 import SQL

db = SQL("postgresql://arrnbzyy:IBICoRQ9lRqeog_SUVRaKNKbb_B8Wcpe@tai.db.elephantsql.com/arrnbzyy")

def initializedb():
    db.execute("CREATE TABLE IF NOT EXISTS pages_ (slug TEXT, content TEXT, title TEXT, author TEXT, theme TEXT, created TEXT);")
    print("db initialized successfully")

initializedb()

# https://mditor.com/p/WHpGT0