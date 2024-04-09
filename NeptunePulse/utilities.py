import re
import requests
import html
import numpy as np
import cv2
import os
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes, VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials
from datetime import datetime
from urllib.parse import urlparse

def remove_special_characters(text):
    return re.sub(r'[^\w\s]', ' ', text, flags=re.UNICODE)

with open('exception_words.txt', 'r') as file :
    exception_words = [line.strip() for line in file]

def qa_check_text(cell_value):
    cell_remarks = ''
    cell_check = ''
    if cell_value != '':
        cell_value_lower = cell_value.lower()

        cell_remark1 = "Pass"
        cell_remark2 = "Pass"
        cell_remark3 = "Pass"

        if "font-size" in cell_value_lower :
            cell_remark1 = "Guide: Unable to change font size"
        if "font-color" in cell_value_lower :
            cell_remark2 = "Guide: Unable to change font color"
        if "Font-family" in cell_value_lower :
            cell_remark3 = "Guide: Unable to change fonts"

        cell_remark4 = "Pass"
        if "samsung" in cell_value_lower :
            correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
            if not correct_format :
                cell_remark4 = "Guide: 'Samsung' must be consistently written"

        if '. ' in cell_value_lower or cell_value_lower.endswith('.'):
            cell_remark5 = 'Guide: Check for the insertion of periods'
        else:
            cell_remark5 = 'Pass'

        special_removed_cell_value = remove_special_characters(cell_value)
        words_to_uppercase = special_removed_cell_value.split()

        # Iran 의 CTA TEXT 시작과 끝에 추가된 LRM html entity code 제거를 위한 조건문
        words_to_uppercase[0] = words_to_uppercase[0][3 :] if "LRM" in words_to_uppercase[0] else words_to_uppercase[0]
        words_to_uppercase[-1] = words_to_uppercase[-1][:-3] if "LRM" in words_to_uppercase[-1] else words_to_uppercase[-1]

        if any(word.isupper() and len(word) >= 4 for word in words_to_uppercase if word not in exception_words and not any(char.isdigit() for char in word)):
            cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."
        else :
            cell_remark6 = "Pass"

        if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass":
            cell_remarks = "Pass"
            cell_check = "Y"
        else :
            cell_check = "N"

        if cell_remark1 != "Pass" :
            cell_remarks = cell_remark1 + "\n"
        if cell_remark2 != "Pass" :
            cell_remarks += cell_remark2 + "\n"
        if cell_remark3 != "Pass" :
            cell_remarks += cell_remark3 + "\n"
        if cell_remark4 != "Pass" :
            cell_remarks += cell_remark4 + "\n"
        if cell_remark5 != "Pass" :
            cell_remarks += cell_remark5 + "\n"
        if cell_remark6 != "Pass" :
            cell_remarks += cell_remark6
    else:
        cell_check = ''
        cell_remarks = ''

    return cell_check, cell_remarks

def qa_check_img_size(img_file, bg_image_width, bg_image_height, setting_img_check_size):
    if setting_img_check_size == 'Yes':
        original_width, original_height = img_file.size
        if original_width == bg_image_width and original_height == bg_image_height:
            cell_remarks = 'Pass'
        else:
            # 당분간 요건에 포함되지 않은 검증과정은 제외할 예정
            # 추후 수정 필요
            cell_remarks = 'Guide: ' + str(bg_image_width) + 'X' + str(bg_image_height) + '\n' + 'Image: ' + str(original_width) + 'X' + str(original_height)
    else:
        cell_remarks = 'Pass'
    return cell_remarks


subscription_key = "073c57790e814671b302ee30216d92fd"
endpoint = "https://poc-image.cognitiveservices.azure.com/"

# Computer Vision 클라이언트 초기화
computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

def qa_check_img_logo(img_url, img_file, setting_img_check_logo):
    if setting_img_check_logo == 'Yes':
        original_width, original_height = img_file.size
        new_width, new_height = int(original_width / 5), int(original_height / 5)
        new_image_url = img_url + "?imwidth=" + str(new_width)
        read_response = computervision_client.read(new_image_url, raw=True)
        read_operation_location = read_response.headers["Operation-Location"]
        operation_id = read_operation_location.split("/")[-1]

        # 분석 결과 대기
        while True:
            read_result = computervision_client.get_read_result(operation_id)
            if read_result.status not in ['notStarted', 'running']:
                break

        # 분석 결과 출력
        found = False
        if read_result.status == OperationStatusCodes.succeeded :
            for text_result in read_result.analyze_result.read_results :
                for line in text_result.lines :
                    # print(line.text)
                    if "samsung" in line.text.lower() :
                        found = True
                        break
        if found:
            return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."

        # 로고 검사
        detect_logo_result = computervision_client.analyze_image(url=img_url, visual_features=[VisualFeatureTypes.brands])
        for brand in detect_logo_result.brands:
            if brand.name.lower() == "samsung":
                return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
    return "Pass"

