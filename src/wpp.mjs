import wwjs from "whatsapp-web.js"
import * as qrcode from 'qrcode'
import fs from 'fs'
import path from 'path'
export class Wpp {
    constructor(config_folder) {
        this.config_folder = path.resolve(config_folder??"./tmp_data")
        this.ready = false
        this.client = new wwjs.Client({
            puppeteer: {
                userDataDir: path.resolve(this.config_folder,"browser_data"),
                headless: "new",
                args: ['--no-sandbox'],
            }
        })
        console.log(this.config_folder)
        this.client.on('qr', (qr) => {
            console.log('creating qrcode')
            if (!fs.existsSync(this.config_folder)) fs.mkdirSync(this.config_folder)
            qrcode.toFile(path.resolve(this.config_folder,(new Date()).getTime() + 'qr.png'), qr, (err) => {
                if (err) {
                    console.log('impossible to write qrcode')
                    console.log(err)
                }
            })
        })
    }

    async init() {
        try {
            console.log('initializing')
            this.client.on('ready', () => {
                console.log('whatsapp ready')
                this.ready = true
                // resolve(true)
            })
            this.client.on('auth_failure', () => {
                console.log('whatsapp failure')
                // err(false)
            })
            this.client.initialize()
        } catch (error) {
            console.log(error)
        }


    }
    /**
     * 
     * @param {{file:string,message:string}} message 
     * @param {string} togroup 
     */
    async sendMessageToGroup(message, togroup) {
        let selected = await this.getGroupByName(togroup)
        if (selected) {
            console.log("sending message to group \"" + togroup + "\"")

            await selected.sendMessage(message)
        }
    }
    async sendFileToGroup(file, message, togroup) {
        let selected = await this.getGroupByName(togroup)
        let toSend = /^http(s|:)/.test(file) ? await wwjs.MessageMedia.fromUrl(file) : wwjs.MessageMedia.fromFilePath(file)
        if (selected) {
            console.log("sending media message to group \"" + togroup + "\"")

            await selected.sendMessage(toSend, { caption: message })
        }
    }
    async sendFileToNumber(file, message, number) {
        let n = Wpp.formatNumber(number)
        let toSend = /^http(s|:)/.test(file) ? await wwjs.MessageMedia.fromUrl(file) : wwjs.MessageMedia.fromFilePath(file)

        console.log("sending media message to number \"" + n + "\"")

        await this.client.sendMessage(n, toSend, { caption: message })

    }
    async sendMessageToNumber(message, number) {
        let n = Wpp.formatNumber(number)
        console.log("sending message to number \"" + n + "\"")
        await this.client.sendMessage(n, message)
    }
    async getGroupByName(name) {
        let chats = await this.client.getChats()
        let groups = chats.filter(each => each.isGroup == true)
        let selected = groups.filter(each => each.name == name)[0]
        return selected
    }

    static formatNumber(num) {
        let n = num
        if (num.length > 12) {
            let dddPlus = num.slice(0, 4)
            let content = num.slice(5, num.length)
            n = dddPlus + "" + content
        }
        n += "@c.us"
        return n
    }

}