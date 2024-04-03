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


db = psycopg2.connect(host=host, dbname=db_name,user=user,password=password,port=port)
cursor = db.cursor()


def execute(query, args={}):
    try:
        cursor.execute(query, args)
        cursor.commit()
        row = cursor.fetchall()
        return row
    except Exception as e:
        return e



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

