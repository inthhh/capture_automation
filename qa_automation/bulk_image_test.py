import requests
import csv

from bs4 import BeautifulSoup
from datetime import datetime
# from pandas import ExcelWriter
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Alignment
import pandas as pd
from process_components import *
from data_management import *
from datetime import datetime
from region import region
from db import Database



def bulk_image_test(region):
    src_list = []
    url = 'https://www.samsung.com/' + region + '/'
    print("start getting bulk image url from : ", url)
    response = requests.get(url)
    if response.status_code != 200:
        return False
    html_all = BeautifulSoup(response.text, 'lxml')
    img_tag = html_all.select_one('img.image-v2__preview, img.image__preview')

    if img_tag:
        data_mobile_src = img_tag.get('data-mobile-src', 'None')
        data_desktop_src = img_tag.get('data-desktop-src', 'None')
        src_base_url = "images.samsung.com/is/image/samsung/assets/" + region
        for image in data_mobile_src:
            print(image)
            # print(image_url)
            if src_base_url in image :
                src_list.append(image)
        for image in data_desktop_src :
            print(image)
            # image_url = image.get('src')
            # print(image_url)
            if src_base_url in image:
                src_list.append(image)
        print(len(src_list))
if __name__ == '__main__':
    # regions = region
    regions = ["uk", "ua"]
    for region in regions:
        bulk_image_test(region)
