def home_kv (aem_html) :
    if 'ho-g-home-kv-carousel' in content_comp_name:
        cell_value = process_class_attributes(exl_ws, content_comp_div,"", "", "", "","N", "section", {"home-kv-carousel--width-large": "1920px"}, "1440px", "N", raw_data_meta, db_conn)
        bg_image_desktop_width = 1920  if cell_value == '1920px' else 1440
        bg_image_mobile_width = 720
        cell_value = process_class_attributes(exl_ws, content_comp_div,"", "", "", "", "N", "section",{"home-kv-carousel--height-large": "Desktop:810px / Mobile:640px", "home-kv-carousel--height-medium": "Desktop:640px / Mobile:540px","home-kv-carousel--height-smedium": "Desktop:344px / Mobile:400px","home-kv-carousel--height-small": "Desktop:320px / Mobile:320px"},"N", "N", raw_data_meta, db_conn)
        bg_image_desktop_height, bg_image_mobile_height = cell_value.split()
        if cell_value == 'Desktop:810px / Mobile:640px':
            bg_image_desktop_height = 810
            bg_image_mobile_height = 1280
        elif cell_value == 'Desktop:640px / Mobile:540px':
            bg_image_desktop_height = 640
            bg_image_mobile_height = 1080
        elif cell_value == 'Desktop:344px / Mobile:400px':
            bg_image_desktop_height = 344
            bg_image_mobile_height = 800
        elif cell_value == 'Desktop:320px / Mobile:320px':
            bg_image_desktop_height = 320
            bg_image_mobile_height = 640
        carousel_no = 0
        for content_carousel_div in content_comp_div.select('section > div.home-kv-carousel__container > div.home-kv-carousel__wrapper > div'):
            carousel_no += 1
            cell_value = process_attributes_value(exl_ws, content_carousel_div,
                                                  "KeyVisual", "KV" + str(carousel_no), "Headline Text",
                                                  'Desktop',
                                                  "div > div > div.home-kv-carousel__text-wrap", "H",
                                                  "home-kv-carousel__headline",
                                                  "data-desktop-headline-text", "Y", "Y", raw_data_meta, db_conn)
            cell_value = process_attributes_value(exl_ws, content_carousel_div,
                                                  "KeyVisual", "KV" + str(carousel_no), "Headline Text",
                                                  'Mobile',
                                                  "div > div > div.home-kv-carousel__text-wrap", "H",
                                                  "home-kv-carousel__headline",
                                                  "data-mobile-headline-text", "Y", "Y", raw_data_meta, db_conn)
            cell_value = process_attributes_value(exl_ws, content_carousel_div,
                                                  "KeyVisual", "KV" + str(carousel_no), "Description Text",
                                                  'Desktop',
                                                  "div > div > div.home-kv-carousel__text-wrap", "p",
                                                  "home-kv-carousel__desc",
                                                  "data-desktop-description", "N", "Y", raw_data_meta, db_conn)
            cell_value = process_attributes_value(exl_ws, content_carousel_div,
                                                  "KeyVisual", "KV" + str(carousel_no), "Description Text",
                                                  'Mobile',
                                                  "div > div > div.home-kv-carousel__text-wrap", "p",
                                                  "home-kv-carousel__desc",
                                                  "data-mobile-description", "N", "Y", raw_data_meta, db_conn)
            process_cta_buttons(exl_ws, content_carousel_div, "KeyVisual", "KV" + str(carousel_no), "CTA",
                                "div > div > div.home-kv-carousel__text-wrap > div.home-kv-carousel__cta-wrap", raw_data_meta, db_conn)
            process_background_image(exl_ws, content_carousel_div, "KeyVisual", "KV" + str(carousel_no),
                                     "BG Image",
                                     "div > div > div.home-kv-carousel__background-media-wrap",
                                     bg_image_desktop_width, bg_image_desktop_height, bg_image_mobile_width,
                                     bg_image_mobile_height, "N", "Y", raw_data_meta, db_conn)