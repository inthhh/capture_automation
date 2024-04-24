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





def component_qa(url_code, page_codes, mod_status, setting_img_check_size, setting_img_check_bgcolor, setting_img_check_logo):
    for page_code in page_codes:
        db_conn = Database(mod_status) if mod_status != "dev" else "none"
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

                # key 값의 comp order number를 위한 dictionary
                component_counter = {
                    "HD01": 0,
                    "CO02": 0,
                    "CO05": 0,
                    "FT03": 0,
                    "CO07": 0,
                    "CO16": 0
                }

                #Component: HD01_Home KV Carousel
                if 'ho-g-home-kv-carousel' in content_comp_name:
                    component_counter["HD01"] += 1
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
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"], "HD01", component_counter["HD01"],
                                                 "KV" + str(carousel_no), "Headline Text",'Desktop')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Headline Text",'Desktop',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value
                        )

                        img_title = cell_value

                        # Headline Text Mobile
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "H", "home-kv-carousel__headline", "data-mobile-headline-text"
                            )
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"], "HD01",
                                                    component_counter["HD01"],
                                                    "KV" + str(carousel_no), "Headline Text", 'Mobile')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Headline Text", 'Mobile',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value
                        )

                        # Description Text PC
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "p", "home-kv-carousel__desc", "data-desktop-description"
                            )
                        cell_check, cell_remarks = '', ''
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"], "HD01",
                                                    component_counter["HD01"],
                                                    "KV" + str(carousel_no), "Description", 'PC')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Description Text", 'Desktop',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value
                        )

                        # Description Text Mobile
                        cell_value = process_attributes_value(
                            content_carousel_div,
                            "div > div.home-kv-carousel__text-wrap", "p", "home-kv-carousel__desc", "data-mobile-description"
                            )
                        cell_check, cell_remarks = '', ''
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"], "HD01",
                                                    component_counter["HD01"],
                                                    "KV" + str(carousel_no), "Description", 'Mobile')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "Description Text", 'Mobile',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value
                        )

                        # CTA
                        cell_ctas = process_cta_buttons(content_comp_div, "div > div.home-kv-carousel__text-wrap > div.home-kv-carousel__cta-wrap")
                        if cell_ctas :
                            cta_no = 0
                            for cell_value, cell_check, cell_remarks in cell_ctas:
                                cta_no += 1
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "HD01",
                                                            component_counter["HD01"],
                                                            "KV" + str(carousel_no), "CTA", 'Label ' + str(cta_no))
                                excel_save_data(exl_ws,
                                    "KeyVisual", "KV" + str(carousel_no), "CTA", 'Label ' + str(cta_no),
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value
                                )

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(content_carousel_div, "div > div.home-kv-carousel__background-media-wrap")

                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],"HD01",
                                                    component_counter["HD01"], "KV" + str(carousel_no), "BG Image", 'Desktop')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, mod_status, db_conn, key_id_value)
                        if img_desktop_url :
                            img_html, id_no = img_save(img_desktop_url, img_desktop, url_code, 'PC Image' + img_title, cell_check, img_html, id_no)
                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"], "HD01",
                                                    component_counter["HD01"], "KV" + str(carousel_no), "BG Image",
                                                    'Mobile')
                        excel_save_data(exl_ws,
                            "KeyVisual", "KV" + str(carousel_no), "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, mod_status, db_conn, key_id_value)
                        if img_mobile_url:
                            img_html, id_no = img_save(img_mobile_url, img_mobile, url_code, 'Mobile Image' + img_title, cell_check, img_html, id_no)

                #Component: CO02_Text Block Container + CO05_Showcase Card Tab
                if 'cm-g-text-block-container' in content_comp_name and content_comp_div.select('div > div.ho-g-showcase-card-tab'):
                    component_counter["CO05"] += 1
                    col_location = process_label_text(content_comp_div, "section > div > div", "H", "text-block-container__headline")
                    for content_comp_co05 in content_comp_div.select('div.showcase-card-tab'):
                        tab_no = 0
                        for comp_co05_tab in content_comp_co05.select('div > ul.tab__list > li') :
                            tab_no += 1
                            cell_area = process_label_text(comp_co05_tab, "N", "button", "tab__item-title")
                            cell_area = re.sub(r'<span class="tab__item-line"></span>', '', cell_area)
                            cell_area = html.unescape(cell_area)
                            tab_name_key_value = process_tab_name_attribute_to_key(comp_co05_tab)
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

                            # Grid 타일 모양 가이드 적용
                            if card_layout_option != 'LSSSS' and card_layout_option != 'LLL':
                                grid_remarks = "Guide: CO05 can allow only '5 tiles(1-2-2)' or 3 tiles(1-1-1) Grid style"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Tile", "Tile Layout", tab_name_key_value)
                                excel_save_data(exl_ws,col_location, cell_area,'Tile', 'Tile Layout','',
                                                'N', grid_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                            # 사용가능한 Grid 타일을 사용했을 때,
                            else:
                                badge_cnt = process_count_badge(comp_co05_layout)
                                grid_remarks = ""
                                if card_layout_option == 'LSSSS' and badge_cnt > 2:
                                    grid_remarks = "Guide: 5 tiles(1-2-2) grid system can use badge up to 2"
                                elif card_layout_option == 'LLL' and badge_cnt > 1:
                                    grid_remarks = "Guide: 3 tiles(1-1-1) grid system can use badge up to 1"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Tile", "Badge Count", tab_name_key_value)
                                excel_save_data(exl_ws, col_location, cell_area, 'Tile', 'Badge Count', badge_cnt,
                                                'N', grid_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                            for x in options.keys():
                                if x == card_layout_option:
                                    card_number = options[x][0]
                                    card_layout = options[x][1]

                            card_list_no = 0
                            for card_list in card_layout :
                                card_list_no += 1

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

                                # Badge
                                cell_value = process_label_text(card_compo_detail, "N", "span", "badge-icon")
                                # When a Badge Exists
                                if cell_value:
                                    badge_color = process_badge_color(card_compo_detail)
                                    cell_check, cell_remarks = process_badge_text(cell_value, badge_color)
                                    key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                                "CO05", component_counter["CO05"],
                                                                "", "Badge", "Badge", tab_name_key_value, card_list_no)
                                    excel_save_data(exl_ws,col_location,cell_area + " | " + card_list + "(" + card_size + ")",'Badge', 'Badge',
                                                    cell_value, cell_check, cell_remarks, '', raw_data_meta,mod_status, db_conn, key_id_value)


                                # Title PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Title", "Desktop", tab_name_key_value, card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Title Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Title", "Mobile", tab_name_key_value, card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Description PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--desktop")
                                # cell_check, cell_remarks = qa_check_text(cell_value)
                                cell_check, cell_remarks = '', ''
                                if card_size == 'Small' and cell_value:
                                    cell_check = 'N'
                                    cell_remarks = "Guide: Small Tile's Description must be empty"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Description", "Desktop", tab_name_key_value, card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Description Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--mobile")
                                # cell_check, cell_remarks = qa_check_text(cell_value)
                                cell_check, cell_remarks = '', ''
                                if card_size == 'Small' and cell_value:
                                    cell_check = 'N'
                                    cell_remarks = "Guide: Small Tile's Description must be empty"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Description", "Mobile", tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # CTA
                                cell_ctas = process_label_cta(card_compo_detail, "div > a > div.showcase-card-tab-card__product-cta", "span")

                                cta_no = 0
                                for cell_value, cell_check, cell_remarks in cell_ctas :
                                    cta_no += 1
                                    key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                                "CO05", component_counter["CO05"],
                                                                "", "CTA", 'Label ' + str(cta_no), tab_name_key_value,
                                                                card_list_no)
                                    excel_save_data(exl_ws,
                                        col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'CTA', 'Label ' + str(cta_no),
                                        cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # BG Image
                                img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(card_compo_detail, "div.showcase-card-tab-card__img-wrap")
                                # BG Image > Desktop
                                cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "BG Image", 'Desktop', tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Desktop',
                                    img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, mod_status, db_conn, key_id_value)

                                # BG Image > Mobile
                                cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "BG Image", 'Mobile', tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Mobile',
                                    img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, mod_status, db_conn, key_id_value)

                #Component: CO05_Showcase Card Tab
                if 'ho-g-showcase-card-tab' in content_comp_name:
                    component_counter["CO05"] += 1
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
                            tab_name_key_value = process_tab_name_attribute_to_key(comp_co05_tab)
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

                            # Grid 타일 모양 가이드 적용
                            if card_layout_option != 'LSSSS' and card_layout_option != 'LLL':
                                grid_remarks = "Guide: CO05 can allow only '5 tiles(1-2-2)' or 3 tiles(1-1-1) Grid style"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Tile", "Tile Layout", tab_name_key_value)
                                excel_save_data(exl_ws, col_location, cell_area, 'Tile', 'Tile Layout', '',
                                                'N', grid_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                            # 사용가능한 Grid 타일을 사용했을 때,
                            else:
                                badge_cnt = process_count_badge(comp_co05_layout)
                                grid_remarks = ""
                                if card_layout_option == 'LSSSS' and badge_cnt > 2:
                                    grid_remarks = "Guide: 5 tiles(1-2-2) grid system can use badge up to 2"
                                elif card_layout_option == 'LLL' and badge_cnt > 1:
                                    grid_remarks = "Guide: 3 tiles(1-1-1) grid system can use badge up to 1"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Tile", "Badge Count", tab_name_key_value)
                                excel_save_data(exl_ws, col_location, cell_area, 'Tile', 'Badge Count', badge_cnt,
                                                'N', grid_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                            for x in options.keys():
                                if x == card_layout_option:
                                    card_number = options[x][0]
                                    card_layout = options[x][1]

                            card_list_no = 0
                            for card_list in card_layout :
                                card_list_no += 1

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

                                # Badge
                                cell_value = process_label_text(card_compo_detail, "N", "span", "badge-icon")
                                # When a Badge Exists
                                if cell_value:
                                    badge_color = process_badge_color(card_compo_detail)
                                    cell_check, cell_remarks = process_badge_text(cell_value, badge_color)
                                    key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                                "CO05", component_counter["CO05"],
                                                                "", "Badge", "Badge", tab_name_key_value, card_list_no)
                                    excel_save_data(exl_ws, col_location,
                                                    cell_area + " | " + card_list + "(" + card_size + ")", 'Badge',
                                                    'Badge',
                                                    cell_value, cell_check, cell_remarks, '', raw_data_meta,
                                                    mod_status, db_conn, key_id_value)

                                # Title PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--desktop")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Title", "Desktop", tab_name_key_value, card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Title Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-name--mobile")
                                cell_check, cell_remarks = qa_check_text(cell_value)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Title", "Mobile", tab_name_key_value, card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Title', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Description PC
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--desktop")
                                # cell_check, cell_remarks = qa_check_text(cell_value)
                                cell_check, cell_remarks = '', ''
                                if card_size == 'Small' and cell_value:
                                    cell_check = 'N'
                                    cell_remarks = "Guide: Small Tile's Description must be empty"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Description", "Desktop", tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Desktop',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # Description Mobile
                                cell_value = process_label_text(card_compo_detail, "N", "span", "showcase-card-tab-card__product-description--mobile")
                                # cell_check, cell_remarks = qa_check_text(cell_value)
                                cell_check, cell_remarks = '', ''
                                if card_size == 'Small' and cell_value:
                                    cell_check = 'N'
                                    cell_remarks = "Guide: Small Tile's Description must be empty"
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "Description", "Mobile", tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Mobile',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # CTA
                                cell_ctas = process_label_cta(card_compo_detail,"div > a > div.showcase-card-tab-card__product-cta","span")
                                cta_no = 0
                                for cell_value, cell_check, cell_remarks in cell_ctas :
                                    cta_no += 1
                                    key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                                "CO05", component_counter["CO05"],
                                                                "", "CTA", 'Label ' + str(cta_no), tab_name_key_value,
                                                                card_list_no)
                                    excel_save_data(exl_ws,
                                        col_location, cell_area + " | " + card_list + "(" + card_size + ")", 'Description', 'Label ' + str(cta_no),
                                        cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn, key_id_value)

                                # BG Image
                                img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(card_compo_detail, "div.showcase-card-tab-card__img-wrap")
                                # BG Image > Desktop
                                cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "BG Image", 'Desktop', tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Desktop',
                                    img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, mod_status, db_conn, key_id_value)

                                # BG Image > Mobile
                                cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                                cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                                cell_remarks_bgcolor = qa_check_img_bgcolor(img_desktop_url, img_desktop, setting_img_check_bgcolor)
                                cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                                key_id_value = key_id_maker(raw_data_meta["site_code"], raw_data_meta["page_type"],
                                                            "CO05", component_counter["CO05"],
                                                            "", "BG Image", 'Mobile', tab_name_key_value,
                                                            card_list_no)
                                excel_save_data(exl_ws,
                                    col_location, cell_area + " | " + card_list + "(" + card_size + ")", "BG Image", 'Mobile',
                                    img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, mod_status, db_conn, key_id_value)

                #Component: FT03_Feature Full Bleed
                if 'pd-g-feature-benefit-full-bleed' in content_comp_name:
                    component_counter["FT03"] += 1

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
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # Sub Headline Text All
                        cell_value = process_label_text(ft03_component, "div > div > div.st-feature-benefit-full-bleed__content-area", "H", "st-feature-benefit-full-bleed__sub-title")
                        cell_check, cell_remarks = qa_check_text(cell_value)
                        excel_save_data(exl_ws,
                            'Banner', 'Column ' + str(ft03_no), 'Sub Headline Text', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # Description Text All
                        cell_value = process_label_text(ft03_component, "div > div > div.st-feature-benefit-full-bleed__content-area", "p", "st-feature-benefit-full-bleed__text")
                        cell_check, cell_remarks = '', ''
                        excel_save_data(exl_ws,
                            'Banner', 'Column ' + str(ft03_no), 'Description', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # CTA
                        cell_ctas = process_cta_buttons(ft03_component, "div > div > div > div.st-feature-benefit-full-bleed__cta")
                        if cell_ctas:
                            cta_no = 0
                            for cell_value, cell_check, cell_remarks in cell_ctas :
                                cta_no += 1
                                excel_save_data(exl_ws,
                                    "Banner", "Column", "CTA", 'Label ' + str(cta_no),
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(ft03_component, "figure.st-feature-benefit-full-bleed__figure")

                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "Banner", "Column" , "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, mod_status, db_conn)

                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            "Banner",  "Column", "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, mod_status, db_conn)

                #Component: CO07_Key Feature Tab
                if 'ho-g-key-feature-tab' in content_comp_name:
                    component_counter["CO07"] += 1
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
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # Description All
                        cell_value = process_label_text(comp_co07_contents, "div > div.key-feature-tab__inner-wrap > div.key-feature-tab__text-wrap", "p", "key-feature-tab__desc")
                        # cell_check, cell_remarks = qa_check_text(cell_value)
                        cell_check, cell_remarks = '', ''
                        excel_save_data(exl_ws,
                            col_location, col_area, 'Description', 'All',
                            cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # CTA
                        cell_ctas = process_cta_buttons(comp_co07_contents, "div > div.key-feature-tab__inner-wrap > div.key-feature-tab__cta-wrap")
                        if cell_ctas:
                            cta_no = 0
                            for cell_value, cell_check, cell_remarks in cell_ctas :
                                cta_no += 1
                                excel_save_data(exl_ws,
                                    col_location, col_area, "CTA", 'Label ' + str(cta_no),
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status, db_conn)

                        # BG Image
                        img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(comp_co07_contents, "div > div.key-feature-tab__background-wrap > div")
                        # AEM에서 Background Contents Type = None 으로 설정 시, class명이 기존과 다름에 따른 분기 처리
                        if img_desktop_url == "Component doesn't exist." and img_desktop is None and img_mobile_url is None and img_mobile is None:
                            img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(comp_co07_contents, "div > div.key-feature-tab__media-wrap > div")

                        # BG Image > Desktop
                        cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width, bg_image_desktop_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            col_location, col_area, "BG Image", 'Desktop',
                            img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta, mod_status, db_conn)

                        # BG Image > Mobile
                        cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width, bg_image_mobile_height, setting_img_check_size)
                        cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                        cell_remarks_bgcolor = 'Pass'
                        cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor)
                        excel_save_data(exl_ws,
                            col_location, col_area, "BG Image", 'Mobile',
                            img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta, mod_status, db_conn)

                # Component: CO16_Discover Column
                if 'cm-g-discover-column-new' in content_comp_name:
                    component_counter["CO16"] += 1

                    if component_num >= 2:
                        content_comp_name_previous = content_all[component_num - 2].get('class', [])
                        if 'cm-g-text-block' in content_comp_name_previous:
                            col_location = process_label_text(content_all[component_num - 2],
                                                              "div > div.textblock__body", "H",
                                                              "textblock__title")
                        elif component_num >= 3 and 'cm-g-text-block' in content_all[component_num - 3].get(
                                'class',
                                []):
                            col_location = process_label_text(content_all[component_num - 3],
                                                              "div > div.textblock__body", "H",
                                                              "textblock__title")
                        elif 'cm-g-discover-column-new' not in content_comp_name_previous:
                            col_location = 'Category'
                    else:
                        col_location = 'Category'
                        co16_components = content_comp_div.select(
                            'section > div > div > div.co16-discover-column-new__columns-item')

                    bg_image_desktop_width = 568
                    bg_image_desktop_height = 320
                    bg_image_mobile_width = 512
                    bg_image_mobile_height = 288

                    co16_no = 0
                    for co16_component in co16_components:
                        co16_no += 1

                    # Headline Text All
                    cell_value = process_label_text(co16_component,
                                                    "div.co16-discover-column-new__content > div.co16-discover-column-new__headline-wrapper",
                                                    "H", "co16-discover-column-new__headline")
                    cell_check, cell_remarks = qa_check_text(cell_value)
                    excel_save_data(exl_ws,
                                    col_location, 'Column ' + str(co16_no), 'Headline Text', 'All',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status,
                                    db_conn)
                    img_title = cell_value

                    # Description Text All
                    cell_value = process_label_text(co16_component,
                                                    "div.co16-discover-column-new__content > div.co16-discover-column-new__description-wrapper",
                                                    "p", "co16-discover-column-new__description")
                    cell_check, cell_remarks = '', ''
                    excel_save_data(exl_ws,
                                    col_location, 'Column ' + str(co16_no), 'Headline Text', 'All',
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status,
                                    db_conn)

                    # CTA
                    cell_ctas = process_cta_buttons(co16_component,
                                                    "div.co16-discover-column-new__content > div.co16-discover-column-new__cta-wrapper")
                    cta_no = 0
                    for cell_value, cell_check, cell_remarks in cell_ctas:
                        cta_no += 1
                    excel_save_data(exl_ws,
                                    col_location, 'Column ' + str(co16_no), "CTA", 'Label ' + str(cta_no),
                                    cell_value, cell_check, cell_remarks, '', raw_data_meta, mod_status,
                                    db_conn)

                    # BG Image
                    img_desktop_url, img_desktop, img_mobile_url, img_mobile = process_background_image(
                        co16_component,
                        "div.co16-discover-column-new__image > div")
                    # BG Image > Desktop
                    cell_remarks_size = qa_check_img_size(img_desktop, bg_image_desktop_width,
                                                          bg_image_desktop_height,
                                                          setting_img_check_size)
                    cell_remarks_logo = qa_check_img_logo(img_desktop_url, img_desktop, setting_img_check_logo)
                    cell_remarks_bgcolor = 'Pass'
                    cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo,
                                                         cell_remarks_bgcolor)
                    excel_save_data(exl_ws,
                                    col_location, 'Column ' + str(co16_no), "BG Image", 'Desktop',
                                    img_desktop_url, cell_check, cell_remarks, img_desktop, raw_data_meta,
                                    mod_status, db_conn)
                    img_html, id_no = img_save(img_desktop_url, img_desktop, url_code,
                                               'PC Image : ' + img_title,
                                               cell_check, img_html,
                                               id_no)
                    # BG Image > Mobile
                    cell_remarks_size = qa_check_img_size(img_mobile, bg_image_mobile_width,
                                                          bg_image_mobile_height,
                                                          setting_img_check_size)
                    cell_remarks_logo = qa_check_img_logo(img_mobile_url, img_mobile, setting_img_check_logo)
                    cell_remarks_bgcolor = 'Pass'
                    cell_check, cell_remarks = img_check(cell_remarks_size, cell_remarks_logo,
                                                         cell_remarks_bgcolor)
                    excel_save_data(exl_ws,
                                    col_location, 'Column ' + str(co16_no), "BG Image", 'Mobile',
                                    img_mobile_url, cell_check, cell_remarks, img_mobile, raw_data_meta,
                                    mod_status,
                                    db_conn)
                    img_html, id_no = img_save(img_mobile_url, img_mobile, url_code,
                                               'Mobile Image : ' + img_title,
                                               cell_check, img_html,
                                               id_no)


            excel_end(exl_ws, exl_wb, start_time, url, img_html)
            if mod_status != "dev":
                db_conn.commit_connection()
                db_conn.close_connection()

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

            error_log = f"{traceback.format_exc()}, \n ERROR :, {url}, at : {end_time} ({time_elapsed})"
            f.write(error_log)
            f.close()
            
            # insert한 db 롤백
            if mod_status != "dev" :
                db_conn.rollback_connection()
                db_conn.close_connection()

            print("ERROR :", url, 'at : ', end_time.strftime("%Y/%m/%d %H:%M:%S"), "(", time_elapsed, ")")
            print(traceback.format_exc())
    pass