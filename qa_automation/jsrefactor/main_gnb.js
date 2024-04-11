import axios from "axios";
import * as cheerio from "cheerio";
import exceljs from "exceljs";
const { Workbook } = exceljs;

// const url_codes = ['uk', 'fr', 'de', 'it', 'es', 'sg', 'id', 'ph', 'au', 'my', 'th', 'vn', 'ar', 'mx', 'br', 'in', 'sa', 'sa_en', 'ca', 'ca_fr', 'ae', 'ae_ar']
// const url_codes = ["fr", "de", "es", "id", "vn"];
const url_codes = ["fr"];

// BS에서 파싱 패턴에서 HTML 주석처럼 보일 수 있는 에러 출력 방지
// warnings.filterwarnings("ignore", category=MarkupResemblesLocatorWarning)

const check_404 = async (extracted_link) => {
  const url_link = extracted_link;
  let link_page_result = "N";

  // URL이 내부 인지 (ex .com)
  if (
    extracted_link.slice(0, 4).toLowerCase() !== "http" &&
    extracted_link.slice(0, 2).toLowerCase() !== "//"
  ) {
    url_link = "https://www.samsung.com" + extracted_link;
  }

  // 로 시작하는 ex) 이미지 서버
  else if (extracted_link.slice(0, 2).toLowerCase() == "//") {
    url_link = "https:" + extracted_link;
  }

  // 파일로 연결되는 경우 (ex. pdf)
  if (url_link.toLowerCase().endsWith(".pdf")) {
    try {
      const check_response = await axios.head(url_link, {
        allowRedirects: true,
        timeout: 5000,
      });
      if (check_response.status === 200) {
        link_page_result = "Y";
      } else {
        link_page_result = "N";
      }
    } catch (e) {
      // 굳이?
      if (e.response) {
        console.error("Error response from server(.pdf):", e.response.data);
      } else if (e.request) {
        console.error("Request failed(.pdf):", e.request);
      } else {
        console.error("Error(.pdf):", e.message);
      }
      link_page_result = "N";
    }
  }

  // 글로벌 링크로 연결시
  else if (url_link.toLowerCase().includes("www.samsung.com/global/")) {
    try {
      const { data } = await axios.get(url_link);
      const $check_html_all = cheerio.load(data);
      if (
        $check_html_all(
          "#content > div > div > div > div > div.cm-g-error-page"
        ).length > 0
      ) {
        link_page_result = "N";
      } else {
        link_page_result = "Y";
      }
    } catch (e) {
      if (e.response) {
        console.error(
          "Error response from server:(www.samsung.com/global/)",
          e.response.data
        );
      } else if (e.request) {
        console.error("Request failed:(www.samsung.com/global/)", e.request);
      } else {
        console.error("Error:(www.samsung.com/global/)", e.message);
      }
      link_page_result = "N";
    }
  } else if (url_link.toLowerCase().includes("shop.samsung.com/")) {
    link_page_result = "N/A";
  } else if (url_link.toLowerCase().includes("news.samsung.com/")) {
    try {
      const { data } = await axios.get(url_link, { allowRedirects: true });
      const $check_html_all = cheerio.load(data, { xmlMode: true });
      const check_text = $check_html_all("head > title").text();
      if (check_text.toLowerCase().slice(0, 14) === "page not found") {
        link_page_result = "N";
      } else {
        link_page_result = "Y";
      }
    } catch (e) {
      if (e.response) {
        console.error(
          "Error response from server(news.samsung.com/):",
          e.response.data
        );
      } else if (e.request) {
        console.error("Request failed(news.samsung.com/):", e.request);
      } else {
        console.error("Error(news.samsung.com/):", e.message);
      }
      link_page_result = "N";
    }
  } else if (url_link.toLowerCase().includes("community.samsung.com/")) {
    link_page_result = "N";
  } else if (url_link.toLowerCase().includes("design.samsung.com/")) {
    link_page_result = "N";
  } else if (url_link.toLowerCase().includes("csr.samsung.com/")) {
    link_page_result = "Y";
    const { data } = axios.get(url_link);
    const $check_html_all = cheerio.load(data, { xmlMode: true });
    const body_tag = $check_html_all("body");

    if (
      body_tag &&
      body_tag.attr("class") &&
      body_tag.attr("class").includes("errorPage")
    ) {
      link_page_result = "N";
    } else {
      try {
        const p_text = $check_html_all("p").text();
        const data = JSON.parse(p_text);
        if (data.status === 404) {
          link_page_result = "N";
        }
      } catch (error) {
        // node에선 AttrError가 타입에러로 발생함
        if (
          error instanceof TypeError ||
          error instanceof json.JSONDecodeError
        ) {
          // TypeError 또는 JSON 파싱 오류가 발생한 경우 PASS
        } else {
          console.error("Error(csr.samsung.com/):", error.message);
        }
      }
    }
  } else if (url_link.toLowerCase().includes("www.samsung.com/")) {
    try {
      const { data } = axios.get(url_link);
      const $check_html_all = cheerio.load(data);
      const errorPageElement = $check_html_all(
        "#content > div > div > div > div > div.cm-g-error-page"
      );
      if (errorPageElement.length > 0) {
        link_page_result = "N";
      } else {
        link_page_result = "Y";
      }
    } catch (e) {
      console.error("Error(www.samsung.com/):", error.message);
    }
  } else link_page_result = "N/A";

  return link_page_result;
};

