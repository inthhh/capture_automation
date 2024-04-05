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
# db_name = os.getenv("TEST_DB_NAME")
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
            print(e)
            return e
    def close_connection(self):
        self.cursor.close()

    def commit_connection(self):
        self.conn.commit()
        self.close_connection()


    def rollback_connection(self):
        self.conn.rollback()
        self.close_connection()


# insert_query = "INSERT INTO qa_result (location, title) VALUES (%s, %s);"
# insert_query = "INSERT INTO qa_result (start_time, finish_time, running_time, rhq, subsidiary, site_code, location, title, description, contents, check_result, check_reason) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
# select_query = "SELECT * FROM qa_result;"
#
# start_time = datetime.now()
# print("start time",start_time)
# finish_time = datetime.now()
# running_time = finish_time - start_time
# rhq = "NANE"
# subsidiary = "UK"
# site_code = "UK"
# location = "Key Visual"
# title = "TITLE"
# description = "description"
# contents = "contents"
# check_result = "PASS"
# check_reason = "none"
# # cursor.execute(insert_query, ("test location", "test title"))
#
# # result = execute(insert_query, ("test","test"))
# result = execute(insert_query, (start_time, finish_time, running_time, rhq, subsidiary, site_code, location, title, description, contents, check_result, check_reason))
# print(result)
#



# class Database():
#     def __init__(self):
#
#         self.cursor = self.db.cursor()
#         print("Database connection established")
#
#
#     def __del__(self):
#         self.db.close()
#         self.cursor.close()
#
#     def execute(self,query,args={}):
#         try:
#             self.cursor.execute(query, args)
#             row = self.cursor.fetchall()
#             return row
#         except Exception as e:
#             print("Error while executing :",e)
#
#
#     def commit(self):
#         self.cursor.commit()

