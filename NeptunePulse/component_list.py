import requests
import traceback
import csv
from bs4 import BeautifulSoup
from datetime import datetime
from pandas import ExcelWriter
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Alignment
import pandas as pd
from component_process import *
from utilities import *
# from data_management import *
from datetime import datetime
from region import region
import os
from excel_file import *

region = region
# url_codes = ['uk', 'fr', 'de', 'it', 'es', 'sg', 'id', 'ph', 'au', 'my', 'th', 'vn', 'ar', 'mx', 'br', 'in', 'sa', 'sa_en', 'ca', 'ca_fr', 'ae', 'ae_ar']
# url_code = 'uk'





def component_qa(url_code, page_codes, dev_status, setting_img_check_size, setting_img_check_bgcolor, setting_img_check_logo):
    for page_code in page_codes:
        raw_data_meta = {
            "date" : datetime.today().strftime('%Y-%m-%d'),
            "rhq" : region[url_code]["rhq"],
            "subsidiary" : region[url_code]["subsidiary"],
            "site_code" : url_code,
            "page_type" : page_code['type'],
            "category" : page_code['category'],
        }

        url = 'https://www.samsung.com/' + url_code + '/' + page_code['url']
        start_time = datetime.now()
        print("START", url, 'at : ', start_time.strftime("%Y/%m/%d %H:%M:%S"))

        try :
            response = requests.get(url)
            html_all = BeautifulSoup(response.text, 'lxml')
            content_all = html_all.select('#content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div')

            exl_ws, exl_wb = excel_start(page_code['category'])
            component_num = 0

            img_html = ('<!doctype html>\n'
                        '<html lang=\"en\">\n'
                        '<head>\n'
                        '<meta charset=\"utf-8\">\n'
                        '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n'
                        '<title>Image Check</title>\n'
                        '<link href=\"../../css/bootstrap.min.css\" rel=\"stylesheet\">\n'
                        '<script src=\"../../js/bootstrap.bundle.min.js\"></script>\n'
                        '</head>\n'
                        '<body>\n'
                        '<div class=\"container text-center\">\n'
                        '<div class=\"row align-items-center\">\n'
                        '<div class=\"col-1\">No</div>\n'
                        '<div class=\"col-9\">Image</div>\n'
                        '<div class=\"col-1\">Check</div>\n'
                        '</div>\n')
            id_no = 0

            for content_comp_div in content_all:
                component_num += 1
                content_comp_name = content_comp_div.get('class', [])

                #Component: HD01_Home KV Carousel
                if 'ho-g-home-kv-carousel' in content_comp_name:
                    # KV 이미지 크기 확인을 위한 가이드 설정 값 추출
                    cell_value = process_class_attributes(
                        content_comp_div,
                        "N", "section",
                        {"home-kv-carousel--width-large" : "1920px"}, "1440px"
                    )
                    bg_image_desktop_width = 1920 if cell_value == '1920px' else 1440
                    bg_image_mobile_width = 720
                    cell_value = process_class_attributes(
                        content_comp_div,
                        "N", "section",
                        {"home-kv-carousel--height-large" : "Desktop:810px / Mobile:640px", "home-kv-carousel--height-medium" : "Desktop:640px / Mobile:540px", "home-kv-carousel--height-smedium" : "Desktop:344px / Mobile:400px", "home-kv-carousel--height-small" : "Desktop:320px / Mobile:320px"}, "N")
                    heights = {
                        'Desktop:810px / Mobile:640px' : (810, 1280),
                        'Desktop:640px / Mobile:540px' : (640, 1080),
                        'Desktop:344px / Mobile:400px' : (344, 800),
                        'Desktop:320px / Mobile:320px' : (320, 640)
                    }
                    bg_image_desktop_height, bg_image_mobile_height = heights.get(cell_value, (None, None))

                    # KV Carousel loop
                    carousel_no = 0

                    for content_carousel_div in content_comp_div.select('section > div.home-kv-carousel__container > div.home-kv-carousel__wrapper > div.home-kv-carousel__slide'):
                        carousel_no += 1

                        # Headline Text PC
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "H", "home-kv-carousel__headline", "data-desktop-headline-text",
                            )
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Headline Text",'Desktop',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status
                        )

                        img_title = cell_value

                        # Headline Text Mobile
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "H", "home-kv-carousel__headline", "data-mobile-headline-text"
                            )
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Headline Text", 'Mobile',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status
                        )

                        # Description Text PC
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "p", "home-kv-carousel__desc", "data-desktop-description"
                            )
                        cell_check, cell_remarks = '', ''
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Description Text", 'Desktop',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status
                        )

                        # Description Text Mobile
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "p", "home-kv-carousel__desc", "data-mobile-description"
                            )
                        cell_check, cell_remarks = '', ''
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Description Text", 'Mobile',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status
                        )

                        # CTA
                        cell_ctas = process_cta_buttons(content_comp_div, "div > div.home-kv-carousel__text-wrap > div.home-kv-carousel__cta-wrap")
                        cta_no = 0
                        for cell_value, cell_check, cell_remarks in cell_ctas:
                            cta_no += 1
                            excel_save_data(exl_ws,
                                "KeyVisual", "KV" + str(carousel_no), "CTA", 'Label ' + str(cta_no),
                                cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status
                            )

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(content_carousel_div, "div > div.home-kv-carousel__background-media-wrap")
                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, dev_status)
                        img_html, id_no = img_save(img_desktop_url, img_desktop, url_code, 'PC Image' + img_title, cell_check, img_html, id_no)
                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, dev_status)
                        img_html, id_no = img_save(img_mobile_url, img_mobile, url_code, 'Mobile Image' + img_title, cell_check, img_html, id_no)

                #Component: CO02_Text Block Container + CO05_Showcase Card Tab
                if 'cm-g-text-block-container' in content_comp_name and content_comp_div.select('div > div.ho-g-showcase-card-tab'):
                    col_location = process_label_text(content_comp_div, "section > div > div", "H", "text-block-container__headline")
                    for content_comp_co05 in content_comp_div.select('div.showcase-card-tab'):
                        tab_no = 0
                        for comp_co05_tab in content_comp_co05.select('div > ul.tab__list > li') :
                            tab_no += 1
                            cell_area = process_label_text(comp_co05_tab, "N", "button", "tab__item-title")
                            cell_area = re.sub(r'<span class="tab__item-line"></span>', '', cell_area)
                            cell_area = html.unescape(cell_area)
                            comp_co05_layout = content_comp_co05.select('div.showcase-card-tab__card-wrap > div > div.showcase-card-tab__card-items')[tab_no - 1]

                            card_layout_option = ''
                            card_no = 0
                            for card_compo in comp_co05_layout.find_all("div", class_='showcase-card-tab-card'):
                                if ('showcase-card-tab-card--large' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--product-large' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--vertical' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--product-vertical' in card_compo.attrs['class']):
                                    card_layout_option += 'L'
                                elif ('showcase-card-tab-card--small' in card_compo.attrs['class']
                                      or 'showcase-card-tab-card--product-small' in card_compo.attrs['class']):
                                    card_layout_option += 'S'
                            options = {'SSSSSSSS' : ['8 Card', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'LSSSSSS' : ['7 Card (1-2-2-2)', ['Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'SSLSSSS' : ['7 Card (2-1-2-2)', ['Top Left', 'Bottom Left', 'Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'SSSSLSS' : ['7 Card (2-2-1-2)', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Center Right', 'Top Right', 'Bottom Right']],
                                'SSSSSSL' : ['7 Card (2-2-2-1)', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Right']],
                                'SSSSSS' : ['6 Card', ['Top Left', 'Bottom Left', 'Top Center', 'Bottom Center', 'Top Right', 'Bottom Right']],
                                'SSSSL' : ['5 Card (2-2-1)', ['Top Left', 'Bottom Left', 'Top Center', 'Bottom Center', 'Right']],
                                'SSLSS' : ['5 Card (2-1-2)', ['Top Left', 'Bottom Left', 'Center', 'Top Right', 'Bottom Right']],
                                'LSSSS' : ['5 Card (1-2-2)', ['Left', 'Top Center', 'Bottom Center', 'Top Right', 'Bottom Right']],
                                'LLL' : ['3 Card', ['Left', 'Center', 'Right']]}

                            for x in options.keys():
                                if x == card_layout_option:
                                    card_number = options[x][0]
                                    card_layout = options[x][1]

                            card_list_no = 0
                            for card_list in card_layout :
                                card_list_no += 1
                                print(card_list, card_list_no)
                                card_compo_detail = comp_co05_layout.find_all("div", class_='showcase-card-tab-card')[card_list_no - 1]
                                card_type = process_class_attributes(card_compo_detail, 'N', 'N', {"showcase-card-tab-card--large" : "Full Breed", "showcase-card-tab-card--small" : "Full Breed", "showcase-card-tab-card--vertical" : "Full Breed", "showcase-card-tab-card--product-large" : "Product", "showcase-card-tab-card--product-small" : "Product", "showcase-card-tab-card--product-vertical" : "Product"}, 'N')

                                if card_type == 'Full Breed':
                                    bg_image_desktop_width = 330
                                    bg_image_desktop_height = 330
                                    bg_image_mobile_width = 296
                                    bg_image_mobile_height = 352
                                    if card_number == '3 Card':
                                        bg_image_desktop_width = 448
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                    if (card_number == '5 Card (1-2-2)' and card_list == 'Left') or (
                                            card_number == '5 Card (2-1-2)' and card_list == 'Center') or (
                                            card_number == '5 Card (2-2-1)' and card_list == 'Right'):
                                        bg_image_desktop_width = 684
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                    if card_number == '6 Card':
                                        bg_image_desktop_width = 448
                                        bg_image_desktop_height = 330
                                        bg_image_mobile_width = 296
                                        bg_image_mobile_height = 352
                                    if (card_number == '7 Card (2-2-2-1)' and card_list == 'Right') or (
                                            card_number == '7 Card (2-2-1-2)' and card_list == 'Center Right') or (
                                            card_number == '7 Card (2-1-2-2)' and card_list == 'Center Left') or (
                                            card_number == '7 Card (1-2-2-2)' and card_list == 'Left'):
                                        bg_image_desktop_width = 330
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                if card_type == 'Full Breed':
                                    bg_image_desktop_width = 160
                                    bg_image_desktop_height = 160
                                    bg_image_mobile_width = 192
                                    bg_image_mobile_height = 192
                                    if card_number == '3 Card':
                                        bg_image_desktop_width = 376
                                        bg_image_desktop_height = 376
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264
                                    if (card_number == '5 Card (1-2-2)' and card_list == 'Left') or (
                                            card_number == '5 Card (2-1-2)' and card_list == 'Center') or (
                                            card_number == '5 Card (2-2-1)' and card_list == 'Right'):
                                        bg_image_desktop_width = 376
                                        bg_image_desktop_height = 376
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264
                                    if (card_number == '7 Card (2-2-2-1)' and card_list == 'Right') or (
                                            card_number == '7 Card (2-2-1-2)' and card_list == 'Center Right') or (
                                            card_number == '7 Card (2-1-2-2)' and card_list == 'Center Left') or (
                                            card_number == '7 Card (1-2-2-2)' and card_list == 'Left'):
                                        bg_image_desktop_width = 282
                                        bg_image_desktop_height = 282
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264

                                if " " in card_list:
                                    card_size = "Small"
                                else:
                                    card_size = "Large"

                                # Headline Text PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Headline Text Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Description PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Description Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # CTA
                                cell_ctas = process_label_cta(content_comp_div, "N", "span.cta")
                                cta_no = 0
                                for cell_value, cell_check, cell_remarks in cell_ctas :
                                    cta_no += 1
                                    excel_save_data(exl_ws,
                                        col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Label ' + str(cta_no),
                                        cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # BG Image
                                img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(card_compo_detail, "div.showcase-card-tab-card__img-wrap")
                                # BG Image > Desktop
                                cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Desktop',
                                    img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, dev_status)

                                # BG Image > Mobile
                                cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Mobile',
                                    img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, dev_status)

                #Component: CO05_Showcase Card Tab
                if 'ho-g-showcase-card-tab' in content_comp_name:
                    if component_num >= 2:
                        content_comp_name_previous = content_all[component_num-2].get('class', [])
                        if 'cm-g-text-block-container' in content_comp_name_previous:
                            col_location = process_label_text(content_all[component_num-2], "section > div > div", "H", "text-block-container__headline")
                        else:
                            col_location = 'Showcase Tab'
                    else:
                        col_location = 'Showcase Tab'
                    for content_comp_co05 in content_comp_div.select('div.showcase-card-tab'):
                        tab_no = 0
                        for comp_co05_tab in content_comp_co05.select('div > ul.tab__list > li') :
                            tab_no += 1
                            cell_area = process_label_text(comp_co05_tab, "N", "button", "tab__item-title")
                            cell_area = re.sub(r'<span class="tab__item-line"></span>', '', cell_area)
                            cell_area = html.unescape(cell_area)
                            comp_co05_layout = content_comp_co05.select('div.showcase-card-tab__card-wrap > div > div.showcase-card-tab__card-items')[tab_no - 1]

                            card_layout_option = ''
                            card_no = 0
                            for card_compo in comp_co05_layout.find_all("div", class_='showcase-card-tab-card'):
                                if ('showcase-card-tab-card--large' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--product-large' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--vertical' in card_compo.attrs['class']
                                        or 'showcase-card-tab-card--product-vertical' in card_compo.attrs['class']):
                                    card_layout_option += 'L'
                                elif ('showcase-card-tab-card--small' in card_compo.attrs['class']
                                      or 'showcase-card-tab-card--product-small' in card_compo.attrs['class']):
                                    card_layout_option += 'S'
                            options = {'SSSSSSSS' : ['8 Card', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'LSSSSSS' : ['7 Card (1-2-2-2)', ['Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'SSLSSSS' : ['7 Card (2-1-2-2)', ['Top Left', 'Bottom Left', 'Center Left', 'Top Center Right', 'Bottom Center Right', 'Top Right', 'Bottom Right']],
                                'SSSSLSS' : ['7 Card (2-2-1-2)', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Center Right', 'Top Right', 'Bottom Right']],
                                'SSSSSSL' : ['7 Card (2-2-2-1)', ['Top Left', 'Bottom Left', 'Top Center Left', 'Bottom Center Left', 'Top Center Right', 'Bottom Center Right', 'Right']],
                                'SSSSSS' : ['6 Card', ['Top Left', 'Bottom Left', 'Top Center', 'Bottom Center', 'Top Right', 'Bottom Right']],
                                'SSSSL' : ['5 Card (2-2-1)', ['Top Left', 'Bottom Left', 'Top Center', 'Bottom Center', 'Right']],
                                'SSLSS' : ['5 Card (2-1-2)', ['Top Left', 'Bottom Left', 'Center', 'Top Right', 'Bottom Right']],
                                'LSSSS' : ['5 Card (1-2-2)', ['Left', 'Top Center', 'Bottom Center', 'Top Right', 'Bottom Right']],
                                'LLL' : ['3 Card', ['Left', 'Center', 'Right']]}

                            for x in options.keys():
                                if x == card_layout_option:
                                    card_number = options[x][0]
                                    card_layout = options[x][1]

                            card_list_no = 0
                            for card_list in card_layout :
                                card_list_no += 1
                                print(card_list, card_list_no)
                                card_compo_detail = comp_co05_layout.find_all("div", class_='showcase-card-tab-card')[card_list_no - 1]
                                card_type = process_class_attributes(card_compo_detail, 'N', 'N', {"showcase-card-tab-card--large" : "Full Breed", "showcase-card-tab-card--small" : "Full Breed", "showcase-card-tab-card--vertical" : "Full Breed", "showcase-card-tab-card--product-large" : "Product", "showcase-card-tab-card--product-small" : "Product", "showcase-card-tab-card--product-vertical" : "Product"}, 'N')

                                if card_type == 'Full Breed':
                                    bg_image_desktop_width = 330
                                    bg_image_desktop_height = 330
                                    bg_image_mobile_width = 296
                                    bg_image_mobile_height = 352
                                    if card_number == '3 Card':
                                        bg_image_desktop_width = 448
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                    if (card_number == '5 Card (1-2-2)' and card_list == 'Left') or (
                                            card_number == '5 Card (2-1-2)' and card_list == 'Center') or (
                                            card_number == '5 Card (2-2-1)' and card_list == 'Right'):
                                        bg_image_desktop_width = 684
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                    if card_number == '6 Card':
                                        bg_image_desktop_width = 448
                                        bg_image_desktop_height = 330
                                        bg_image_mobile_width = 296
                                        bg_image_mobile_height = 352
                                    if (card_number == '7 Card (2-2-2-1)' and card_list == 'Right') or (
                                            card_number == '7 Card (2-2-1-2)' and card_list == 'Center Right') or (
                                            card_number == '7 Card (2-1-2-2)' and card_list == 'Center Left') or (
                                            card_number == '7 Card (1-2-2-2)' and card_list == 'Left'):
                                        bg_image_desktop_width = 330
                                        bg_image_desktop_height = 684
                                        bg_image_mobile_width = 624
                                        bg_image_mobile_height = 352
                                if card_type == 'Full Breed':
                                    bg_image_desktop_width = 160
                                    bg_image_desktop_height = 160
                                    bg_image_mobile_width = 192
                                    bg_image_mobile_height = 192
                                    if card_number == '3 Card':
                                        bg_image_desktop_width = 376
                                        bg_image_desktop_height = 376
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264
                                    if (card_number == '5 Card (1-2-2)' and card_list == 'Left') or (
                                            card_number == '5 Card (2-1-2)' and card_list == 'Center') or (
                                            card_number == '5 Card (2-2-1)' and card_list == 'Right'):
                                        bg_image_desktop_width = 376
                                        bg_image_desktop_height = 376
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264
                                    if (card_number == '7 Card (2-2-2-1)' and card_list == 'Right') or (
                                            card_number == '7 Card (2-2-1-2)' and card_list == 'Center Right') or (
                                            card_number == '7 Card (2-1-2-2)' and card_list == 'Center Left') or (
                                            card_number == '7 Card (1-2-2-2)' and card_list == 'Left'):
                                        bg_image_desktop_width = 282
                                        bg_image_desktop_height = 282
                                        bg_image_mobile_width = 264
                                        bg_image_mobile_height = 264

                                if " " in card_list:
                                    card_size = "Small"
                                else:
                                    card_size = "Large"

                                # Headline Text PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Headline Text Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Description PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # Description Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # CTA
                                cell_ctas = process_label_cta(content_comp_div, "N", "span.cta")
                                cta_no = 0
                                for cell_value, cell_check, cell_remarks in cell_ctas :
                                    cta_no += 1
                                    excel_save_data(exl_ws,
                                        col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Label ' + str(cta_no),
                                        cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                                # BG Image
                                img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(card_compo_detail, "div.showcase-card-tab-card__img-wrap")
                                # BG Image > Desktop
                                cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Desktop',
                                    img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, dev_status)

                                # BG Image > Mobile
                                cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Mobile',
                                    img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, dev_status)

                #Component: FT03_Feature Full Bleed
                if 'pd-g-feature-benefit-full-bleed' in content_comp_name:

                    ft03_components = content_comp_div.select('section > div.st-feature-benefit-full-bleed__wrap')
                    ft03_compo_width = content_comp_div.find('section').get('class', [])
                    if 'st-feature-benefit-full-bleed--width-1920' in ft03_compo_width:
                        bg_image_desktop_width = 1920
                        bg_image_desktop_height = 0
                    else:
                        bg_image_desktop_width = 1440
                        bg_image_desktop_height = 0

                    if 'st-feature-benefit-full-bleed--image-radius' in ft03_compo_width:
                        bg_image_mobile_width = 624
                        bg_image_mobile_height = 0
                    else:
                        bg_image_mobile_width = 720
                        bg_image_mobile_height = 0
                    ft03_no = 0
                    for ft03_component in ft03_components :
                        ft03_no += 1

                        # Headline Text All
                        cell_value = process_label_text(ft03_component, "div > div > div.st-feature-benefit-full-bleed__content-area", "H", "st-feature-benefit-full-bleed__title")
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            'Banner', 'Column ' + str(ft03_no), 'Headline Text', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # Sub Headline Text All
                        cell_value = process_label_text(ft03_component, "div > div > div.st-feature-benefit-full-bleed__content-area", "H", "st-feature-benefit-full-bleed__sub-title")
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            'Banner', 'Column ' + str(ft03_no), 'Sub Headline Text', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # Description Text All
                        cell_value = process_label_text(ft03_component, "div > div > div.st-feature-benefit-full-bleed__content-area", "p", "st-feature-benefit-full-bleed__text")
                        cell_check, cell_remarks = '', ''
                        excel_save_data(exl_ws,
                            'Banner', 'Column ' + str(ft03_no), 'Description', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # CTA
                        cell_ctas = process_cta_buttons(ft03_component, "div > div > div > div.st-feature-benefit-full-bleed__cta")
                        cta_no = 0
                        for cell_value, cell_check, cell_remarks in cell_ctas :
                            cta_no += 1
                            excel_save_data(exl_ws,
                                "Banner", "Column", "CTA", 'Label ' + str(cta_no),
                                cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(ft03_component, "figure.st-feature-benefit-full-bleed__figure")

                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "Banner", "Column" , "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, dev_status)

                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "Banner",  "Column", "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, dev_status)

                #Component: CO07_Key Feature Tab
                if 'ho-g-key-feature-tab' in content_comp_name:
                    col_location = process_label_text(content_comp_div, "section > div.key-feature-tab__contents > div.key-feature-tab__header-wrap", "H", "key-feature-tab__title")
                    bg_image_desktop_width = 1440
                    bg_image_desktop_height = 810
                    bg_image_mobile_width = 720
                    bg_image_mobile_height = 1280
                    comp_tab_no = 0
                    for comp_co07_tab in content_comp_div.select('section > div.key-feature-tab__contents > div.key-feature-tab__header-wrap > div > ul > li'):
                        comp_co07_contents = content_comp_div.select('section > div.key-feature-tab__contents > div.key-feature-tab__container > div > div.key-feature-tab__slide')[comp_tab_no]
                        comp_tab_no += 1
                        col_area = process_label_text(comp_co07_tab, "N", "button", "tab__item-title")
                        col_area = re.sub(r'<span class="tab__item-line"></span>', '', col_area)
                        col_area = html.unescape(col_area)

                        # Headline Text All
                        cell_value = process_label_text(comp_co07_contents, "div > div.key-feature-tab__inner-wrap > div.key-feature-tab__text-wrap", "H", "key-feature-tab__headline")
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            col_location, col_area, 'Headline Text', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # Description All
                        cell_value = process_label_text(comp_co07_contents, "div > div.key-feature-tab__inner-wrap > div.key-feature-tab__text-wrap", "p", "key-feature-tab__desc")
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            col_location, col_area, 'Description', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # CTA
                        cell_ctas = process_cta_buttons(comp_co07_contents, "div > div.key-feature-tab__inner-wrap > div.key-feature-tab__cta-wrap")
                        cta_no = 0
                        for cell_value, cell_check, cell_remarks in cell_ctas :
                            cta_no += 1
                            excel_save_data(exl_ws,
                                col_location, col_area, "CTA", 'Label ' + str(cta_no),
                                cell_value, cell_check, cell_remarks, '', raw_data_meta, dev_status)

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(comp_co07_contents, "div > div.key-feature-tab__background-wrap > div")
                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            col_location, col_area, "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, dev_status)

                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            col_location, col_area, "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, dev_status)



            excel_end(exl_ws, exl_wb, start_time, url, img_html)

        except Exception as e:

            file_name_base = url.replace('https://www.samsung.com/', '').replace('/', '-')
            file_name_base = file_name_base.strip('-')
            today = datetime.now().strftime("%Y%m%d")
            path = "./result/" + today + "/error"
            os.makedirs(path, exist_ok=True)
            current_time = datetime.now().strftime("%Y%m%d%H%M%S")
            final_file_name = f"{path}/{file_name_base}_error_{current_time}.txt"

            end_time = datetime.now()
            time_elapsed = end_time - start_time

            f = open(final_file_name, "w")

            error_log = f"{e}, \n ERROR :, {url}, at : {end_time} ({time_elapsed})"
            f.write(error_log)
            f.close()

            print("ERROR :", url, 'at : ', end_time.strftime("%Y/%m/%d %H:%M:%S"), "(", time_elapsed, ")")
            print(traceback.format_exc())
    pass