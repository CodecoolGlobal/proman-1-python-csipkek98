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
        SELECT statuses.id, statuses.title, b.id as board_id FROM statuses
        JOIN board_columns ON statuses.id = board_columns.status_id
        JOIN boards b on board_columns.board_id = b.id
        WHERE b.id = %(board_id)s
        GROUP BY statuses.id, b.id
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


def create_default_statuses(board_id, column_name):
    data_manager.execute_insert(
        """
            WITH new_columns as (
            INSERT INTO statuses(title)
            VALUES (%(column_name)s)
            RETURNING id
            ) INSERT INTO board_columns(board_id, status_id) 
            VALUES (%(board_id)s, (select id from new_columns))
        """,
        {"board_id": board_id, "column_name": column_name})


def create_card(card_title, board_id):
    data_manager.execute_insert(
        """       
    INSERT INTO cards(title, board_id, status_id, card_order)
    VALUES (%(card_title)s, %(board_id)s,
    (SELECT MIN(status_id)
    FROM board_columns
    WHERE board_id = %(board_id)s
    ),
    (CASE
    WHEN (SELECT MAX(card_order)+1
    FROM cards
    WHERE board_id = %(board_id)s) IS NOT NULL
    THEN (SELECT MAX(card_order)+1
    FROM cards
    WHERE board_id = %(board_id)s)
    ELSE 1 END  ))
     """,
        {"card_title": card_title, "board_id": board_id})


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


def rename_cards(title, card_id):
    modded_id = data_manager.execute_query(
        """
        UPDATE cards SET title = %(title)s WHERE cards.id = %(card_id)s RETURNING board_id;
        """
        , {"card_id": card_id,
           "title": title}
    )
    return modded_id


def rename_column(title: str, status_id):
    modded_id = data_manager.execute_query(
        """
        UPDATE statuses SET title = %(title)s WHERE statuses.id = %(status_id)s RETURNING id;
        """
        , {"status_id": status_id,
           "title": title}
    )
    return modded_id


def create_status(column_title, board_id):
    data_manager.execute_insert("""
    WITH new_column as (
    INSERT INTO statuses(title)
    VALUES (%(column_title)s)
    RETURNING id)
    INSERT INTO board_columns(board_id, status_id) 
    VALUES (%(board_id)s, (select id FROM new_column))""",
                                {"column_title": column_title, "board_id": board_id})


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
        SELECT archive.id as id, b.id as board_id, b.title as board, s.title as status, archive.title as title  FROM archive
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


def connect_board_user(data):
    data_manager.execute_query(
        """
        INSERT INTO user_board
        VALUES (%(board_id)s, %(user_id)s, %(status)s);
        """
        , data)


def get_board_by_title(title):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE title = %(title)s;
        """
        , {"title": title}, fetchall=False)


def get_public_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        JOIN user_board ON user_board.board_id = boards.id
        WHERE user_board.status = 'public';
        """)


def get_private_boards(user_id):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        JOIN user_board ON user_board.board_id = boards.id
        WHERE user_board.status = 'private' AND user_board.user_id = %(user_id)s;
        """, {"user_id": user_id})


def change_card_row(card_id, status_id):
    data_manager.execute_query(
        """
        UPDATE cards
        SET status_id = %(status_id)s
        WHERE id = %(card_id)s
        """
        , {"card_id": card_id, "status_id": status_id}
    )
