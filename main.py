from flask import Flask, render_template, url_for, request, redirect
from dotenv import load_dotenv


from util import json_response
import mimetypes
import queires

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


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


@app.route("/api/create/board/", methods=["POST"])
@json_response
def create_new_board():
    board_title = request.get_json()
    queires.create_board(board_title)
    return 'board created'


@app.route("/api/<card_id>/delete_card/", methods=['DELETE'])
@json_response
def delete_card_from_board(card_id):
    if request.method == "DELETE":
        queires.delete_card(card_id)


@app.route("/api/<status_id>/delete_status/", methods=['DELETE'])
@json_response
def delete_status_from_board(status_id):
    if request.method == "DELETE":
        print(status_id)
        queires.delete_status(status_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
