from utilities import *
from data_management import *
import re
import html
from datetime import datetime


def process_class_attributes(exl_ws, content_comp_div, col_location, col_area, col_title, col_description, data_selector, data_tag, data_option, data_option_none, data_print, raw_data_meta):
    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    cell_none_txt = format_none_value(data_option_none)
    first_div = selected_component.find(data_tag) if data_tag != 'N' else selected_component

    set_class_name = set(data_option.keys())
    set_class_value = set(first_div.get('class', []))  # 클래스가 없는 경우를 대비해 기본값 설정
    intersection = set_class_name & set_class_value

    cell_value = data_option[next(iter(intersection))] if intersection else cell_none_txt
    if data_print == 'Y':
        add_data_to_list(exl_ws, col_location, col_area, col_title, col_description, cell_value, '','',raw_data_meta)
    return cell_value


def process_attributes_value(exl_ws, content_comp_div, col_location, col_area, col_title, col_description, data_selector, data_tag, data_class, data_attr_value, check_guide, data_print, raw_data_meta):
    exception_words = ["SAMSUNG", "QLED", "OLED", "BESPOKE"]
    try:
        selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    except Exception as e:
        selected_component = None

    if selected_component is None:
        cell_value = ''
        return  cell_value
    else:

        data_tag_setting = data_tag
        if data_tag == 'H':
            for i in range(1, 7):
                h_tag = selected_component.select_one(f'h{i}.{data_class}')
                if h_tag:
                    data_tag_setting = f'h{i}'
                    break

        data_attr = selected_component.find(data_tag_setting, class_=data_class)
        cell_value = data_attr.get(data_attr_value, 'None') if data_attr else 'None'

        cell_remarks = ''
        cell_check = ''
        if check_guide == 'Y':
            if cell_value != '':
                cell_value_lower = cell_value.lower()

                cell_remark1 = "Pass"
                cell_remark2 = "Pass"
                cell_remark3 = "Pass"

                if "font-size" in cell_value_lower:
                    cell_remark1 = "Guide: Unable to change font size"
                if "font-color" in cell_value_lower:
                    cell_remark2 = "Guide: Unable to change font color"
                if "Font-family" in cell_value_lower:
                    cell_remark3 = "Guide: Unable to change fonts"

                cell_remark4 = "Pass"
                if "samsung" in cell_value_lower:
                    correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
                    if not correct_format:
                        cell_remark4 = "Guide: 'Samsung' must be consistently written"

                if '. ' in cell_value_lower or cell_value_lower.endswith('.'):
                    cell_remark5 = 'Guide: Check for the insertion of periods'
                else:
                    cell_remark5 = 'Pass'

                words_to_uppercase = cell_value.split()

                # Iran 의 CTA TEXT 시작과 끝에 추가된 LRM html entity code 제거를 위한 조건문
                words_to_uppercase[0] = words_to_uppercase[0][3:] if "LRM" in words_to_uppercase[0] else words_to_uppercase[0]
                words_to_uppercase[-1] = words_to_uppercase[-1][:-3] if "LRM" in words_to_uppercase[-1] else words_to_uppercase[-1]

                if any(word.isupper() and len(word) >= 4 for word in words_to_uppercase if
                       word not in exception_words and not any(char.isdigit() for char in word)):
                    cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."
                else:
                    cell_remark6 = "Pass"

                if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass":
                    cell_remarks = "Pass"
                    cell_check = "Y"
                else:
                    cell_check = "N"
                if cell_remark1 != "Pass":
                    cell_remarks = cell_remark1 + "\n"
                if cell_remark2 != "Pass":
                    cell_remarks += cell_remark2 + "\n"
                if cell_remark3 != "Pass":
                    cell_remarks += cell_remark3 + "\n"
                if cell_remark4 != "Pass":
                    cell_remarks += cell_remark4 + "\n"
                if cell_remark5 != "Pass":
                    cell_remarks += cell_remark5 + "\n"
                if cell_remark6 != "Pass":
                    cell_remarks += cell_remark6

        if data_print == 'Y':
            add_data_to_list(exl_ws, col_location, col_area, col_title, col_description, cell_value, cell_check, cell_remarks,raw_data_meta)

        return cell_value

