import re
import requests
import unicodedata
from PIL import Image as PILImage
from io import BytesIO
import numpy as np
import cv2
import os
from datetime import datetime
from urllib.parse import urlparse

def remove_special_characters(text):
	return re.sub(r'[^\w\s]', ' ', text, flags=re.UNICODE)

# with open("C:\Users\PTK\Desktop\cell2\cell2\NeptunePulse\exception_words.txt") as file :
#     exception_words = [line.strip() for line in file]

exception_words=["QLED",
"OLED",
"BESPOKE",
"PSSD",
"SDXC"]

def qa_check_kv_text(cell_value, text_option):
	cell_check, cell_remarks = '', ''
	# print("@@@@@@@@@@@@@@@@@@@@@@@@@" + cell_value)
	clean_cell_value = re.sub(r'<\/?[a-zA-Z0-9]+>', '', cell_value)
	clean_cell_value = clean_cell_value.replace('<br>', '')
# 	print("@@@@@@@@@@@@@@@@@@@@@@@@@" + clean_cell_value)

	if text_option == 'headline':
		cell_check, cell_remarks = qa_check_text(clean_cell_value, 'Yes')
		if len(clean_cell_value) > 30:
			cell_check = 'N'
			if cell_remarks == 'Pass':
				cell_remarks = "Guide: KV's Headline Text use 30 characters max"
			else:
				cell_remarks += "Guide: KV's Headline Text use 30 characters max"
			return cell_check, cell_remarks


	elif text_option == 'description':
		cell_check, cell_remarks = qa_check_text(clean_cell_value)
		if len(clean_cell_value) > 78:
			cell_check = 'N'
			if cell_remarks == 'Pass':
				cell_remarks = "Guide: KV's Description Text use 78 characters max"
			else:
				cell_remarks +="Guide: KV's Description Text use 78 characters max"
			return cell_check, cell_remarks

	return cell_check, cell_remarks


def qa_check_text(cell_value, using_periods=""):
	cell_remarks = ''
	cell_check = ''
	if cell_value != '':
		cell_value_lower = cell_value.lower()

		cell_remark1 = "Pass"
		cell_remark2 = "Pass"
		cell_remark3 = "Pass"

		if "font-size:" in cell_value_lower or "font-size :" in cell_value_lower:
			cell_remark1 = "Guide: Unable to change font size"
		if "color:" in cell_value_lower or "color :" in cell_value_lower:
			cell_remark2 = "Guide: Unable to change font color"
		if "font-family:" in cell_value_lower or "font-family :" in cell_value_lower:
			cell_remark3 = "Guide: Unable to change fonts"

		cell_remark4 = "Pass"
		if "samsung" in cell_value_lower:
			correct_format = all(word == "Samsung" for word in cell_value.split() if word.lower() == "samsung")
			if not correct_format:
				cell_remark4 = "Guide: 'Samsung' must be consistently written"

		if ('. ' in cell_value_lower or cell_value_lower.endswith('.')) and using_periods == 'Yes':
			cell_remark5 = 'Guide: Check for the insertion of periods'
		else:
			cell_remark5 = 'Pass'

		special_removed_cell_value = remove_special_characters(cell_value)
		words_to_uppercase = special_removed_cell_value.split()

		# Iran 의 CTA TEXT 시작과 끝에 추가된 LRM html entity code 제거를 위한 조건문
		words_to_uppercase[0] = words_to_uppercase[0][3:] if "LRM" in words_to_uppercase[0] else words_to_uppercase[
			0]
		words_to_uppercase[-1] = words_to_uppercase[-1][:-3] if "LRM" in words_to_uppercase[-1] else \
			words_to_uppercase[-1]

		if any(word.isupper() and len(word) >= 4 for word in words_to_uppercase if
			   word not in exception_words and not any(char.isdigit() for char in word)):
			cell_remark6 = "Guide: All words in titles cannot be written in uppercase, except 'Samsung'."

			# TEXT에 한자어가 포함된다면 PASS
			if any(any(unicodedata.category(char) == 'Lo' for char in text) for text in words_to_uppercase):
				cell_remark6 = "Pass"


		else:
			cell_remark6 = "Pass"

		if any(find_sku_text(word) and len(word) >= 4 and word.isupper() and word not in exception_words for word in words_to_uppercase) :
			cell_remark7 = "Guide: SKU cannot be included in text"
		else:
			cell_remark7 = "Pass"

		if cell_remark1 == "Pass" and cell_remark2 == "Pass" and cell_remark3 == "Pass" and cell_remark4 == "Pass" and cell_remark5 == "Pass" and cell_remark6 == "Pass" and cell_remark7 == "Pass":
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
			cell_remarks += cell_remark6 + "\n"
		if cell_remark7 != "Pass":
			cell_remarks += cell_remark7

	return cell_check, cell_remarks

def process_badge_text(cell_value, badge_color):
	cell_check = 'N'
	cell_remarks = 'Guide: Badges can only contain the text New, Sale'
	# New, Sale
	allowed_patterns = [
		("New", "blue"),
		("NEW", "blue"),
		("Sale", "red"),
	]

	# 주어진 텍스트와 각 패턴을 비교하여 매칭되는지 확인
	for pattern in allowed_patterns:
		if re.match(pattern[0], cell_value) and pattern[1] == badge_color:
			cell_check = 'Y'
			cell_remarks = 'Pass'
			break
		if re.match(pattern[0], cell_value) and pattern[1] != badge_color:
			cell_remarks = "Guide: The badge's color guide was not followed."
			break
	return cell_check, cell_remarks

