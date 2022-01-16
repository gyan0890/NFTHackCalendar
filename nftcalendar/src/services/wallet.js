import Web3 from "web3";


export default class WalletService {
    // static contractaddress = "0x25b1D7C9290E9Cf81747Ba2601bEa44cc6Cf0d63";
    static async connectwallet() {
        const web3 = new Web3(Web3.givenProvider);
        return web3.eth.requestAccounts();
    }

    static getWet3Object() {
        return new Web3(Web3.givenProvider);
    }


}