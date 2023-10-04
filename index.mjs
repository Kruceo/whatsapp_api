import express from 'express'
import { Wpp } from "./src/wpp.mjs"

const app = express()

const cf = (()=>{
    const ind = process.argv.indexOf('-cf')
    if(ind != -1)return process.argv[ind + 1]
})()
console.log("using config folder: "+(cf??"./tmp_data"))

const wpp = new Wpp(cf)

app.use(express.json())

app.post('/private/send/message', async (req, res) => {
    /**
     * @type {{text,number}}
     */
    let { message, number } = req.body
    if (!message || !number) {

        res.statusCode = 401
        res.send({ success: false, message: "number or message are null." })
        return;
    }
    try {
        await wpp.sendMessageToNumber(message, number)
        res.send({ success: true, message: "message sent" })
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ success: false, message: error })
    }
})
app.post('/group/send/message', async (req, res) => {
    /**
     * @type {{text,number}}
     */
    let { message, name } = req.body
    if (!message || !name) {

        res.statusCode = 401
        res.send({ success: false, message: "name or message are null." })
        return;
    }
    try {
        await wpp.sendMessageToGroup(message, name)
        res.send({ success: true, message: "message sent" })
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ success: false, message: error })
    }
})

app.post('/private/send/file', async (req, res) => {
    /**
     * @type {{file,text,number}}
     */
    let { file, message, number } = req.body
    console.log(req.body)
    if (!number || !file) {

        res.statusCode = 401
        res.send({ success: false, message: "number or file are null." })
        return;
    }
    try {
        await wpp.sendFileToNumber(file, message, number)
        res.send({ success: true, message: "file sent" })
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ success: false, message: error })
    }
})

app.post('/group/send/file', async (req, res) => {
    /**
     * @type {{file,text,number}}
     */
    let { file, message, name } = req.body
    console.log(req.body)
    if (!name || !file) {

        res.statusCode = 401
        res.send({ success: false, message: "name or file are null." })
        return;
    }
    try {
        await wpp.sendFileToGroup(file, message, name)
        res.send({ success: true, message: "file sent" })
        return;
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.send({ success: false, message: error })
    }
})

// app.get('/on/message/stream', async (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Transfer-Encoding', 'chunked');
//     wpp.client.on('message', (message) => {
//         res.write(JSON.stringify({
//             message
//         }))
//     })
// })
// app.get('/on/message', async (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     // res.setHeader('Transfer-Encoding', 'chunked');
//     wpp.client.on('message', (message) => {
//         res.send(JSON.stringify({
//             message
//         }))
//     })
// })
await wpp.init()
app.listen("8080", () => {
    console.log('server listen 8080')
})