def find_sku_text(word):
	pattern = re.compile(r'^[A-Z][-A-Z0-9]{0,2}[A-Z0-9/-]*$')
	if pattern.match(word):
		return True
	return False

def qa_check_img_size(img_file, bg_image_width, bg_image_height, setting_img_check_size):
	if img_file is None:
		return ""

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



def qa_check_img_logo(img_url, img_file, setting_img_check_logo):
	if img_url is None:
		return "Guide: Image is not detected."

	if setting_img_check_logo == 'Yes':
		retry_cnt = 0
		while retry_cnt < 10:
			try:
				image_response = requests.get(img_url)

				if image_response.status_code != 200:
					return "Bad Request For Image URL"

				if image_response.headers['Content-type'] == "image/svg+xml":
					return "Guide: Only can detect logo in image format with png, jpg and jpeg."

				# 로고 검사
				logo_api_endpoint = f"{os.getenv('API_END_POINT')}{os.getenv('API_ROUTER_LOGO')}"
				logo_detecting_response = requests.post(logo_api_endpoint, files={'file': image_response.content,
																				  'type': image_response.headers[
																					  'Content-type']})
				logo_detecting_response.raise_for_status()
				logo_detecting_result = logo_detecting_response.json()

				if logo_detecting_result["has_logo"]:
					return "Guide: The Samsung logo cannot be used in duplicate within the dotcom image except for the GNB logo."

				# # 오버랩 검사 ( 아직 신뢰도 측면에서 검출률 부족, 적용대기)
				# overlap_api_endpoint = f"{os.getenv('API_END_POINT')}{os.getenv('API_ROUTER_OVERLAP')}"
				#
				# overlap_check_response = requests.post(overlap_api_endpoint, files={'file': image_response.content,
				#                                                                     'type': image_response.headers[
				#                                                                         'Content-type']})
				# overlap_check_response.raise_for_status()
				# overlap_check_result = overlap_check_response.json()
				#
				# if not overlap_check_result["is_pass"]:
				#     return "Guide: Merchandising images cannot include overlapped objects."
				return "Pass"

			except requests.exceptions.RequestException as e:
				retry_cnt += 1
				print(e, 'RETRY : ', retry_cnt)
				continue

		raise Exception("API Request is denied")

	#  setting_img_check_logo == 'No'
	return "Pass"

def qa_check_img_bgcolor(img_url, img_file, setting_img_check_bgcolor):
	if img_url is None:
		return ""

	if setting_img_check_bgcolor == 'Yes':
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

		def transparancy_convert_to_grey(url):
			# URL of the PNG image with transparency
			image_url = url

			# Fetch the image from the URL
			response = requests.get(image_url)

			# Check if the request was successful
			if response.status_code != 200:
				return "Failed to fetch the image from the URL."
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

		# SINCE V1.0.3, parameter is changed into image bytes from url

		def rgb_to_hex(rgb):
			return '#{:02x}{:02x}{:02x}'.format(*rgb)

		def is_color_in_range(rgb):
			gray_min_rgb, gray_max_rgb = int(os.getenv("GRAY_MIN_RGB")), int(os.getenv("GRAY_MAX_RGB"))
			return all(gray_min_rgb <= value <= gray_max_rgb for value in rgb)

		# New version check process for transparency

		response = requests.get(img_url)
		if response.status_code != 200:
			return None

		image_bytes = BytesIO(response.content)
		img = PILImage.open(image_bytes)

		# Image's transparency pixel converted to grey
		modified = transparancy_convert_to_grey(img_url)
		image_nparray = np.asarray(bytearray(modified), dtype=np.uint8)

		# New BG color extraction Code Start Point
		img = cv2.imdecode(image_nparray, cv2.IMREAD_COLOR)

		grayed_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

		# Dilate or Erode image
		kernel_size_row = 3
		kernel_size_col = 3
		kernel = np.ones((kernel_size_row, kernel_size_col), np.uint8)

		gray = cv2.erode(grayed_img, kernel, iterations=3)

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


		fail_msg = "Guide : Background color must be transparent or #f4f4f4"
		result_msg = "Pass" if is_color_in_range(dominant_color) else fail_msg

		return result_msg

	#  setting_img_check_logo == 'No'
	return "Pass"


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

def key_id_maker(site_code, page_type, component_id, component_order, area, title, desc, tab_name = "", title_order = ""):
	if tab_name != "" and title_order == "":
		return site_code + "_" + page_type + "_" + component_id + "_" + str(component_order) + "_" + tab_name + "_" + title + "_" + desc
	if tab_name != "" and title_order != "":
		return site_code + "_" + page_type + "_" + component_id + "_" + str(component_order) + "_" + tab_name + "_" + str(title_order) + "_" + title + "_" + desc
	return site_code + "_" + page_type + "_" + component_id + "_" + str(component_order) + "_" + area + "_" + title + "_" + desc
