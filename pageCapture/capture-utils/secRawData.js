const http = require("http");
require("dotenv").config();
const axios = require("axios")

/**
 * 냅튠 API에서 sec의 data를 불러오고, 전처리 과정을 거쳐 Badge 정보를 저장합니다. (sec ver)
 * @param {*} date 
 * @param {*} siteCode 
 * @returns 
 */
const getSecRawData = async (date="", siteCode="") =>{
    
    // API에서 전체 데이터를 받아옴
    let targetURI = `${process.env["RAW_DATA_API_END_POINT"]}${process.env["RAW_DATA_API_ROUTER"]}?date=${date}&site-code=${siteCode}`
    
    try {
        const { data } = await axios.get(targetURI);
        const failImgArr = data.data.map((obj, idx) => {
            // Badge만 수집
            if(obj.description == "Badge"){
                console.log(obj.key, obj.contents)
                return {
                    key: obj.key,
                    area: obj.area,
                    contents: obj.contents
                };
            } 
            else return null;
        })

        return failImgArr.filter(Boolean);

    } catch (e) {
        console.error(e)
    }
}

module.exports = getSecRawData