def process_label_text(exl_ws, content_comp_div, col_location, col_area, col_title, col_description, data_selector, data_tag, data_class, check_guide, data_print, raw_data_meta):
    exception_words = ["SAMSUNG","QLED", "OLED", "BESPOKE"]
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

        cell_remarks = ''
        cell_check = ''
        if check_guide == 'Y':
            if cell_value != '':
                cell_value_lower = cell_value.lower()

                cell_remark1 = "Pass"
                cell_remark2 = "Pass"
                cell_remark3 = "Pass"

                if "font-size" in cell_value_lower:
                    cell_remark1 = "Guide: Unable to change font size"
                if "font-color" in cell_value_lower:
                    cell_remark2 = "Guide: Unable to change font color"
                if "Font-family" in cell_value_lower:
                    cell_remark3 = "Guide: Unable to change fonts"

                cell_remark4 = "Pass"
                if "samsung" in cell_value_lower:
                    correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
                    if not correct_format:
                        cell_remark4 = "Guide: 'Samsung' must be consistently written"

                if '. ' in cell_value_lower or cell_value_lower.endswith('.'):
                    cell_remark5 = 'Guide: Check for the insertion of periods'
                else:
                    cell_remark5 = 'Pass'

                words_to_uppercase = cell_value.split()

                # Iran 의 CTA TEXT 시작과 끝에 추가된 html entity code 제거를 위한 조건문
                words_to_uppercase[0] = words_to_uppercase[0][1:] if "\u200e" in words_to_uppercase[0] else words_to_uppercase[0]
                words_to_uppercase[-1] = words_to_uppercase[-1][:-1] if "\u200e" in words_to_uppercase[-1] else words_to_uppercase[-1]

                if any(word.isupper() and len(word) >= 4 for word in words_to_uppercase if
                       word not in exception_words and not any(char.isdigit() for char in word)):

                    cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."
                    print(cell_remark6)
                else:
                    cell_remark6 = "Pass"

                if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass":
                    cell_remarks = "Pass"
                    cell_check = "Y"
                else:
                    cell_check = "N"
                if cell_remark1 != "Pass":
                    cell_remarks = cell_remark1 + "\n"
                if cell_remark2 != "Pass":
                    cell_remarks += cell_remark2 + "\n"
                if cell_remark3 != "Pass":
                    cell_remarks += cell_remark3 + "\n"
                if cell_remark4 != "Pass":
                    cell_remarks += cell_remark4 + "\n"
                if cell_remark5 != "Pass":
                    cell_remarks += cell_remark5 + "\n"
                if cell_remark6 != "Pass":
                    cell_remarks += cell_remark6

        if data_print == 'Y':
            add_data_to_list(exl_ws, col_location, col_area, col_title, col_description, cell_value, cell_check, cell_remarks,raw_data_meta)

    return html.unescape(re.sub(r'<.*?>', '', cell_value))



def process_cta_buttons(exl_ws, content_comp_div, col_location, col_area, col_title, data_selector, raw_data_meta):
    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
    a_tags = selected_component.find_all('a')
    btn_theme = {'cta--underline': 'Underline', 'cta--outlined': 'Outline', 'cta--contained': 'Contained'}
    btn_color = {'cta--white': 'White', 'cta--black': 'Black', 'cta--emphasis': 'Emphasis'}
    cta_no = 0
    for a_tag in a_tags:
        cta_no += 1
        class_attr = a_tag.get('class',[])
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
            cell_remark = 'Guide: Less than 25 characters' if len(except_svg[0].strip()) >= 25 else "Pass"
        else:
            cell_check = 'Y'
            cell_remark = 'Pass'

        add_data_to_list(exl_ws, col_location, col_area, col_title, 'Label ' + str(cta_no), button_label, cell_check, cell_remark,raw_data_meta)

