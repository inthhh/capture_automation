const http = require("http");
require("dotenv").config();
const axios = require("axios")

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