import data_manager
import bcrypt
from _datetime import datetime as dt


DATA = {"name": "test", "password": "test", "email": "test"}


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def register_user(data):
    data["registered"] = dt.now().strftime("%Y-%m-%d %H:%M:%S")
    data["password"] = hash_password(data["password"])
    query = """
    INSERT INTO users 
    VALUES (nextval('users_id_seq'), %(name)s, %(password)s, %(registered)s, %(email)s);
    """
    data_manager.execute_query(query, data)


def get_user_by_id(user_id):
    query = """
    SELECT * FROM users
    WHERE id = %(user_id)s"""
    return data_manager.execute_select(query, {"user_id": user_id}, fetchall=False)


def is_user_exists(name="", email=""):
    query = """
        SELECT * FROM users
        WHERE LOWER(name) = %(name)s OR LOWER(email) = %(email)s"""
    user = data_manager.execute_select(query, {"name": name.lower(), "email": email.lower()}, fetchall=False)
    return bool(user)


if __name__ == "__main__":
    print(is_user_exists("admi"))
