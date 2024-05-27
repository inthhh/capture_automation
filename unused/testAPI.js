// const express = require('express')
// const methodOverride = require('method-override')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express()
// const router = express.Router()
// const port = 3001
// require("dotenv").config();
// const utility = require('./src/utility')
// // const {client} = require("./config/db.config");
// const { Client } = require("pg");




// app.listen(port)
// app.use(cors({
//     origin: "*",
//     credentials:true
// }))
// app.use(methodOverride('X-HTTP-Method-Override'))
// app.use(bodyParser.json())
// console.log("==================================================")
// console.log("============                          ============")
// console.log(`============ SERVER LISTENING ON ${port} ============`)
// console.log("============                          ============")
// console.log("==================================================")


// app.get('/', (req,res)=>{
//     let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//     console.log(`${new Date()} : Request [GET]/ from ${clientIp}`)
//     return res.status(200).send("QA Automation Server Listening on 3000(PTK-Division2-DSG-Team6 Lob)")
// })



// app.get('/api/v1/raw-data', cors(), (req,res)=>{
//     // const {client} = require("./config/db.config")

//     const client = new Client({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASS,
//         port: process.env.DB_PORT
//     })

//     client.connect(err =>{
//         if (err) {
//             return res.status(400).json({
//                 'status':400,
//                 'msg':'FAIL',
//                 'data':'Failed to connect DB ' + err}
//             )
//         }
//     });
//     let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

//     // const client = new DB()
//     const dateNow = utility.getToday
//     const selectQuery = `SELECT * FROM qa_result Where date = $1;`
//     const siteCode = req.query['site-code']
//     const checkResult = req.query['check-result']
//     const date = req.query['date']

//     console.log(`${new Date()} : Request [GET]/api/v1/raw-data from ${clientIp}`)
//     if (siteCode || checkResult || date) {
//         const filteredSelectQuery = `SELECT * FROM qa_result Where ($1::text IS NULL OR site_code = $1::text) AND ($2::text IS NULL OR check_result = $2::text) AND ($3::date IS NULL OR date = $3::text);`
//         client.query(filteredSelectQuery, [siteCode || null, checkResult || null, date || null]).then((dbRes)=>{
//             client.end()
//             res.status(200).json({
//                 'status':200,
//                 'msg': 'OK' ,
//                 'data' : dbRes.rows
//             })

//         }).catch((e)=>{
//             console.error(e.stack)
//             client.end()
//             res.status(400).json({
//                 'status':400,
//                 'msg':'FAIL',
//                 'data':e.stack
//             })
//         })
//         return res
//     }


//     client.query(selectQuery,[dateNow]).then((dbRes)=>{
//         client.end()
//         res.status(200).json({
//             'status':200,
//             'msg': 'OK' ,
//             'data' : dbRes.rows
//         })

//     }).catch((e)=>{
//         console.error(e.stack)
//         client.end()
//         res.status(400).json({
//             'status':400,
//             'msg':'FAIL',
//             'data':e.stack
//         })
//     })
//     return res
// })


// app.post('/api/v1/raw-data/', cors(), (req,res)=>{


//     const client = new Client({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.TEST_DB_NAME,
//         password: process.env.DB_PASS,
//         port: process.env.DB_PORT
//     })

//     client.connect(err =>{
//         if (err) {
//             return res.status(400).json({
//                 'status':400,
//                 'msg':'FAIL',
//                 'data':'Failed to connect DB ' + err}
//             )
//         }
//     });
//     let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//     console.log(`${new Date()} : Request [PATCH]/api/v1/raw-data from ${clientIp}`)
//     const rawDataId = req.params.id
//     const {siteCode, contents, checkResult, checkReason} = req.body

//     let insertQuery = `INSERT INTO qa_result (site_code, contents, check_reason, checkResult) values ($1, $2, $3, $4 );`
//     let queryParams = [siteCode, contents, checkReason, checkResult]

//     if (checkResult == "N" && !checkReason) {
//         return res.status(400).json({
//             'status':400,
//             'msg':'FAIL',
//             'data':'checkResult이 N일 경우, CheckReason 이 필수입니다.'
//         })
//     }

//     if (checkResult == "Y") {
//         queryParams = [checkResult, '', rawDataId];
//     }


//     client.query(updateQuery,queryParams).then((dbRes)=>{
//         client.end()

//         res.status(200).json({
//             'status':200,
//             'msg': 'OK',
//             'data' : dbRes.rows
//         })

//     }).catch((e)=>{

//         console.error(e.stack)
//         res.status(400).json({
//             'status':400,
//             'msg':'FAIL',
//             'data':e.stack
//         })
//     })
//     return res
// })

// app.patch('/api/v1/raw-data/:id', cors(), (req,res)=>{
//     let logMsg = '[PATCH]'

//     const client = new Client({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.TEST_DB_NAME,
//         password: process.env.DB_PASS,
//         port: process.env.DB_PORT
//     })

//     client.connect(err =>{
//         if (err) {
//             return res.status(400).json({
//                 'status':400,
//                 'msg':'FAIL',
//                 'data':'Failed to connect DB ' + err}
//             )
//         }
//     });
//     let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//     console.log(`${new Date()} : Request [PATCH]/api/v1/raw-data from ${clientIp}`)
//     const rawDataId = req.params.id
//     const {checkResult, checkReason} = req.body

//     let updateQuery = `UPDATE qa_result SET check_result = $1, check_reason = $2 WHERE id = $3 RETURNING *;`
//     let queryParams = [checkResult, checkReason, rawDataId]

//     if (checkResult == "N" && !checkReason) {
//         return res.status(400).json({
//             'status':400,
//             'msg':'FAIL',
//             'data':'checkResult이 N일 경우, CheckReason 이 필수입니다.'
//         })
//     }

//     if (checkResult == "Y") {
//         queryParams = [checkResult, '', rawDataId];
//     }


//     client.query(updateQuery,queryParams).then((dbRes)=>{
//         client.end()

//         res.status(200).json({
//             'status':200,
//             'msg': 'OK',
//             'data' : dbRes.rows
//         })

//     }).catch((e)=>{

//         console.error(e.stack)
//         res.status(400).json({
//             'status':400,
//             'msg':'FAIL',
//             'data':e.stack
//         })
//     })
//     return res
// })