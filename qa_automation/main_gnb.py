import requests
import csv
import json
import warnings
from bs4 import BeautifulSoup, NavigableString, MarkupResemblesLocatorWarning
from datetime import datetime
# from pandas import ExcelWriter
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Alignment
import pandas as pd
from process_components import *
from data_management import *

# url_codes = ['uk', 'fr', 'de', 'it', 'es', 'sg', 'id', 'ph', 'au', 'my', 'th', 'vn', 'ar', 'mx', 'br', 'in', 'sa', 'sa_en', 'ca', 'ca_fr', 'ae', 'ae_ar']
url_codes = ['fr', 'de', 'es', 'id', 'vn']

warnings.filterwarnings("ignore", category=MarkupResemblesLocatorWarning)

def check_404 (extracted_link):
    if extracted_link[:4].lower() != "http" and extracted_link[:2].lower() != "//":
        url_link = 'https://www.samsung.com' + extracted_link
    elif extracted_link[:2].lower() == "//":
        url_link = 'https:' + extracted_link
    else:
        url_link = extracted_link

    if url_link.lower().endswith('.pdf'):
        try:
            check_response = requests.head(url_link, allow_redirects=True, timeout=5)
            if check_response.status_code == 200:
                link_page_result = 'Y'
            else:
                link_page_result = 'N'
        except check_response.RequestException as e:
            link_page_result = 'N'

    elif 'www.samsung.com/global/' in url_link.lower() :
        check_response = requests.get(url_link)
        check_html_all = BeautifulSoup(check_response.text, 'lxml')
        if check_html_all.select_one('#content > div > div > div > div > div.cm-g-error-page') is not None:
            link_page_result = 'N'
        else:
            link_page_result = 'Y'

    elif 'shop.samsung.com/' in url_link.lower():
        link_page_result = 'N/A'

    elif 'news.samsung.com/' in url_link.lower():
        check_response = requests.get(url_link, allow_redirects=True)
        check_html_all = BeautifulSoup(check_response.text, 'lxml')
        check_text = check_html_all.select_one('head > title').text
        if check_text.lower()[:14] == 'page not found':
            link_page_result = 'N'
        else:
            link_page_result = 'Y'

    elif 'community.samsung.com/' in url_link.lower():
        link_page_result = 'N/A'

    elif 'design.samsung.com/' in url_link.lower():
        link_page_result = 'N/A'

    elif 'csr.samsung.com/' in url_link.lower():
        link_page_result = 'Y'
        check_response = requests.get(url_link)
        check_html_all = BeautifulSoup(check_response.text, 'lxml')
        body_tag = check_html_all.find('body')

        if body_tag and 'errorPage' in body_tag.get('class', []):
            link_page_result = 'N'
        else:
            try:
                p_text = check_html_all.find('p').text
                data = json.loads(p_text)
                if data.get("status") == 404:
                    link_page_result = 'N'
            except (AttributeError, TypeError, json.JSONDecodeError):
                pass

    elif 'www.samsung.com/' in url_link.lower():
        check_response = requests.get(url_link)
        check_html_all = BeautifulSoup(check_response.text, 'lxml')
        if check_html_all.select_one('#content > div > div > div > div > div.cm-g-error-page') is not None:
            link_page_result = 'N'
        else:
            link_page_result = 'Y'

    else:
        link_page_result = 'N/A'


    return link_page_result


def add_item (exl_ws, col_depth1, col_depth2, col_depth3, col_depth4, extracted_link, link_result):
    saved_item = [col_depth1, col_depth2, col_depth3, col_depth4, extracted_link, link_result]
    exl_ws.append(saved_item)

