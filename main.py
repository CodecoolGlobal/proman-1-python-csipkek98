from flask import Flask, render_template, url_for, request, redirect, jsonify, session
from dotenv import load_dotenv
from flask_socketio import SocketIO, send, emit


from util import json_response
import mimetypes
import queires
import user_manager

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = "a very very secret key: hdauigfgteuzdaegku"
socketio = SocketIO(app, logger=True)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/statuses/<board_id>/")
@json_response
def get_statuses(board_id):
    return queires.get_statuses(board_id)


@app.route("/api/boards/")
@json_response
def get_boards():
    """
    All the boards
    """
    public_boards = queires.get_public_boards()
    if session.get('user'):
        user_id = user_manager.get_user_by_name_email(session['user'])["id"]
        private_boards = queires.get_private_boards(user_id)
        public_boards.extend(private_boards)
    return public_boards


@app.route("/api/boards/<int:board_id>/rename/<string:new_title>/", methods=["GET", "PUT"])
@json_response
def rename_board(new_title: str, board_id: int):
    if request.method == "PUT":
        socketio.emit('edit', "true", broadcast=True)
        queires.rename_board(new_title, board_id)
    else:
        return redirect(url_for('index'))


@app.route("/api/card/<int:card_id>/rename/<string:new_title>/", methods=['GET', 'PUT'])
@json_response
def rename_card(new_title: str, card_id: int):
    if request.method == "PUT":
        queires.rename_cards(new_title, card_id)
    else:
        return redirect(url_for('index'))


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route("/register", methods=["GET", "POST"])
def register():
    if not session.get('user'):
        if request.method == "POST":
            user_data = request.form.copy()
            user_manager.register_user(user_data)
            session['user'] = user_data['name']
            return redirect(url_for('index'))
        return render_template('register.html')
    return redirect(url_for('index'))


@app.route("/api/create/board/", methods=["POST"])
@json_response
def create_new_board():
    board_data = request.form
    queires.create_board(board_data["title"])
    default_board_names = ["new", "in progress", "testing", "done"]
    for board_name in default_board_names:
        queires.create_default_statuses(queires.get_board_by_title(board_data["title"])["id"], board_name)
    user_bard_data = {
        "board_id": queires.get_board_by_title(board_data["title"])["id"],
        "user_id": user_manager.get_user_by_name_email(session["user"])["id"],
        "status": board_data["status"]
    }
    queires.connect_board_user(user_bard_data)
    return 'board created'


@app.route("/api/create/card/", methods=["POST"])
@json_response
def create_new_card():
    socketio.emit('edit', "true", broadcast=True)
    card = request.get_json()
    card_title = card['cardTitle']
    board_id = card['boardId']
    queires.create_card(card_title, board_id)
    return 'card created'


@app.route("/api/create/status", methods=["POST"])
@json_response
def create_status():
    status_data = request.get_json()
    status_title = status_data['statusTitle']
    board_id = status_data['boardId']
    queires.create_status(status_title, board_id)
    return 'status created'


@app.route("/api/<card_id>/delete_card/", methods=['DELETE'])
@json_response
def delete_card_from_board(card_id):
    if request.method == "DELETE":
        socketio.emit('edit', "true", broadcast=True)
        queires.delete_card_from_board(card_id)


@app.route("/api/cards/<int:card_id>/rename/<string:new_title>", methods=["GET", "PUT"])
@json_response
def rename_cards(new_title: str, card_id: int):
    if request.method == "PUT":
        socketio.emit('edit', "true", broadcast=True)
        queires.rename_card(new_title, card_id)
    else:
        return redirect(url_for('index'))


@app.route("/api/column/<int:column_id>/rename/<string:new_title>/", methods=["GET", "PUT"])
@json_response
def rename_column(column_id: int, new_title: str):
    if request.method == "PUT":
        socketio.emit('edit', "true", broadcast=True)
        queires.rename_column(new_title, column_id)
    else:
        return redirect(url_for('index'))


@app.route("/api/<status_id>/delete_status/", methods=['DELETE'])
@json_response
def delete_status_from_board(status_id):
    if request.method == "DELETE":
        print(status_id)
        socketio.emit('edit', "true", broadcast=True)
        queires.delete_status(status_id)


@app.route("/api/<board_id>/delete_board/", methods=['DELETE'])
@json_response
def delete_board(board_id):
    if request.method == "DELETE":
        socketio.emit('edit', "true", broadcast=True)
        queires.delete_board(board_id)


@app.route("/api/register", methods=["POST"])
def get_username_validation():
    is_exist = user_manager.is_user_exists(request.form["name"], request.form["email"])
    return jsonify(not is_exist)


@app.route("/login", methods=["GET", "POST"])
def login():
    if not session.get('user'):
        if request.method == "POST":
            user_data = request.form.copy()
            if user_manager.validate_password_by_name(user_data["name"], user_data["password"]):
                session["user"] = user_data["name"]
                return redirect(url_for('index'))
        return render_template('login.html')
    return redirect(url_for('index'))


@app.route("/api/login", methods=["POST"])
def get_password_validation():
    is_pswd_correct = user_manager.validate_password_by_name(request.form["name"], request.form["password"])
    return jsonify(is_pswd_correct)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route("/api/user/is_login", methods=["GET"])
def get_is_logged_in():
    return jsonify(session.get('user'))


@app.route("/api/archive")
@json_response
def get_archive_data():
    return queires.get_archive_data()


@app.route("/api/board/copy_card/<card_id>", methods=['DELETE'])
@json_response
def copy_card_from_board(card_id):
    if request.method == "DELETE":
        socketio.emit('edit', "true", broadcast=True)
        queires.copy_card_from_board_to_archive(card_id)
        queires.delete_card_from_board(card_id)


@app.route("/api/archive/copy_card/<card_id>", methods=['DELETE'])
@json_response
def copy_card_from_archive(card_id):
    if request.method == "DELETE":
        socketio.emit('edit', "true", broadcast=True)
        queires.copy_card_from_archive_to_board(card_id)
        queires.delete_card_from_archive(card_id)


@app.route("/api/board/<new_column>/<card_id>/update_status", methods=['PUT'])
@json_response
def update_card_status(card_id, new_column):
    if request.method == "PUT":
        socketio.emit('edit', "true", broadcast=True)
        queires.change_card_row(card_id, new_column)
        return "Update Done!"


def main():
    socketio.run(app, debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
