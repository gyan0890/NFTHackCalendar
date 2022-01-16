import axios from "axios";


export default class PinataService {
    static url = "https://api.pinata.cloud/data/pinList?pageLimit=365";

    static async getPinataStorage() {
        const apikey = 'dc5687c5d5430bf00519';
        const secret = '3cd065362925cb71194af28112954f28562421dec986a66a6c1dcb5c7fe3f576';
        const headers = {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            'pinata_api_key': apikey,
            'pinata_secret_api_key': secret
        }

        return axios.get(this.url, { headers })
    }
}