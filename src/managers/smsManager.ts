import https from "https";
import { HTTP_STATUS_CODE } from "../input-output-types/types";
import { isError } from "util";

const api_key: string = 'bdfjnh-x5:2f3!8b8-7s4H5z7W2e0F828'
const host: string = 'https://smsc.kz/rest/send/'
const login: string = 'tembingol'
const password: string = 'E8x-AZX-h9Y-wmz'



export const smsManager = {

    async sendSMS(phoneNumber: string, message: string) {

        const sendSMSresult = {
            result: true,
            message: 'SMS sent successfully'
        }

        console.log('phoneNumber:', phoneNumber);
        console.log('message:', message);

        const url = `https://smsc.kz/sys/send.php?login=${login}&psw=${password}&phones=${phoneNumber}&mes=${message}`
        console.log('url:', url);

        await https.get(url, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                sendSMSresult.result = data.includes('ERROR')
                sendSMSresult.message = data
                console.log('body:', data);
            });

        })

        return sendSMSresult

    },


}