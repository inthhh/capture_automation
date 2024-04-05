from db import Database

db_conn = Database()


insert_query = "INSERT INTO qa_result (date,rhq, subsidiary, site_code, page_type, category, location, area, title, description, contents, check_result, check_reason) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
# select_query = 'SELECT * FROM public.qa_result;'
list = [1]
try :
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    # print(list[1])
    db_conn.execute(insert_query, ("date","rhq", "subsidiary", "site_code","page_type","category", "col_location", "col_area", "col_title", "cell_description", "cell_contents", "cell_check","cell_inspection"))
    db_conn.commit_connection()
except Exception as e:
    print (e)
    db_conn.rollback_connection()
# db_conn.execute(select_query)