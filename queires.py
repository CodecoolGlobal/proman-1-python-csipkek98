import data_manager


def get_card_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
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


def create_card(card_title, board_id, status_id):
    data_manager.execute_insert(
        """       
        INSERT INTO cards(title, board_id, status_id, card_order)
        VALUES (%(card_title)s, %(board_id)s, %(status_id)s, (
        SELECT MAX(card_order)+1
        FROM cards
        WHERE board_id = %(board_id)s AND status_id = %(status_id)s))""",
        {"card_title": card_title, "board_id": board_id, "status_id": status_id}
    )


def rename_board(title, board_id):
    modded_id = data_manager.execute_select(
        """
        UPDATE boards SET title = %(title)s WHERE boards.id = %(board_id)s RETURNING id;
        """
        , {"board_id": board_id,
           "title": title}
    )
    return modded_id


def delete_card_from_board(card_id):
    data_manager.execute_query(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        """
        , {"card_id": card_id}
    )


def delete_card_from_archive(card_id):
    data_manager.execute_query(
        """
        DELETE FROM archive
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


def get_archive_data():
    return data_manager.execute_select(
        """
        SELECT archive.id as id, b.title as board, s.title as status, archive.title as title  FROM archive
        JOIN boards b on archive.board_id = b.id
        JOIN statuses s on archive.status_id = s.id
        """
    )


def copy_card_from_board_to_archive(card_id):
    data_manager.execute_query(
        """
        INSERT INTO archive
        SELECT * FROM cards
        WHERE id = %(card_id)s
        """
        , {"card_id": card_id}
    )


def copy_card_from_archive_to_board(card_id):
    data_manager.execute_query(
        """
        INSERT INTO cards
        SELECT * FROM archive
        WHERE id = %(card_id)s
        """
        , {"card_id": card_id}
    )
