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


if __name__ == "__main__":
    register_user(DATA)
