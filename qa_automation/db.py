import psycopg2
from dotenv import load_dotenv
from datetime import datetime
import os
load_dotenv(verbose=True)

# ====================================
# Warning : 외부망에서 접근 불가능 합니다.
# 사내 망(Cato) 으로 접속 부탁드립니다.
# ====================================

host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
port = os.getenv("DB_PORT")








class Database :

    print()
    def __init__(self):
        self.conn = psycopg2.connect(host=host, dbname=db_name,user=user,password=password,port=port)
        self.cursor = self.conn.cursor()
    def execute(self, query, args={}):
        try:
            self.cursor.execute(query, args)
            row = self.cursor.fetchall()

            return row
        except Exception as e:

            return e
    def close_connection(self):
        self.cursor.close()

    def commit_connection(self):
        self.conn.commit()
        self.close_connection()


    def rollback_connection(self):
        self.conn.rollback()
        self.close_connection()


