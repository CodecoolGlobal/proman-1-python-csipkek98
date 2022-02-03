from flask import Flask, render_template, url_for, request, redirect, jsonify, session
from dotenv import load_dotenv


from util import json_response
import mimetypes
import queires
import user_manager

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = "a very very secret key: hdauigfgteuzdaegku"


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/statuses/<board_id>")
@json_response
def get_statuses(board_id):
    return queires.get_statuses(board_id)


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


@app.route("/api/boards/<int:board_id>/rename/<string:new_title>", methods=["GET", "PUT"])
@json_response
def rename_board(new_title: str, board_id: int):
    if request.method == "PUT":
        queires.rename_board(new_title, board_id)
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
            return redirect(url_for('index'))
        return render_template('register.html')
    return redirect(url_for('index'))


@app.route("/api/create/board/", methods=["POST"])
@json_response
def create_new_board():
    board_title = request.get_json()
    queires.create_board(board_title)
    return 'board created'


@app.route("/api/create/card/", methods=["POST"])
@json_response
def create_new_card():
    card = request.get_json()
    card_title = card['cardTitle']
    board_id = card['boardId']
    queires.create_card(card_title, board_id)
    return 'card created'


@app.route("/api/<card_id>/delete_card/", methods=['DELETE'])
@json_response
def delete_card_from_board(card_id):
    if request.method == "DELETE":
        queires.delete_card_from_board(card_id)


@app.route("/api/cards/<int:card_id>/rename/<string:new_title>", methods=["GET", "PUT"])
@json_response
def rename_card(new_title: str, card_id: int):
    if request.method == "PUT":
        queires.rename_card(new_title, card_id)
    else:
        return redirect(url_for('index'))


@app.route("/api/<status_id>/delete_status/", methods=['DELETE'])
@json_response
def delete_status_from_board(status_id):
    if request.method == "DELETE":
        queires.delete_status(status_id)


@app.route("/api/<board_id>/delete_board/", methods=['DELETE'])
@json_response
def delete_board(board_id):
    if request.method == "DELETE":
        queires.delete_board(board_id)


@app.route("/api/register", methods=["GET", "POST"])
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


@app.route("/api/login", methods=["GET", "POST"])
def get_password_validation():
    is_pswd_correct = user_manager.validate_password_by_name(request.form["name"], request.form["password"])
    return jsonify(is_pswd_correct)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route("/api/archive")
@json_response
def get_archive_data():
    return queires.get_archive_data()


@app.route("/api/board/copy_card/<card_id>", methods=['DELETE'])
@json_response
def copy_card_from_board(card_id):
    if request.method == "DELETE":
        queires.copy_card_from_board_to_archive(card_id)
        queires.delete_card_from_board(card_id)


@app.route("/api/archive/copy_card/<card_id>", methods=['DELETE'])
@json_response
def copy_card_from_archive(card_id):
    if request.method == "DELETE":
        queires.copy_card_from_archive_to_board(card_id)
        queires.delete_card_from_archive(card_id)


@app.route("/api/board/<new_column>/<card_id>/update_status", methods=['PUT'])
@json_response
def update_card_status(card_id, new_column):
    if request.method == "PUT":
        queires.change_card_row(card_id, new_column)
        return "Update Done!"


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
