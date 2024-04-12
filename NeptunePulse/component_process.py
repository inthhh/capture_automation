import requests
from PIL import Image as PILImage
from io import BytesIO
from utilities import *
# from data_management import *
import re
import html
from datetime import datetime
import json

def process_class_attributes(content_comp_div, data_selector, data_tag, data_option, data_option_none):

    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    cell_none_txt = 'None' if data_option_none == 'N' else data_option_none
    first_div = selected_component.find(data_tag) if data_tag != 'N' else selected_component

    set_class_name = set(data_option.keys())
    set_class_value = set(first_div.get('class', []))  # 클래스가 없는 경우를 대비해 기본값 설정
    intersection = set_class_name & set_class_value

    cell_value = data_option[next(iter(intersection))] if intersection else cell_none_txt

    return cell_value

def process_attributes_value(content_comp_div, data_selector, data_tag, data_class, data_attr_value):

    try :
        selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    except Exception as e :
        selected_component = None

    if selected_component is None :
        cell_value = ''
    else :
        data_tag_setting = data_tag
        if data_tag == 'H' :
            for i in range(1, 7) :
                h_tag = selected_component.select_one(f'h{i}.{data_class}')
                if h_tag :
                    data_tag_setting = f'h{i}'
                    break

        data_attr = selected_component.find(data_tag_setting, class_=data_class)
        cell_value = data_attr.get(data_attr_value, 'None') if data_attr else 'None'
    return cell_value

def process_cta_buttons(content_comp_div, data_selector):
    # 20240412 cta가 없는경우
    if not len(content_comp_div.select(data_selector)) :
        return False
    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    a_tags = selected_component.find_all('a')
    btn_theme = {'cta--underline' : 'Underline', 'cta--outlined' : 'Outline', 'cta--contained' : 'Contained'}
    btn_color = {'cta--white' : 'White', 'cta--black' : 'Black', 'cta--emphasis' : 'Emphasis'}
    cell_ctas = []
    for a_tag in a_tags :
        class_attr = a_tag.get('class', [])
        class_theme = next((btn_theme[cls] for cls in class_attr if cls in btn_theme), None)
        class_color = next((btn_color[cls] for cls in class_attr if cls in btn_color), None)
        href = a_tag.get('href', 'None')
        aria_label = a_tag.get('aria-label', 'None')
        an_la = a_tag.get('an-la', 'None')
        button_label = a_tag.text.strip()

        if len(button_label) >= 25:
            except_svg = button_label.split("<svg")
            button_label = button_label if len(except_svg[0].strip()) >= 25 else except_svg[0].strip()
            cell_check = 'N' if len(except_svg[0].strip()) >= 25 else "Y"
            cell_remarks = 'Guide: Less than 25 characters' if len(except_svg[0].strip()) >= 25 else "Pass"
        else :
            cell_check = 'Y'
            cell_remarks = 'Pass'

        cell_ctas.append((button_label, cell_check, cell_remarks))
    return cell_ctas

def process_label_cta(content_comp_div, data_selector, data_tag):
    start_time = datetime.now()
    try:
        selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
        text_tags = selected_component.find_all(data_tag)
        cell_ctas = []
        for text_tag in text_tags:
            if text_tag:
                cell_value = text_tag.decode_contents().strip()
                if len(cell_value) >= 25 :
                    except_svg = cell_value.split("<svg")
                    cell_value = cell_value if len(except_svg[0].strip()) >= 25 else except_svg[0].strip()
                    cell_check = 'N' if len(except_svg[0].strip()) >= 25 else "Y"
                    cell_remarks = 'Guide: Less than 25 characters' if len(except_svg[0].strip()) >= 25 else "Pass"
                else :
                    cell_check = 'Y'
                    cell_remarks = 'Pass'
            else:
                cell_value = ''
            cell_ctas.append((cell_value, cell_check, cell_remarks))

    except IndexError:
        cell_value = ''

    return cell_ctas

def process_background_image(content_comp_div, data_selector):

    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]

    img_tag = selected_component.select_one('img.image-v2__preview, img.image__preview')
    if img_tag:
        data_mobile_src = img_tag.get('data-mobile-src', 'None')
        data_desktop_src = img_tag.get('data-desktop-src', 'None')
        desktop_image_meta = []
        # image_url = 'https:' + data_desktop_src.split('?')[0]

        img_desktop_url = 'https:' + data_desktop_src.split('?')[0]
        img_mobile_url = 'https:' + data_mobile_src.split('?')[0]

        # Desktop Image
        response_desktop = requests.get(img_desktop_url)
        if response_desktop.status_code != 200:
            return None
        image_bytes = BytesIO(response_desktop.content)
        img_desktop = PILImage.open(image_bytes)

        # Mobile Image
        response_mobile = requests.get(img_mobile_url)
        if response_mobile.status_code != 200:
            return None
        image_bytes = BytesIO(response_mobile.content)
        img_mobile = PILImage.open(image_bytes)

    figure = selected_component.find('figure', class_='first-image')
    if figure:
        sources = figure.find_all('source')
        for source in sources:
            media_query = source.get('media')
            srcsets = source.get('srcset', '').split(', ')
            first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
            base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
            if "(min-width:1366px)" in media_query:
                img_desktop_url = 'https:' + base_url.split('?')[0]
                response_desktop = requests.get(img_desktop_url)
                if response_desktop.status_code != 200:
                    return None
                image_bytes = BytesIO(response_desktop.content)
                img_desktop = PILImage.open(image_bytes)

            if "(max-width:767px)" in media_query:
                img_mobile_url = 'https:' + base_url.split('?')[0]
                response_mobile = requests.get(img_mobile_url)
                if response_mobile.status_code != 200 :
                    return None
                image_bytes = BytesIO(response_mobile.content)
                img_mobile = PILImage.open(image_bytes)
    
    # 이미지가 아예 없으면
    if img_tag is None and figure is None:
        return None, None, None, None

    return img_desktop_url, img_desktop, img_mobile_url, img_mobile

def process_label_text(content_comp_div, data_selector, data_tag, data_class):
    try:
        selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    except Exception as e:
        selected_component = None

    if selected_component is None:
        cell_value = ''
        return  cell_value
    else:
        if data_class != 'N':
            data_tag_setting = f'{data_tag}.{data_class}'
        else:
            data_tag_setting = f'{data_tag}'
        if data_tag == 'H':
            for i in range(1, 7):
                if data_class != 'N':
                    h_tag = selected_component.select_one(f'h{i}.{data_class}')
                else:
                    h_tag = selected_component.select_one(f'h{i}')
                if h_tag:
                    data_tag_setting = f'h{i}'
                    break
        text_tag = selected_component.select_one(data_tag_setting)
        if text_tag:
            cell_value = text_tag.decode_contents().strip()
        else:
            cell_value = ''
    return cell_value