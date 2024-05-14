import requests
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
from dotenv import load_dotenv
load_dotenv(verbose=False)


def fetch_image_dimensions(image_url):
    response = requests.get(image_url)
    if response.status_code == 200:

        if response.headers['Content-type'] == "image/svg+xml":
            print('Invalid image type (only PNG, JPEG can be supported)')
            raise ValueError('Invalid image type (only PNG, JPEG can be supported)')

        image_bytes = BytesIO(response.content)
        with PILImage.open(image_bytes) as img:

            original_width, original_height = img.size

            scale_factor = 200 / original_width
            new_height = int(original_height * scale_factor)

            pil_img_resized = img.resize((200, new_height), PILImage.LANCZOS)

            image_bytes_resized = BytesIO()
            pil_img_resized.save(image_bytes_resized, format=img.format)
            image_bytes_resized.seek(0)

        return original_width, original_height, image_bytes_resized, new_height



# subscription_key = "073c57790e814671b302ee30216d92fd"
ENDPOINT = "https://custommodelvision.cognitiveservices.azure.com/"

prediction_key = "fbf89a92ead94398a0c05d7ce015ca9b"
project_id = "173767f7-678a-462a-a159-3773ad30c344"

publish_iteration_name = "Iteration6"

prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)
computervision_client = ComputerVisionClient(ENDPOINT, CognitiveServicesCredentials(prediction_key))

# old version
def check_samsung_logo_and_text(image_url):

    response = requests.get(image_url)


    if response.status_code == 200:

        if response.headers['Content-type'] == "image/svg+xml" :
            return "Guide: Only can detect logo in image format with png, jpg and jpeg."

        image_bytes = BytesIO(response.content)
        with PILImage.open(image_bytes) as img:
            original_width, original_height = img.size
            new_width, new_height = int(original_width / 5), int(original_height / 5)

        new_image_url = image_url + "?imwidth=" + str(new_width)
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
    if read_result.status == OperationStatusCodes.succeeded:
        for text_result in read_result.analyze_result.read_results:
            for line in text_result.lines:

                if "samsung" in line.text.lower():
                    found = True
                    break
    if found:
        return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."

    # 로고 검사
    detect_logo_result = computervision_client.analyze_image(url=image_url,
                                                             visual_features=[VisualFeatureTypes.brands])
    for brand in detect_logo_result.brands:
        if brand.name.lower() == "samsung":
            return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
    return "Pass"

# new version
def check_samsung_logo_and_text_using_bytes(image_bytes):
    detect_logo_result = computervision_client.analyze_image_in_stream(image_bytes,
                                                                       visual_features=[VisualFeatureTypes.brands])

    for brand in detect_logo_result.brands:
        if brand.name.lower() == "samsung":
            return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."
    return "Pass"

def select_component_slide(content_comp_div, data_selector):
    return content_comp_div if data_selector == 'N' else content_comp_div.select(data_selector)[0]

def format_none_value(data_option_none):
    return 'None' if data_option_none == 'N' else data_option_none

def check_image_size(original_width, original_height, img_width, img_height):
    if original_width == img_width and original_height == img_height:
        img_remark = 'Pass'
    else:
        # 당분간 요건에 포함되지 않은 검증과정은 제외할 예정
        # 추후 수정 필요
        # img_remark = 'Guide: ' + str(img_width) + 'X' + str(img_height) + '\n' + 'Image: ' + str(original_width) + 'X' + str(original_height)
        img_remark = 'Pass'
    return img_remark