url_codes = ["us"]
for url_code in url_codes:
    url = 'https://www.samsung.com/' + url_code + '/'
    sitecode = url.split('/')[3]
    response = requests.get(url)
    html_all = BeautifulSoup(response.text, 'lxml')

    print(sitecode)



    exl_wb = Workbook()

    exl_ws = exl_wb.active
    exl_ws.title = "Home"

    exl_header = ['Location', 'Main Manu', 'Sub Menu', 'Title', 'URL', 'Check']
    exl_ws.append(exl_header)

    exl_ws.column_dimensions['A'].width = 10
    exl_ws.column_dimensions['B'].width = 20
    exl_ws.column_dimensions['C'].width = 25
    exl_ws.column_dimensions['D'].width = 30
    exl_ws.column_dimensions['E'].width = 50
    exl_ws.column_dimensions['F'].width = 5
    exl_ws.sheet_view.showGridLines = False
    exl_ws.freeze_panes = 'A2'

    content_all = html_all.select('#component-id > div.nv00-gnb__inner-wrap > div.nv00-gnb__l0-menu-wrap > ul')

    col_depth1 = 'GNB'
    for content_menu in content_all:
        col_depth2 = ''
        for content_depth01 in content_menu.select('li.nv00-gnb__l0-menu'):
            if content_depth01.select_one('button.nv00-gnb__l0-menu-btn') is not None:
                content_depth01_title = content_depth01.select_one('button.nv00-gnb__l0-menu-btn')
                print(content_depth01_title.text.strip())
                col_depth2 = content_depth01_title.text.strip()
            elif content_depth01.select_one('a.nv00-gnb__l0-menu-link') is not None:
                content_depth01_title = content_depth01.select_one('a.nv00-gnb__l0-menu-link')
                print(content_depth01_title.text.strip())
                col_depth2 = content_depth01_title.text.strip()
            col_depth3 = ''
            for content_depth02 in content_depth01.select('div.nv00-gnb__l1-menu-wrap'):
                # print(content_depth02)
                if content_depth02.select_one('div > h3.nv00-gnb__l1-menu-btn') is not None:
                    content_depth02_title = content_depth02.select_one('div > h3.nv00-gnb__l1-menu-btn')
                    print (' -' + content_depth02_title.text.strip())
                    col_depth3 = content_depth02_title.text.strip()
                if content_depth02.select_one('p.nv00-gnb__featured-products-thumbnail-title') is not None:
                    content_depth02_title = content_depth02.select_one('p.nv00-gnb__featured-products-thumbnail-title')
                    print (' -' + content_depth02_title.text.strip())
                    col_depth3 = content_depth02_title.text.strip()
                if content_depth02.select('li.nv00-gnb__l1-menu > a') is not None:
                    for content_depth03 in content_depth02.select('li.nv00-gnb__l1-menu > a'):
                        extracted_text = ""
                        for content in content_depth03:
                            if isinstance(content, NavigableString):
                                extracted_text += content
                        extracted_text = extracted_text.strip()
                        extracted_link = content_depth03.get('href', 'None')
                        link_result = check_404(extracted_link)
                        print("    - " + extracted_text, extracted_link, link_result)
                        col_depth4 = extracted_text
                        add_item(exl_ws, col_depth1, col_depth2, col_depth3, col_depth4, extracted_link, link_result)
                if content_depth02.select('li.nv00-gnb__l2-menu > a') is not None:
                    for content_depth03 in content_depth02.select('li.nv00-gnb__l2-menu > a'):

                        extracted_text = ""
                        for content in content_depth03:
                            if isinstance(content, NavigableString):
                                extracted_text += content
                        extracted_text = extracted_text.strip()
                        extracted_link = content_depth03.get('href', 'None')
                        link_result = check_404(extracted_link)
                        print("    - " + extracted_text, extracted_link, link_result)
                        col_depth4 = extracted_text
                        add_item(exl_ws, col_depth1, col_depth2, col_depth3, col_depth4, extracted_link, link_result)
                if content_depth02.select('li.nv00-gnb__featured-products-thumbnail-item > a') is not None:
                    for content_depth03 in content_depth02.select('li.nv00-gnb__featured-products-thumbnail-item > a'):
                        extracted_text = content_depth03.select_one('p.nv00-gnb__featured-products-thumbnail-item-name')
                        extracted_link = content_depth03.get('href', 'None')
                        link_result = check_404(extracted_link)
                        print("    - " + extracted_text.text.strip(), extracted_link, link_result)
                        col_depth4 = extracted_text.text.strip()
                        add_item(exl_ws, col_depth1, col_depth2, col_depth3, col_depth4, extracted_link, link_result)

    col_depth1 = 'Footer'
    col_depth2 = ''
    content_all = html_all.select('footer > div.footer > div.footer-column > div.footer-column__item')
    for content_menu in content_all:
        content_depth01_title = content_menu.select_one('div > h3.footer-category__title')
        col_depth3 = content_depth01_title.text.strip()
        print(content_depth01_title.text.strip())
        for content_depth02 in content_menu.select('div > div.footer-category__list-wrap > ul > li.footer-category__item'):
            content_depth02_title = content_depth02.select_one('a.footer-category__link')
            content_depth02_link = content_depth02_title.get('href', 'None')
            link_result = check_404(content_depth02_link)
            col_depth4 = content_depth02_title.text.strip()
            print(" - " + content_depth02_title.text.strip() , content_depth02_link, link_result)
            add_item(exl_ws, col_depth1, col_depth2, col_depth3, col_depth4, content_depth02_link, link_result)

    df = pd.DataFrame(data_list)
    file_name_base = url.replace('https://www.samsung.com/', '').replace('/', '_')
    file_name_base = file_name_base.strip('-')
    current_time = datetime.now().strftime("%Y%m%d-%H%M%S")
    final_file_name = f"{file_name_base}_{current_time}.xlsx"

    exl_wb.save(final_file_name)