const add_item = async (
  exl_ws,
  col_depth1,
  col_depth2,
  col_depth3,
  col_depth4,
  extracted_link,
  link_result
) => {
  const saved_item = [
    col_depth1,
    col_depth2,
    col_depth3,
    col_depth4,
    extracted_link,
    link_result,
  ];
  exl_ws.addRow(saved_item);
};

url_codes.forEach(async (url_code, index) => {
  const url = `https://www.samsung.com/${url_code}/`;
  const sitecode = url.split("/")[3];

  try {
    // Excel 워크북 생성
    const exl_wb = new Workbook();

    // 활성 시트 생성 및 이름 지정
    const exl_ws = exl_wb.addWorksheet("Home");

    // 헤더 데이터
    const exl_header = [
      "Location",
      "Main Menu",
      "Sub Menu",
      "Title",
      "URL",
      "Check",
    ];

    // 헤더 추가
    exl_ws.addRow(exl_header);

    // 열의 너비 설정
    exl_ws.columns = [
      { width: 10 }, // A열
      { width: 20 }, // B열
      { width: 25 }, // C열
      { width: 30 }, // D열
      { width: 50 }, // E열
      { width: 5 }, // F열
    ];

    // 그리드 라인 숨기기, A2 기준으로 고정
    exl_ws.views = [
      {
        showGridLines: false,
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
        topLeftCell: "A2",
      },
    ];

    const { data } = await axios.get(url);
    console.log(sitecode);
    const $ = cheerio.load(data, { xmlMode: true });
    const content_all = [];
    $(
      "#component-id > div.nv00-gnb__inner-wrap > div.nv00-gnb__l0-menu-wrap > ul"
    ).each((_, el) => {
      content_all.push(el);
    });

    let col_depth1 = "GNB";
    // Going to depth 1
    content_all.forEach((content_menu, _idx) => {
      const $ = cheerio.load(content_menu, { xmlMode: true });
      content_menu = [];
      $("li.nv00-gnb__l0-menu").each((_, el) => {
        content_menu.push(el);
      });

      let col_depth2 = "";
      // Going to depth 2
      content_menu.forEach((content_depth01, _idx) => {
        const $ = cheerio.load(content_depth01, { xmlMode: true });
        let content_depth01_title = $("button.nv00-gnb__l0-menu-btn");
        if (content_depth01_title.html() !== null) {
          content_depth01_title = content_depth01_title.first();
          console.log(content_depth01_title.text().trim());
          col_depth2 = content_depth01_title.text().trim();
        }
        content_depth01_title = $("a.nv00-gnb__l0-menu-link");
        if (content_depth01_title.html() !== null) {
          content_depth01_title = content_depth01_title.first();
          console.log(content_depth01_title.text().trim());
          col_depth2 = content_depth01_title.text().trim();
        }

        // Going to depth 3
        let col_depth3 = "";
        content_depth01 = [];
        $("div.nv00-gnb__l1-menu-wrap").each((_, el) => {
          content_depth01.push(el);
        });
        content_depth01.forEach((content_depth02, _idx) => {
          const $ = cheerio.load(content_depth02, { xmlMode: true });
          let content_depth02_title = $(
            "div > h3.nv00-gnb__l1-menu-btn"
          ).first();
          if (content_depth02_title.html() !== null) {
            console.log("-", content_depth02_title.text().trim());
            col_depth3 = content_depth02_title.text().trim();
          }

          content_depth02_title = $(
            "p.nv00-gnb__featured-products-thumbnail-title"
          ).first();
          if (content_depth02_title.html() !== null) {
            console.log("-", content_depth02_title.text().trim());
            col_depth3 = content_depth02_title.text().trim();
          }

          content_depth02 = [];
          $("li.nv00-gnb__l1-menu > a").each((_, el) => {
            content_depth02.push(el);
          });
          // MOBIE의 좌측 같이 하위 네비게이션이 없는 경우
          if (content_depth02.length > 0) {
            console.log("@@@@@@");
            content_depth02.forEach((content_depth03, _idx) => {
              let extracted_text = "";
              console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ \n");
              console.log(content_depth03);
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
});