# old version
def fetch_image_dimensions_bgcolor(image_url):
    # Helper functions

    def calculate_average_color(image, x_start, y_start):
        r_sum, g_sum, b_sum = 0, 0, 0
        for x in range(x_start, x_start + 10):
            for y in range(y_start, y_start + 10):
                pixel = image.getpixel((x, y))
                r_sum += pixel[0]
                g_sum += pixel[1]
                b_sum += pixel[2]
        area = 100  # 10x10 area
        return (r_sum // area, g_sum // area, b_sum // area)

    def rgb_to_hex(rgb):
        return '#{:02x}{:02x}{:02x}'.format(*rgb)

    def is_color_in_range(rgb):
        gray_min_rgb, gray_max_rgb = int(os.getenv("GRAY_MIN_RGB")), int(os.getenv("GRAY_MAX_RGB"))
        return all(gray_min_rgb <= value <= gray_max_rgb for value in rgb)

    def check_transparency(img, corners):
        transparent_corners = 0
        for corner, (x_start, y_start) in corners.items():
            transparent = False
            for x in range(x_start, x_start + 10):
                for y in range(y_start, y_start + 10):
                    if img.mode == "RGBA":
                        pixel = img.getpixel((x, y))
                        # 투명 픽셀이 발견되면 해당 귀퉁이는 투명으로 간주
                        if pixel[3] < 255:
                            transparent = True
                            break
                if transparent:
                    break
            if transparent:
                transparent_corners += 1

        # 상단과 하단 귀퉁이 중 최소 한 곳씩 투명한 픽셀이 있으면 "Pass", 그렇지 않으면 "Check"
        return transparent_corners

    response = requests.get(image_url)
    if response.status_code != 200:
        return None

    image_bytes = BytesIO(response.content)
    img = PILImage.open(image_bytes)

    original_width, original_height = img.size
    scale_factor = 200 / original_width  # Assuming you want to resize width to 200px
    new_height = int(original_height * scale_factor)

    pil_img_resized = img.resize((200, new_height), PILImage.LANCZOS)
    image_bytes_resized = BytesIO()
    pil_img_resized.save(image_bytes_resized, format=img.format)
    image_bytes_resized.seek(0)

    corners = {
        "Upper Left": (0, 0),
        "Upper Right": (original_width - 11, 0),
        "Lower Left": (0, original_height - 11),
        "Lower Right": (original_width - 11, original_height - 11),
    }

    color_results = []
    transparent_corners = check_transparency(img, corners)
    pass_condition = transparent_corners >= 3

    if not pass_condition:
        for corner, (x_start, y_start) in corners.items():
            avg_rgb = calculate_average_color(img, x_start, y_start)
            color_hex = rgb_to_hex(avg_rgb)
            in_range = is_color_in_range(color_hex)
            color_results.append((corner, in_range, color_hex))
            if not in_range:
                pass_condition = False

    result_msg = "Pass" if pass_condition or all(in_range for _, in_range, _ in color_results) else "Guide : Background color must be transparent or #F4F4F4"

    return original_width, original_height, image_bytes_resized, new_height, result_msg

# new version
def fetch_image_dimensions_bgcolor_usingcv(image_url):
    def transparancy_convert_to_grey(url):
        def pil_to_cv2_byte_array(image_pil):
            # Convert PIL image to NumPy array
            image_np = np.array(image_pil)

            # Convert RGBA to BGRA (OpenCV uses BGRA color format)
            image_np_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGBA2BGRA)

            # Encode the image as a PNG byte array
            _, buffer = cv2.imencode('.png', image_np_bgr)

            # Convert the buffer to a byte array
            byte_array = bytearray(buffer)

            return byte_array

        # URL of the PNG image with transparency
        image_url = url

        # Fetch the image from the URL
        response = requests.get(image_url)


        # Check if the request was successful
        if response.status_code == 200:
            if response.headers['Content-type'] == "image/svg+xml":
                return "Guide: Only can detect logo in image format with png, jpg and jpeg."
            # Load the original image from the response content using PIL
            original_image_pil = PILImage.open(BytesIO(response.content))

            # Convert the image to RGBA mode if not already in RGBA
            if original_image_pil.mode != 'RGBA':
                original_image_pil = original_image_pil.convert('RGBA')

            # Create a new blank image with the same size and filled with transparent background
            modified_image_pil = PILImage.new('RGBA', original_image_pil.size, (0, 0, 0, 0))

            # Iterate through each pixel of the original image
            width, height = original_image_pil.size
            for x in range(width):
                for y in range(height):
                    # Get the RGBA values of the pixel
                    r, g, b, a = original_image_pil.getpixel((x, y))

                    # Check if the pixel is transparent
                    if a < 255:
                        # If it's transparent, replace it with the desired color (244, 244, 244)
                        modified_image_pil.putpixel((x, y), (244, 244, 244, 255))
                    else:
                        # If not transparent, keep the original pixel
                        modified_image_pil.putpixel((x, y), (r, g, b, a))
            return pil_to_cv2_byte_array(modified_image_pil)
        else:
            print("Failed to fetch the image from the URL.")
    # SINCE V1.0.3, parameter is changed into image bytes from url

    def rgb_to_hex(rgb):
        return '#{:02x}{:02x}{:02x}'.format(*rgb)

    def is_color_in_range(color_hex):
        return '#f3f3f3' <= color_hex <= '#f5f5f5'

    # New version check process for transparency

    response = requests.get(image_url)
    if response.status_code != 200:
        return None



    image_bytes = BytesIO(response.content)
    img = PILImage.open(image_bytes)

    # transparency_result = has_transparency(img)

    original_width, original_height = img.size
    scale_factor = 200 / original_width  # Assuming you want to resize width to 200px
    new_height = int(original_height * scale_factor)

    pil_img_resized = img.resize((200, new_height), PILImage.LANCZOS)
    image_bytes_resized = BytesIO()
    pil_img_resized.save(image_bytes_resized, format=img.format)
    image_bytes_resized.seek(0)


    # Image's transparency pixel converted to grey
    modified = transparancy_convert_to_grey(image_url)
    image_nparray = np.asarray(bytearray(modified), dtype=np.uint8)

    # New BG color extraction Code Start Point
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
    result_msg = "Pass" if  is_color_in_range(dominant_color) else fail_msg
    return original_width, original_height, image_bytes_resized, new_height, result_msg