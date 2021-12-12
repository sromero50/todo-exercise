from flask import Flask, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:abc@localhost/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app)
db.init_app(app)
ma = Marshmallow(app)
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20))
    password = db.Column(db.String)

    def __repr__(self):
        return "<User %r>" % self.username

class Folder(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    folder = db.Column(db.String(50))
    task = db.relationship("Task", backref="folder", passive_deletes=True)

    def __repr__(self):
        return "<Folder %r>" % self.folder
    
    def serialize(self):
        return {
            "id": self.id,
            "folder": self.folder,
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task = db.Column(db.String(50))
    id_folder = db.Column(db.Integer, db.ForeignKey('folder.id', ondelete='CASCADE'))


    def __repr__(self):
        return "<Task %r>" % self.task

    def serialize(self):
        return {
            "id": self.id,
            "task": self.task,
            "id_folder": self.id_folder
        }
    

db.create_all()

class FolderSchema (ma.Schema):
    class Folder: 
        fields = ('id', 'folder', 'task')

class TaskChema (ma.Schema):
        class Task:
            fields = ('id', 'task', 'id_folder')

folder_schema = FolderSchema()
folders_schema = FolderSchema(many=True)

task_schema = TaskChema()
tasks_schema = TaskChema(many=True)


@app.route('/create_user/', methods=['POST'])
def add_user():
    body = request.get_json()      
    user = User(username=body['username'], password=body['password'])
    db.session.add(user)
    db.session.commit()

    return "User created", 200

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username, password=password).first()
    
    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401

    return jsonify({"user_id": user.id, "username": user.username })

@app.route('/folder/', methods=['GET'])
def get_folders():
    folder = Folder.query.all()
    all_folder = list(map(lambda x: x.serialize(), folder))

    return jsonify(all_folder), 200



@app.route('/folder/<int:id>', methods=['GET'])
def get_folder(id):
    selected_folder = Folder.query.get(id)
    folder = selected_folder.serialize()
    return folder, 200

@app.route('/folder/', methods=['POST'])
def add_folder():
    body = request.get_json()      
    folder = Folder(folder=body['folder'])
    db.session.add(folder)
    db.session.commit()
    folder_query = Folder.query.all()
    all_folders = list(map(lambda x: x.serialize(), folder_query))
    return jsonify(all_folders), 200


@app.route('/folder/<folder>', methods=['DELETE'])
def delete_folder(folder):
    folder = Folder.query.filter_by(folder=folder).first()
    db.session.delete(folder)
    db.session.commit()

    return "Folder deleted", 200


@app.route('/task/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    all_tasks = list(map(lambda x: x.serialize(), tasks))

    return jsonify(all_tasks), 200

@app.route('/task/', methods=['POST'])
def add_task():
    body = request.get_json()      
    task = Task(task=body['task'], id_folder=body['id_folder'])
    db.session.add(task)
    db.session.commit()
    task_query = Task.query.all()
    all_tasks = list(map(lambda x: x.serialize(), task_query))
    return jsonify(all_tasks), 200


@app.route('/task/<int:id>', methods=['PUT'])
def modify_task(id):
    body = request.get_json()
    task = Task.query.filter_by(id=id).first()
    task.task = body["task"]
    db.session.commit()
    task_query = Task.query.all()
    all_tasks = list(map(lambda x: x.serialize(), task_query))
    return jsonify(all_tasks), 200 

@app.route('/task/<task>', methods=['DELETE'])
def delete_task(task):
    task = Task.query.filter_by(task=task).first()
    db.session.delete(task)
    db.session.commit()

    return "Task deleted", 200

@app.route('/', methods=['GET'])
def index():
    return "<h1>Welcome to the api</h1>", 200

if __name__ == "__main__":
    app.run(debug=True)