def process_label_text_cta(exl_ws, content_comp_div, col_location, col_area, col_title, data_selector, data_tag, raw_data_meta):
    start_time = datetime.now()
    try:
        selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]
        text_tag = selected_component.select_one(data_tag)
        if text_tag:
            cell_value = text_tag.decode_contents().strip()
        else:
            cell_value = ''

        if len(cell_value) >= 25:
            except_svg = cell_value.split("<svg")
            cell_check = 'N' if len(except_svg[0].strip()) >= 25 else "Y"
            cell_value = cell_value if len(except_svg[0].strip()) >= 25 else except_svg[0].strip()
            cell_remark = 'Guide: Less than 25 characters' if len(except_svg[0].strip()) >= 25 else "Pass"
        else:
            cell_check = 'Y'
            cell_remark = 'Pass'

        finish_time = datetime.now()
        time_elapsed = finish_time - start_time
        add_data_to_list(exl_ws, col_location, col_area, col_title, "", cell_value, cell_check, cell_remark,raw_data_meta)
    except IndexError :
        cell_value = ""


    return  cell_value



def process_background_image(exl_ws, content_comp_div, col_location, col_area, col_title, data_selector, img_desktop_width, img_desktop_height, img_mobile_width, img_mobile_height, check_bg, check_logo, raw_data_meta):
    selected_component = content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]

    img_tag = selected_component.select_one('img.image-v2__preview, img.image__preview')

    if img_tag:
        data_mobile_src = img_tag.get('data-mobile-src', 'None')
        data_desktop_src = img_tag.get('data-desktop-src', 'None')
        desktop_image_meta = []
        # image_url = 'https:' + data_desktop_src.split('?')[0]
        if check_bg == 'Y':
            original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor_usingcv(
                'https:' + data_desktop_src.split('?')[0])

            img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
            logo_check = check_samsung_logo_and_text('https:' + data_desktop_src.split('?')[0])  # New version logo detection (24.03.26)
            if color_results == 'Pass' and img_remark == 'Pass' and logo_check == 'Pass':
                cell_check = 'Y'
                img_check = 'Pass'
            else:
                cell_check = 'N'
                img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
        else:

            original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + data_desktop_src.split('?')[0])

            img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
            logo_check = check_samsung_logo_and_text('https:' + data_desktop_src.split('?')[0])  # New version logo detection (24.03.26)
            if img_remark == 'Pass' and logo_check == "Pass":
                cell_check = 'Y'
                img_check = 'Pass'
            else:
                cell_check = 'N'
                img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check
        add_dataimage_to_list(exl_ws, col_location, col_area, col_title, 'Desktop', data_desktop_src.split('?')[0], cell_check, img_check, image_bytes_resized, new_height,raw_data_meta)

        if check_bg == 'Y':
            original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor_usingcv(
                'https:' + data_mobile_src.split('?')[0])
            img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
            logo_check = check_samsung_logo_and_text('https:' + data_mobile_src.split('?')[0])  # New version logo detection (24.03.26)
            if color_results == 'Pass' and img_remark == 'Pass' and logo_check == 'Pass':
                cell_check = 'Y'
                img_check = 'Pass'
            else:
                cell_check = 'N'
                img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
        else:
            original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + data_mobile_src.split('?')[0])

            img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
            logo_check = check_samsung_logo_and_text('https:' + data_mobile_src.split('?')[0])  # New version logo detection (24.03.26)
            if img_remark == 'Pass' and logo_check == "Pass":
                cell_check = 'Y'
                img_check = 'Pass'
            else:
                cell_check = 'N'
                img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check
        add_dataimage_to_list(exl_ws, col_location, col_area, col_title, 'Mobile', data_mobile_src.split('?')[0], cell_check, img_check, image_bytes_resized, new_height,raw_data_meta)


    figure = selected_component.find('figure', class_='first-image')
    if figure:
        sources = figure.find_all('source')
        for source in sources:
            media_query = source.get('media')
            srcsets = source.get('srcset', '').split(', ')
            first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
            base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
            if "(min-width:1366px)" in media_query:
                color_results = ''
                if check_bg == 'Y':
                    # original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor('https:' + base_url.split('?')[0])
                    original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor_usingcv(
                        'https:' + base_url.split('?')[0])
                    img_remark = check_image_size(original_width, original_height, img_desktop_width,img_desktop_height)
                    logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])  # New version logo detection (24.03.26)
                    if color_results == 'Pass' and img_remark == 'Pass' and logo_check == 'Pass':
                        cell_check = 'Y'
                        img_check = 'Pass'
                    else:
                        cell_check = 'N'
                        img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
                else:
                    original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + base_url.split('?')[0])
                    img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
                    logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])  # New version logo detection (24.03.26)
                    if img_remark == 'Pass' and logo_check == "Pass":
                        cell_check = 'Y'
                        img_check = 'Pass'
                    else:
                        cell_check = 'N'
                        img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check

                add_dataimage_to_list(exl_ws, col_location, col_area, col_title, 'Desktop', base_url.split('?')[0], cell_check, img_check, image_bytes_resized, new_height,raw_data_meta)
        for source in sources:
            media_query = source.get('media')
            srcsets = source.get('srcset', '').split(', ')
            first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
            base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
            if "(max-width:767px)" in media_query:
                color_results = ''
                if check_bg == 'Y':
                    # original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor('https:' + base_url.split('?')[0])
                    original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor_usingcv(
                        'https:' + base_url.split('?')[0])
                    img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
                    logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])  # New version logo detection (24.03.26)
                    if color_results == 'Pass' and img_remark == 'Pass' and logo_check == 'Pass':
                        cell_check = 'Y'
                        img_check = 'Pass'
                    else:
                        cell_check = 'N'
                        img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
                else:
                    original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + base_url.split('?')[0])

                    img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
                    logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])  # New version logo detection (24.03.26)
                    if img_remark == 'Pass' and logo_check == "Pass":
                        cell_check = 'Y'
                        img_check = 'Pass'
                    else:
                        cell_check = 'N'
                        img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check

                add_dataimage_to_list(exl_ws, col_location, col_area, col_title, 'Mobile', base_url.split('?')[0], cell_check, img_check, image_bytes_resized, new_height,raw_data_meta)
    return




