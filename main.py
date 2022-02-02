from flask import Flask, render_template, url_for, request, redirect, jsonify
from dotenv import load_dotenv


from util import json_response
import mimetypes
import queires
import user_manager

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/statuses")
@json_response
def get_statuses():
    return queires.get_statuses()


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


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
    if request.method == "POST":
        user_data = request.form.copy()
        user_manager.register_user(user_data)
        return redirect(url_for('index'))
    return render_template('register.html')


@app.route("/api/register", methods=["GET", "POST"])
def register_api():
    is_exist = user_manager.is_user_exists(request.form["name"], request.form["email"])
    return jsonify(not is_exist)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':

    main()
