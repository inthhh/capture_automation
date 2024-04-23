const http = require("http");
require("dotenv").config();

const getRawData = async (date="", siteCode="", checkResult="") =>{
    let targetURI = `${process.env["RAW_DATA_API_END_POINT"]}:${process.env["RAW_DATA_API_PORT"]}${process.env["RAW_DATA_API_ROUTER"]}?date=${date}&site-code=${siteCode}&check-result=${checkResult}`
    console.log(targetURI)
    await http.get(targetURI, (res)=>{
        const { statusCode } = res;
        let error;

        if (statusCode != 200) return new Error(`Request Failed. Status Code: ${statusCode}`)

        res.setEncoding('utf8')
        let result;
        res.on('data', (chunk)=>{
            result += chunk;
        })
        console.log(result)
    })

}

getRawData("2024-04-18", "us", "N")


//
//
//
// module.exports = {
//     "getRawData":getRawData
// }