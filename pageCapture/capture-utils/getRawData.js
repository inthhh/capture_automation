const http = require("http");
require("dotenv").config();
const axios = require("axios")

/**
 * 냅튠 API에서 fail data를 불러오고, 전처리 과정을 거쳐 저장합니다.
 * @param {date} date 
 * @param {string} siteCode 
 * @param {string(Y/N)} checkResult 
 * @param {string(Desktop/Mobile)} Desc 
 * @returns 
 */
const getRawData = async (date="", siteCode="", checkResult="", Desc="") =>{
    
    // API에서 전체 데이터를 받아옴
    let targetURI = `${process.env["RAW_DATA_API_END_POINT"]}${process.env["RAW_DATA_API_ROUTER"]}?date=${date}&site-code=${siteCode}&check-result=${checkResult}`
    
    try {
        const { data } = await axios.get(targetURI);
        const failImgArr = data.data.map((obj, idx) => {
            // Desktop ver일 때, Mobile 요소는 제외
            if(Desc == "Desktop"){
                if(obj.description != "Mobile"){
                    return {
                        title: obj.title,
                        desc: obj.description,
                        key: obj.key,
                        area: obj.area,
                        contents: (obj.contents&&obj.contents.includes("https://") ? (obj.contents.replace("https://", "")) : (obj.contents))
                    };
                }
                else return null;
            } 
            // Mobile ver일 때, Desktop 요소는 제외
            else if(Desc == "Mobile"){
                if(obj.description != "Desktop"){
                    return {
                        title: obj.title,
                        desc: obj.description,
                        key: obj.key,
                        area: obj.area,
                        contents: (obj.contents&&obj.contents.includes("https://") ? (obj.contents.replace("https://", "")) : (obj.contents))
                    };
                }
                else return null;
            }
            else return null;
        })

        return failImgArr.filter(Boolean);

    } catch (e) {
        console.error(e)
    }
}

module.exports = getRawData