# def process_attributes_value_back(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_tag, data_class, data_attr_value, data_print):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#
#     data_tag_setting = data_tag
#     if data_tag == 'H':
#         for i in range(1, 7):
#             h_tag = selected_component.select_one(f'h{i}.{data_class}')
#             if h_tag:
#                 data_tag_setting = f'h{i}'
#                 break
#
#     data_attr = selected_component.find(data_tag_setting, class_=data_class)
#     cell_value = data_attr.get(data_attr_value, 'None') if data_attr else 'None'
#     if data_print == 'Y':
#         add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, '')
#
#     return cell_value
#
# def process_attributes_value_text_check(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_tag, data_class, data_attr_value, data_print):
#
#     try:
#         selected_component = select_component_slide(content_comp_div, data_selector)
#     except Exception as e:
#         # print(f"Error occurred while selecting component: {e}")
#         selected_component = None
#
#     if selected_component is None:
#         cell_value = ''
#         return  cell_value
#     else:
#
#         data_tag_setting = data_tag
#         if data_tag == 'H':
#             for i in range(1, 7):
#                 h_tag = selected_component.select_one(f'h{i}.{data_class}')
#                 if h_tag:
#                     data_tag_setting = f'h{i}'
#                     break
#
#         data_attr = selected_component.find(data_tag_setting, class_=data_class)
#         cell_value = data_attr.get(data_attr_value, 'None') if data_attr else 'None'
#
#         cell_remarks = ''
#         if cell_value != '':
#             cell_value_lower = cell_value.lower()
#
#             cell_remark1 = "Pass"
#             cell_remark2 = "Pass"
#             cell_remark3 = "Pass"
#
#             if "font-size" in cell_value_lower:
#                 cell_remark1 = "Guide: Unable to change font size"
#             if "font-color" in cell_value_lower:
#                 cell_remark2 = "Guide: Unable to change font color"
#             if "Font-family" in cell_value_lower:
#                 cell_remark3 = "Guide: Unable to change fonts"
#
#             cell_remark4 = "Pass"
#             if "samsung" in cell_value_lower:
#                 correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
#                 if not correct_format:
#                     cell_remark4 = "Guide: 'Samsung' must be consistently written"
#
#             words_to_check3 = ['.']
#             if any(word in cell_value_lower for word in words_to_check3):
#                 cell_remark5 = 'Guide: Check for the insertion of periods'
#             else:
#                 cell_remark5 = 'Pass'
#
#             words_to_uppercase = cell_value.split()
#             if any(word.isupper() and len(word) >= 3 for word in words_to_uppercase if
#                    word != "Samsung" and not any(char.isdigit() for char in word)):
#                 cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."
#             else:
#                 cell_remark6 = "Pass"
#
#             if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass":
#                 cell_remarks = "Pass"
#             if cell_remark1 != "Pass":
#                 cell_remarks = cell_remark1 + "\n"
#             if cell_remark2 != "Pass":
#                 cell_remarks += cell_remark2 + "\n"
#             if cell_remark3 != "Pass":
#                 cell_remarks += cell_remark3 + "\n"
#             if cell_remark4 != "Pass":
#                 cell_remarks += cell_remark4 + "\n"
#             if cell_remark5 != "Pass":
#                 cell_remarks += cell_remark5 + "\n"
#             if cell_remark6 != "Pass":
#                 cell_remarks += cell_remark6
#
#         if data_print == 'Y':
#             add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, cell_remarks)
#
#         return cell_value
#
# def process_heading_level(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_class, data_print):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#     cell_value = 'None'
#
#     for i in range(1, 7):
#         h_tag = selected_component.select_one(f'h{i}{data_class}')
#         if h_tag:
#             cell_value = f'H{i}'
#             break
#
#     if data_print == 'Y':
#         add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, '')
#
#     return  cell_value
#
# def process_label_text(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_tag, data_class, data_print):
#     try:
#         selected_component = select_component_slide(content_comp_div, data_selector)
#     except Exception as e:
#         # print(f"Error occurred while selecting component: {e}")
#         selected_component = None
#
#     if selected_component is None:
#         cell_value = ''
#         return  cell_value
#     else:
#
#         if data_class != 'N':
#             data_tag_setting = f'{data_tag}.{data_class}'
#         else:
#             data_tag_setting = f'{data_tag}'
#         if data_tag == 'H':
#             for i in range(1, 7):
#                 if data_class != 'N':
#                     h_tag = selected_component.select_one(f'h{i}.{data_class}')
#                 else:
#                     h_tag = selected_component.select_one(f'h{i}')
#                 if h_tag:
#                     data_tag_setting = f'h{i}'
#                     break
#         text_tag = selected_component.select_one(data_tag_setting)
#         if text_tag:
#             cell_value = text_tag.decode_contents().strip()
#         else:
#             cell_value = ''
#
#         if data_print == 'Y':
#             add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, '')
#
#         return cell_value
#
# def process_label_text_check(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_tag, data_class, data_print):
#     try:
#         selected_component = select_component_slide(content_comp_div, data_selector)
#     except Exception as e:
#         # print(f"Error occurred while selecting component: {e}")
#         selected_component = None
#
#     if selected_component is None:
#         cell_value = ''
#         return  cell_value
#     else:
#         if data_class != 'N':
#             data_tag_setting = f'{data_tag}.{data_class}'
#         else:
#             data_tag_setting = f'{data_tag}'
#         if data_tag == 'H':
#             for i in range(1, 7):
#                 if data_class != 'N':
#                     h_tag = selected_component.select_one(f'h{i}.{data_class}')
#                 else:
#                     h_tag = selected_component.select_one(f'h{i}')
#                 if h_tag:
#                     data_tag_setting = f'h{i}'
#                     break
#         text_tag = selected_component.select_one(data_tag_setting)
#
#         if text_tag:
#             cell_value = text_tag.decode_contents().strip()
#         else:
#             cell_value = ''
#
#         cell_remarks = ''
#         if cell_value != '':
#             cell_value_lower = cell_value.lower()
#
#             cell_remark1 = "Pass"
#             cell_remark2 = "Pass"
#             cell_remark3 = "Pass"
#
#             if "font-size" in cell_value_lower:
#                 cell_remark1 = "Guide: Unable to change font size"
#             if "font-color" in cell_value_lower:
#                 cell_remark2 = "Guide: Unable to change font color"
#             if "Font-family" in cell_value_lower:
#                 cell_remark3 = "Guide: Unable to change fonts"
#
#             cell_remark4 = "Pass"
#             if "samsung" in cell_value_lower:
#                 correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
#                 if not correct_format:
#                     cell_remark4 = "Guide: 'Samsung' must be consistently written"
#
#             words_to_check3 = ['.']
#             if any(word in cell_value_lower for word in words_to_check3):
#                 cell_remark5 = 'Guide: Check for the insertion of periods'
#             else:
#                 cell_remark5 = 'Pass'
#
#             words_to_uppercase = cell_value.split()
#             if any(word.isupper() and len(word) > 3 for word in words_to_uppercase if
#                    word != "Samsung" and not any(char.isdigit() for char in word)):
#                 cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."
#             else:
#                 cell_remark6 = "Pass"
#
#             if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass":
#                 cell_remarks = "Pass"
#             if cell_remark1 != "Pass":
#                 cell_remarks = cell_remark1 + "\n"
#             if cell_remark2 != "Pass":
#                 cell_remarks += cell_remark2 + "\n"
#             if cell_remark3 != "Pass":
#                 cell_remarks += cell_remark3 + "\n"
#             if cell_remark4 != "Pass":
#                 cell_remarks += cell_remark4 + "\n"
#             if cell_remark5 != "Pass":
#                 cell_remarks += cell_remark5 + "\n"
#             if cell_remark6 != "Pass":
#                 cell_remarks += cell_remark6
#
#         if data_print == 'Y':
#             add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, cell_remarks)
#
#         return cell_value
#
# def process_label_text_cta_remark(exl_ws, content_comp_div, col_depth1, col_depth2, col_depth3, data_selector, data_tag, sitecode):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#     text_tag = selected_component.select_one(data_tag)
#     if text_tag:
#         cell_value = text_tag.decode_contents().strip()
#     else:
#         cell_value = ''
#     cell_remarks = check_cta_text_for_sitecode(sitecode, cell_value)
#
#     add_data_to_list(exl_ws, col_depth1, col_depth2, col_depth3, cell_value, cell_remarks)
#
#     return  cell_value
#
# def process_background_image(exl_ws, content_comp_div, col_depth1, col_depth2, data_selector, img_desktop_width, img_desktop_height, img_mobile_width, img_mobile_height):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#
#     img_tag = selected_component.select_one('img.image-v2__preview, img.image__preview')
#     if img_tag:
#         data_mobile_src = img_tag.get('data-mobile-src', 'None')
#         data_desktop_src = img_tag.get('data-desktop-src', 'None')
#         alt = img_tag.get('data-desktop-alt') or img_tag.get('alt') or 'None'
#
#         original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + data_desktop_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Image', data_desktop_src.split('?')[0], img_remark, image_bytes_resized, new_height)
#         original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + data_mobile_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Image', data_mobile_src.split('?')[0], img_remark, image_bytes_resized, new_height)
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', alt, '')
#
#     # 동영상 정보 추출
#     video_container = selected_component.find('div', {'data-video-embed': 'true'})
#     if video_container:
#         video_data = video_container.get('data-video-data', '{}')
#         # JSON 데이터 파싱
#         import json
#         video_data_json = json.loads(video_data.replace('&quot;', '"'))
#         desktop_video_src = video_data_json.get('desktopSrc', 'None')
#         mobile_video_src = video_data_json.get('mobileSrc', 'None')
#         title_video = video_data_json.get('title', 'None')
#         caption_video = video_data_json.get('caption', 'None')
#
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', title_video, '')
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Video Caption', caption_video, '')
#         original_width, original_height = fetch_video_dimensions('https:' + desktop_video_src)
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Desktop MP4 File', desktop_video_src, img_remark)
#         original_width, original_height = fetch_video_dimensions('https:' + mobile_video_src)
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Mobile MP4 File', mobile_video_src, img_remark)
#
#     figure = selected_component.find('figure', class_='first-image')
#     if figure:
#         sources = figure.find_all('source')
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(min-width:1366px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height= fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Default Image', base_url, img_remark, image_bytes_resized, new_height)
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(max-width:767px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Default Image', base_url, img_remark, image_bytes_resized, new_height)
#     return
#
# def process_background_image_bgcheck(exl_ws, content_comp_div, col_depth1, col_depth2, data_selector, img_desktop_width, img_desktop_height, img_mobile_width, img_mobile_height):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#
#     img_tag = selected_component.select_one('img.image-v2__preview, img.image__preview')
#
#     if img_tag:
#         data_mobile_src = img_tag.get('data-mobile-src', 'None')
#         data_desktop_src = img_tag.get('data-desktop-src', 'None')
#         alt = img_tag.get('data-desktop-alt', 'None')
#         if alt == 'None':
#             alt = img_tag.get('alt', 'None')
#         original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor('https:' + data_desktop_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Image', data_desktop_src.split('?')[0], img_check, image_bytes_resized, new_height)
#         img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results
#         original_width, original_height, image_bytes_resized, new_height, avg_colors = fetch_image_dimensions_bgcolor('https:' + data_mobile_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Image', data_mobile_src.split('?')[0], img_check, image_bytes_resized, new_height)
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', alt, '')
#
#     # 동영상 정보 추출
#     video_container = selected_component.find('div', {'data-video-embed': 'true'})
#     if video_container:
#         video_data = video_container.get('data-video-data', '{}')
#         # JSON 데이터 파싱
#         import json
#         video_data_json = json.loads(video_data.replace('&quot;', '"'))
#         desktop_video_src = video_data_json.get('desktopSrc', 'None')
#         mobile_video_src = video_data_json.get('mobileSrc', 'None')
#         title_video = video_data_json.get('title', 'None')
#         caption_video = video_data_json.get('caption', 'None')
#
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', title_video, '')
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Video Caption', caption_video, '')
#         original_width, original_height = fetch_video_dimensions('https:' + desktop_video_src)
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Desktop MP4 File', desktop_video_src, img_remark)
#         original_width, original_height = fetch_video_dimensions('https:' + mobile_video_src)
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Mobile MP4 File', mobile_video_src, img_remark)
#
#     figure = selected_component.find('figure', class_='first-image')
#     if figure:
#         sources = figure.find_all('source')
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(min-width:1366px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height= fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Default Image', base_url, img_remark, image_bytes_resized, new_height)
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(max-width:767px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Default Image', base_url, img_remark, image_bytes_resized, new_height)
#     return
#
# def process_background_image_bgcheck_logo(exl_ws, content_comp_div, col_depth1, col_depth2, data_selector, img_desktop_width, img_desktop_height, img_mobile_width, img_mobile_height):
#     selected_component = select_component_slide(content_comp_div, data_selector)
#
#     img_tag = selected_component.select_one('img.image-v2__preview, img.image__preview, first-image')
#     if img_tag:
#         data_mobile_src = img_tag.get('data-mobile-src', 'None')
#         data_desktop_src = img_tag.get('data-desktop-src', 'None')
#         alt = img_tag.get('data-desktop-alt', 'None')
#         if alt == 'None':
#             alt = img_tag.get('alt', 'None')
#         original_width, original_height, image_bytes_resized, new_height, color_results = fetch_image_dimensions_bgcolor('https:' + data_desktop_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         logo_check = check_samsung_logo_and_text('https:' + data_desktop_src.split('?')[0])
#         img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Image', data_desktop_src.split('?')[0], img_check, image_bytes_resized, new_height)
#
#         original_width, original_height, image_bytes_resized, new_height, avg_colors = fetch_image_dimensions_bgcolor('https:' + data_mobile_src.split('?')[0])
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         logo_check = check_samsung_logo_and_text('https:' + data_mobile_src.split('?')[0])
#         img_check = "Size: \n" + img_remark + "\nBgcolor: \n" + color_results + "\nLogo: \n" + logo_check
#         add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Image', data_mobile_src.split('?')[0], img_check, image_bytes_resized, new_height)
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', alt, '')
#
#     # 동영상 정보 추출
#     video_container = selected_component.find('div', {'data-video-embed': 'true'})
#     if video_container:
#         video_data = video_container.get('data-video-data', '{}')
#         # JSON 데이터 파싱
#         import json
#         video_data_json = json.loads(video_data.replace('&quot;', '"'))
#         desktop_video_src = video_data_json.get('desktopSrc', 'None')
#         mobile_video_src = video_data_json.get('mobileSrc', 'None')
#         title_video = video_data_json.get('title', 'None')
#         caption_video = video_data_json.get('caption', 'None')
#
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Alternative Text', title_video, '')
#         # add_data_to_list(exl_ws, col_depth1, col_depth2, 'Video Caption', caption_video, '')
#         original_width, original_height = fetch_video_dimensions('https:' + desktop_video_src)
#         img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Desktop MP4 File', desktop_video_src, img_remark)
#         original_width, original_height = fetch_video_dimensions('https:' + mobile_video_src)
#         img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#         add_data_to_list(exl_ws, col_depth1, col_depth2, 'Mobile MP4 File', mobile_video_src, img_remark)
#
#     figure = selected_component.find('figure', class_='first-image')
#     if figure:
#         sources = figure.find_all('source')
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(min-width:1366px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height= fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_desktop_width, img_desktop_height)
#                 logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])
#                 img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Desktop Default Image', base_url, img_check, image_bytes_resized, new_height)
#         for source in sources:
#             media_query = source.get('media')
#             srcsets = source.get('srcset', '').split(', ')
#             first_srcset_url = srcsets[0].split(' ')[0] if srcsets else 'None'
#             base_url = first_srcset_url.split('?')[0] if first_srcset_url != 'None' else 'None'
#             if "(max-width:767px)" in media_query:
#                 original_width, original_height, image_bytes_resized, new_height = fetch_image_dimensions('https:' + base_url.split('?')[0])
#                 img_remark = check_image_size(original_width, original_height, img_mobile_width, img_mobile_height)
#                 logo_check = check_samsung_logo_and_text('https:' + base_url.split('?')[0])
#                 img_check = "Size: \n" + img_remark + "\nLogo: \n" + logo_check
#                 add_dataimage_to_list(exl_ws, col_depth1, col_depth2, 'Mobile Default Image', base_url, img_check, image_bytes_resized, new_height)
#
#
#     return
#
#
#
