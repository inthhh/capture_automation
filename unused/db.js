const utility = require("./src/utility")
const {Client} = require("pg");
require("dotenv").config();

const dbQuery = (query) =>{

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.TEST_DB_NAME,
        password: 'tmdqor4143',
        port: process.env.DB_PORT
    })

    client.connect(err =>{
        if (err) {
            console.log(err)
            return err

        }
    });

    client.query(dbQuery).then((dbRes)=>{

        console.log(dbRes.rows)
        client.end()
        return dbRes.rows

    }).catch((e)=>{

        console.log(e.stack)
        client.end()
        return e.stack

    })

}

module.exports = {
    'dbQuery':dbQuery
}