import Web3 from "web3";


export default class WalletService {
    static async connectwallet() {
        const web3 = new Web3(Web3.givenProvider);
        return web3.eth.requestAccounts();
    }
}