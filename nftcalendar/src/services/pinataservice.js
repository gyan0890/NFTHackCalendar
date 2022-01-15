import axios from "axios";


export default class PinataService {
    static url = "https://api.pinata.cloud/data/pinList?pageLimit=365";

    static async getPinataStorage() {
       
        const headers = {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            'pinata_api_key': apikey,
            'pinata_secret_api_key': secret
        }

        return axios.get(this.url, { headers })
    }
}