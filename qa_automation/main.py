import time, os
from multiprocessing import Pool
from datetime import datetime
import multiprocessing
from main_home import qa as qa_home
from main_pfs import qa as qa_pfs
import logging
import psutil
from openpyxl import Workbook
from region import region

region = region


if __name__ == '__main__':
    start_time = datetime.now()

    worker_pool = Pool(1)

    site_codes = region.keys()
    # site_codes = ["ca_fr", "cz", "mx", "sk", "th"]
    site_codes = ["pk"]
    # site_codes = ["africa_pt", "lb", "levant", "n_africa", "sa"]
    print("START QA Automation (",len(site_codes),"regions ): ", start_time.strftime("%Y/%m/%d %H:%M:%S"))

    worker_pool.map(qa_home, site_codes)
    # worker_pool.map(qa_pfs, site_codes)

    finish_time = datetime.now()
    time_elapsed = finish_time-start_time

    print("FINISH QA Automation : ", finish_time.strftime("%Y/%m/%d %H:%M:%S")," | (" , time_elapsed , ")")

