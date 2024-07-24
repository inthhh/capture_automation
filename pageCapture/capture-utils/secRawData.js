const http = require("http");
require("dotenv").config();
const axios = require("axios")

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