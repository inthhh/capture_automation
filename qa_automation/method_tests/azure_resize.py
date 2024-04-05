from datetime import datetime

import requests
# from openpyxl.drawing.image import Image
from PIL import Image as PILImage
from io import BytesIO
import cv2
import numpy as np
import os
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes, VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials


import time
from datetime import datetime



def fetch_image_dimensions(image_url):
    response = requests.get(image_url)
    if response.status_code != 200 or response.headers['Content-type'] == "image/svg+xml":
        raise ValueError('Invalid image type (only PNG, JPEG can be supported)')

    image_bytes = BytesIO(response.content)
    with PILImage.open(image_bytes) as img:

        original_width, original_height = img.size

        scale_factor = 200 / original_width

        new_height = int(original_height * scale_factor) if int(original_height * scale_factor) > 50 and int(original_width * scale_factor) > 50 else  50
        new_width = 200 if  new_height > 50 else int(10000/(original_height * scale_factor))
        pil_img_resized = img.resize((new_width, new_height), PILImage.LANCZOS)

        image_bytes_resized = BytesIO()
        pil_img_resized.save(image_bytes_resized, format=img.format)
        image_bytes_resized.seek(0)

    return original_width, original_height, image_bytes_resized, new_height, image_bytes



# subscription_key = "073c57790e814671b302ee30216d92fd"
ENDPOINT = "https://custommodelvision.cognitiveservices.azure.com/"

prediction_key = "fbf89a92ead94398a0c05d7ce015ca9b"
project_id = "173767f7-678a-462a-a159-3773ad30c344"

publish_iteration_name = "Iteration6"

prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)
computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(prediction_key))

def check_samsung_logo_and_text(image_url):
    start_time = datetime.now()
    response = requests.get(image_url)
    # if response.status_code == 200:
    #     image_bytes = BytesIO(response.content)
    #     with PILImage.open(image_bytes) as img:
    #         original_width, original_height = img.size
    #         new_width, new_height = int(original_width / 5), int(original_height / 5)

        # new_image_url = image_url + "?imwidth=" + str(new_width)
    read_response = computervision_client.read(image_url, raw=True)
        # read_response = computervision_client.analyze_image_in_stream(image_bytes,  visual_features=[VisualFeatureTypes.brands])
    operation_id = read_response.headers["Operation-Location"].split("/")[-1]

        # print(read_response)
    # 분석 결과 대기
    read_result = computervision_client.get_read_result(operation_id)
    while read_result.status in ['notStarted', 'running']:
        read_result = computervision_client.get_read_result(operation_id)


    # 분석 결과 출력
    found = False
    if read_result.status == OperationStatusCodes.succeeded:
        for text_result in read_result.analyze_result.read_results:
            for line in text_result.lines:
                # print(line.text)
                if "samsung" in line.text.lower():
                    found = True
                    break
    if found:
        end_time = datetime.now()
        time_elapsed = end_time - start_time
        print(time_elapsed)
        return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."

    # 로고 검사
    # detect_logo_result = computervision_client.analyze_image(url=image_url,visual_features=[VisualFeatureTypes.brands])
    #     #
    # for brand in detect_logo_result.brands:
    #     if brand.name.lower() == "samsung":
    #         end_time = datetime.now()
    #         time_elapsed = end_time - start_time
    #         print(time_elapsed)
    #         return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
    end_time = datetime.now()
    time_elapsed = end_time - start_time
    print(time_elapsed)
    return "Pass"

def check_samsung_logo_and_text_v2(image_stream):
    # start_time = datetime.now()
    # img = PILImage.open(BytesIO(image_bytes)).convert('RGB')
    read_response = computervision_client.read_in_stream(image_stream,  raw=True)
    operation_id = read_response.headers["Operation-Location"].split("/")[-1]
    while True:
        read_results = computervision_client.get_read_result(operation_id)
        if read_results.status not in [OperationStatusCodes.running, OperationStatusCodes.not_started]:
            break

    for brand in read_response.brands:
        print(brand)
        if brand.name.lower() == "samsung":
            end_time = datetime.now()
            time_elapsed = end_time - start_time
            print(time_elapsed)
            return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
    end_time = datetime.now()
    time_elapsed = end_time - start_time
    print(time_elapsed)
    return "Pass"

def check_samsung_logo_and_text_using_byte(image_bytes):

    # img = PILImage.open(image_bytes)
    # original_width, original_height = img.size
    # scale_factor = 200 / original_width  # Assuming you want to resize width to 200px
    # new_height = int(original_height * scale_factor)
    #
    # pil_img_resized = img.resize((200, new_height), PILImage.LANCZOS)
    # image_bytes_resized = BytesIO()
    # pil_img_resized.save(image_bytes_resized, format=img.format)
    # image_bytes_resized.seek(0)
    print("start analyze")
    image_analysis = computervision_client.analyze_image_in_stream(image_bytes, visual_features=[VisualFeatureTypes.tags])
    if image_analysis.tags:
        print("Tags detected in the image:")
        for tag in image_analysis.tags:
            print("\t", tag.name)
    else:
        print("No tags detected.")
        # read_operation_location = read_response.headers["Operation-Location"]
        # operation_id = read_operation_location.split("/")[-1]
        #
        # # 분석 결과 대기
        # while True:
        #     read_result = computervision_client.get_read_result(operation_id)
        #     if read_result.status not in ['notStarted', 'running']:
        #         break
        #
        # # 분석 결과 출력
        # found = False
        # if read_result.status == OperationStatusCodes.succeeded:
        #     for text_result in read_result.analyze_result.read_results:
        #         for line in text_result.lines:
        #             # print(line.text)
        #             if "samsung" in line.text.lower():
        #                 found = True
        #                 break
        # if found:
        #     return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
        #
        # # 로고 검사
        # detect_logo_result = computervision_client.analyze_image(url=image_url,
        #                                                          visual_features=[VisualFeatureTypes.brands])
        # for brand in detect_logo_result.brands:
        #     if brand.name.lower() == "samsung":
        #         return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
        # return "Pass"

if __name__ == "__main__":
    # BR의 fail 이미지
    # image_url = "https://images.samsung.com/is/image/samsung/assets/br/home-appliances/PF_PC_20anos_KV_AF_notext.jpg"

    # Auction에서 로고와 함께있는 삼성 노트북 이미지
    # image_url = "https://image.auction.co.kr/itemimage/3c/fb/9f/3cfb9f29e6.jpg"

    # Auction에서 로고와 함께있는 삼성 SSD 이미지
    image_url = "https://image.auction.co.kr/itemimage/36/bc/27/36bc276db7.jpg?ver=1712294211"

    #Samusng logo png
    # image_url = "https://images.samsung.com/kdp/aboutsamsung/brand_identity/logo/360_197_1.png?$FB_TYPE_B_PNG$"

    original_width, original_height, image_bytes_resized, new_height, image_stream = fetch_image_dimensions(image_url)
    print( check_samsung_logo_and_text(image_url))
    # azure_result = check_samsung_logo_and_text_v2(image_bytes_resized)
    # print(check_samsung_logo_and_text_v2(image_stream))
    # print(check_samsung_logo_and_text_v2(image_bytes_resized))