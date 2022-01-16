import ABI from "./abi"
import web3 from "web3";
import WalletService from "./wallet";
export default class ContractService {
    contractaddress = "0x1BB5b4752031c3A3e1149998A05D442e63F360F4";

    static async getAllNFT() {
        const web3service = WalletService.getWet3Object();

        window.contract = await new web3service.eth.Contract(ABI, "0x1BB5b4752031c3A3e1149998A05D442e63F360F4");

        const transactionParameters = {
            to: "0x1BB5b4752031c3A3e1149998A05D442e63F360F4", // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
        };
        return window.contract.methods.getNftData().call();


    };

    static async buyNFT(walletaddress, tokenId) { 
        
    }
}


