import time, os
from multiprocessing import Pool
from datetime import datetime
import multiprocessing
from component_list import component_qa
# from main_pfs import qa as qa_pfs
import logging
import psutil
from openpyxl import Workbook
from region import region
from db import db_dev

region = region
dev_status = 'dev' # dev: db에 저장 안됨
setting_img_check_size = 'No' # Yes/No
setting_img_check_bgcolor = 'Yes' # Yes/No
setting_img_check_logo = 'No' # Yes/No

db_dev(dev_status)

if __name__ == '__main__':
    start_time = datetime.now()

    # worker_pool = Pool(8)

    site_codes = list(region.keys())

    site_codes = ['cn']
    # page_codes = [
    #     {'url': '', 'type': 'Home', 'category': 'Home'},
    #     {'url': 'mobile/', 'type': 'PFS', 'category': 'Mobile'},
    #     {'url': 'home-appliances/', 'type': 'PFS', 'category': 'Home Appliance'}
    #     ]
    page_codes = [{'url': '', 'type': 'Home', 'category': 'Home'}]

    print("START QA Automation (",len(site_codes),"regions ): ", start_time.strftime("%Y/%m/%d %H:%M:%S"))
    args_for_component_qa = [(site_code, page_codes, dev_status, setting_img_check_size, setting_img_check_bgcolor, setting_img_check_logo) for site_code in site_codes]
    with Pool(8) as worker_pool :
        worker_pool.starmap(component_qa, args_for_component_qa)

    finish_time = datetime.now()
    time_elapsed = finish_time-start_time

    print("FINISH QA Automation : ", finish_time.strftime("%Y/%m/%d %H:%M:%S")," | (" , time_elapsed , ")")

