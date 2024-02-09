from flask import Flask, request, jsonify, redirect
from cs50 import SQL
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

db = SQL("postgresql://arrnbzyy:IBICoRQ9lRqeog_SUVRaKNKbb_B8Wcpe@tai.db.elephantsql.com/arrnbzyy")

CORS(app)


@app.route("/")
def index():
    return jsonify({
        "status": "OK"
    })

@app.route("/api", methods=["POST"])
def api(): 
        slug = request.json['slug']
        content = request.json['content']
        title = request.json['title']
        author = request.json['author']
        theme = request.json['theme']
        created = datetime.now()

        db.execute("INSERT INTO pages_ (slug, content, title, author, theme, created) VALUES (:slug, :content, :title, :author, :theme, :created)",
            slug = slug,
            content = content,
            title = title,
            author = author,
            theme = theme,
            created = created,
        )

        return jsonify(slug), 200

from flask import jsonify

@app.route("/api/<slug>", methods=["GET"])
def api_slug(slug):
    page = db.execute("SELECT * FROM pages_ WHERE slug = :slug", slug = slug)
    if page:
        return jsonify({
            "title": page[0]["title"],
            "content": page[0]["content"],
            "author": page[0]["author"],
            "theme": page[0]["theme"]  # Assuming there's a 'theme' column in your database table
        })
    else:
        return jsonify({"error": "Page not found"}), 404



if __name__ == '__main__':
    app.run()