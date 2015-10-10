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
    entries = mongo.db.cities.aggregate([{"$group": {"_id": "$city", "population": {"$sum":"$pop"}}},
    			{"$sort": {"population": -1}}, {"$limit": 20}])
    data = json.dumps(entries['result'])
    resp = Response(response=data, status=200, mimetype="application/json")
    # print data
    return (resp)

if __name__ == "__main__":
    app.run(debug=True)
