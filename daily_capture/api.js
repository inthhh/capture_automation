const http = require("http");
require("dotenv").config();
const axios = require("axios")

const getRawData = async (date="", siteCode="", checkResult="") =>{
    let targetURI = `${process.env["RAW_DATA_API_END_POINT"]}${process.env["RAW_DATA_API_ROUTER"]}?date=${date}&site-code=${siteCode}&check-result=${checkResult}`

    try {
        const { data } = await axios.get(targetURI);
        const failImgArr = data.data.map((obj, idx) => {
            return obj.contents.includes("https://") ? (obj.contents.replace("https://", "")) : undefined;
        })

        // console.log(failImgArr.filter(Boolean));
        return failImgArr.filter(Boolean);
    } catch (e) {
        console.error(e)
    }
}

module.exports = getRawData