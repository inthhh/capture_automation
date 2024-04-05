"https://images.samsung.com/is/image/samsung/assets/mm/2401/home/HOME_E3_Global_376x376_pc.png"
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

def fetch_image_dimensions_bgcolor_usingcv(image_url):
    # SINCE V1.0.3, parameter is changed into image bytes from url

    def rgb_to_hex(rgb):
        return '#{:02x}{:02x}{:02x}'.format(*rgb)

    def is_color_in_range(color_hex):
        return '#f3f3f3' <= color_hex <= '#f5f5f5'

    # New version check process for transparency
    def has_transparency(img):
        try:
            if img.mode == 'RGBA':
                alpha = img.split()[3]
                bg = PILImage.new("RGB", img.size, (244, 244, 244))
                bg.paste(img, mask=alpha)
                return alpha.getdata() is not None
            return False
        except Exception as e:
            print("Error:", e)

    def convert_transparency_to_grey(img):
        # Open the image
        try :
            if img.mode == 'RGBA':
                alpha = img.split()[3]
                bg = PILImage.new("RGB", img.size, (244, 244, 244))
                bg.paste(img, mask=alpha)
                output_buffer = BytesIO()
                bg.save(output_buffer, format="PNG")

                # Get the byte data
                output_buffer.seek(0)
                result_bytes = output_buffer.read()

                return result_bytes
            return img
        except Exception as e:
            print("Error:", e)

    response = requests.get(image_url)
    if response.status_code != 200:
        return None

    if response.headers['Content-type'] == "image/svg+xml":
        return "Guide: Only can detect logo in image format with png, jpg and jpeg."

    image_bytes = BytesIO(response.content)
    original_img = PILImage.open(image_bytes)
    converted_img = convert_transparency_to_grey(original_img)
    # transparency_result = has_transparency(img)

    img = PILImage.fromarray(converted_img)
    original_width, original_height = img.size
    scale_factor = 200 / original_width  # Assuming you want to resize width to 200px
    new_height = int(original_height * scale_factor)

    pil_img_resized = img.resize((200, new_height), PILImage.LANCZOS)
    image_bytes_resized = BytesIO()
    pil_img_resized.save(image_bytes_resized, format=img.format)
    image_bytes_resized.seek(0)


    # New BG color extraction Code Start Point
    image_nparray = np.asarray(bytearray(requests.get(image_url).content), dtype=np.uint8)

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
    return original_width, original_height, image_bytes_resized, new_height, result_msg

if __name__ == "__main__":
    print(fetch_image_dimensions_bgcolor_usingcv("https://images.samsung.com/is/image/samsung/assets/mx/offers-module/2024/w14/home/destacados/ofertasrelevantes/WEB_Live.png"))