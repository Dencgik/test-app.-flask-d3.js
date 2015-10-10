from flask import Flask, render_template, Response, json
from flask.ext.pymongo import PyMongo


app = Flask(__name__, static_folder='static')
app.config.from_object('settings')
mongo = PyMongo(app)


@app.route('/')
def show_entries():
    entries = []
    return render_template('index.html', entries=entries)


@app.route('/cities/')
def get_sities():
    # entries = mongo.db.cities.find().sort("pop", -1).limit(20)
    entries = mongo.db.cities.aggregate([{"$group": {"_id": "$city", "population": {"$sum":"$pop"}}},
    			{"$sort": {"population": -1}}, {"$limit": 20}])
    data = json.dumps(entries['result'])
    resp = Response(response=data, status=200, mimetype="application/json")
    # print data
    return (resp)


# @app.route('/checkout/', methods=['GET', 'POST'])
# def checkout():
#     name = request.form.get('name')
#     phone = request.form.get('phone')
#     add_text = request.form.get('add_text')
#     email = request.form.get('email')
#     voss = request.form.getlist('voss')
#     inf = {"name": name, "phone": phone, "add_text": add_text, "voss": voss, "email": email}
#     list_voss = ', '.join(inf['voss'])
#     text = render_template("email.txt", inf=inf, list_voss=list_voss)
#     # text = 'dwawda'
#     send_email('VOSS', ADMINS[0], ADMINS, text)
#     return text


if __name__ == "__main__":
    app.run(debug=True)
