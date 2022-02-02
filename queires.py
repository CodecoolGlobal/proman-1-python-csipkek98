import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_statuses(board_id):
    default_statuses = data_manager.execute_select(
        """
        SELECT statuses.id, statuses.title, c.board_id FROM statuses
        JOIN cards c on statuses.id = c.status_id
        WHERE c.board_id = %(board_id)s
        GROUP BY statuses.id, c.board_id
        ORDER BY statuses.id
        """
        , {"board_id": board_id}
    )
    return default_statuses


def create_board(board_title):
    data_manager.execute_insert(
        """
        INSERT INTO boards(title)
         VALUES (%(board_title)s)"""
        , {"board_title": board_title})


def rename_board(title, board_id):
    modded_id = data_manager.execute_select(
        """
        UPDATE boards SET title = %(title)s WHERE boards.id = %(board_id)s RETURNING id;
        """
        , {"board_id": board_id,
           "title": title}
    )
    return modded_id


def delete_card(card_id):
    data_manager.execute_query(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        """
        , {"card_id": card_id}
    )


def delete_status(status_id):
    data_manager.execute_query(
        """
        DELETE FROM statuses
        WHERE id = %(status_id)s
        """
        , {"status_id": status_id}
    )


def delete_board(board_id):
    data_manager.execute_query(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s
        """
        , {"board_id": board_id}
    )