def qa_check_img_bgcolor(img_url, img_file, setting_img_check_bgcolor):
    if setting_img_check_bgcolor == 'Yes':
        def rgb_to_hex(rgb):
            return '#{:02x}{:02x}{:02x}'.format(*rgb)

        def is_color_in_range(color_hex):
            return '#f3f3f3' <= color_hex <= '#f5f5f5'

        def has_transparency(img):
            try:
                if img.mode == 'RGBA':
                    alpha = img.split()[3]
                    return alpha.getdata() is not None
                return False
            except Exception as e:
                print("Error:", e)

        transparency_result = has_transparency(img_file)

        # New BG color extraction Code Start Point
        image_nparray = np.asarray(bytearray(requests.get(img_url).content), dtype=np.uint8)

        img = cv2.imdecode(image_nparray, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, trash = cv2.threshold(gray, np.mean(gray), 255, cv2.THRESH_BINARY)
        _, bg = cv2.threshold(gray, np.mean(gray), 255, cv2.THRESH_BINARY_INV)

        # GET CONTOURS
        contours, hierarchy = cv2.findContours(trash, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

        # GET Background
        cnt = sorted(contours, key=cv2.contourArea)[-1]

        mask = np.zeros((img.shape[0], img.shape[1]), dtype='uint8')

        masked_result = cv2.drawContours(mask, [cnt], -1, (255, 255, 255), -1)
        final_image = cv2.bitwise_and(img, img, mask=trash)

        image_rgb = cv2.cvtColor(final_image, cv2.COLOR_BGR2RGB)

        # Flatten the image to a 1D array
        pixels = image_rgb.reshape((-1, 3))

        # Count occurrences of each color
        color_counts = np.unique(pixels, axis=0, return_counts=True)

        # Find the color with the maximum occurrence
        max_index = np.argmax(color_counts[1])
        dominant_color = color_counts[0][max_index]

        bg_hex_code = rgb_to_hex(dominant_color)

        if str(bg_hex_code) == "#000000":
            bg_hex_code = "can not detect color"

        fail_msg = "Guide : Background color must be transparent or #f4f4f4 but " + str(bg_hex_code)
        result_msg = "Pass" if transparency_result or is_color_in_range(bg_hex_code) else fail_msg
    else:
        result_msg = 'Pass'
    return result_msg

def img_check(cell_remarks_size, cell_remarks_logo, cell_remarks_bgcolor):
    cell_remarks = ''
    if cell_remarks_size == 'Pass' and cell_remarks_logo == 'Pass' and cell_remarks_bgcolor == 'Pass':
        cell_check = 'Y'
        cell_remarks = 'Pass'
    else :
        cell_check = 'N'
        if cell_remarks_size != 'Pass':
            cell_remarks += cell_remarks_size
        if cell_remarks_logo != 'Pass':
            cell_remarks = (cell_remarks + '\n' if cell_remarks else '') + cell_remarks_logo
        if cell_remarks_bgcolor != 'Pass':
            cell_remarks = (cell_remarks + '\n' if cell_remarks else '') + cell_remarks_bgcolor

    return cell_check, cell_remarks

def img_save(img_url, img_file, sitecode, img_title, cell_check, img_html, id_no):
    id_no += 1
    img_folder = 'result/' + datetime.now().strftime("%Y%m%d") + '/html/image_' + sitecode.replace("_", "-")
    html_img_folder = 'image_' + sitecode.replace("_", "-") + '/'
    html_folder = 'result/' + datetime.now().strftime("%Y%m%d") + '/html'
    img_filename = urlparse(img_url).path.split('/')[-1]
    if not os.path.exists(img_folder):
        os.makedirs(img_folder)
    file_path = os.path.join(img_folder, img_filename)
    img_file.save(file_path)
    img_html += ("<div class=\"row\">\n"
                 "<div class=\"col-1\">1</div>\n"
                 "<div class=\"col-9\">\n"
                 "<figure class=\"figure\">\n"
                 "<figcaption class=\"figure-caption text-start\">" + img_title + "</figcaption>\n"
                 "<img src = \"" + html_img_folder + img_filename + "\" class=\"img-fluid\"/>\n"
                 "</figure>\n"
                 "</div>\n"
                 "<div class=\"col-1 d-flex align-items-center\">\n")
    if cell_check == 'Y':
        img_html += ("<input type=\"checkbox\" class=\"btn-check\" id=\"btn-check-outlined" + str(id_no) +"\" checked autocomplete=\"off\">\n"
                 "<label class=\"btn btn-outline-primary\" for=\"btn-check-outlined" + str(id_no) +"\">Pass</label><br>\n"
                 "</div>\n"
                 "</div>\n")
    else:
        img_html += ("<input type=\"checkbox\" class=\"btn-check\" id=\"btn-check-outlined" + str(id_no) +"\" autocomplete=\"off\">\n"
                     "<label class=\"btn btn-outline-primary\" for=\"btn-check-outlined" + str(id_no) +"\">Pass</label><br>\n"
                     "</div>\n"
                     "</div>\n")
    return img_html, id_no
