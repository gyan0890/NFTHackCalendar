import ABI from "./abi"
import web3 from "web3";
import WalletService from "./wallet";

import * as BN from "bn.js";
export default class ContractService {
    contractaddress = "0x1BB5b4752031c3A3e1149998A05D442e63F360F4";

    static async getAllNFT() {
        const web3service = WalletService.getWet3Object();
        window.contract = await new web3service.eth.Contract(ABI, "0x1BB5b4752031c3A3e1149998A05D442e63F360F4");
        return window.contract.methods.getNftData().call();

    };

    static async buyNFT(walletaddress, tokenId) {
        alert(tokenId)
        const web3service = WalletService.getWet3Object();
        window.contract = await new web3service.eth.Contract(ABI, "0x1BB5b4752031c3A3e1149998A05D442e63F360F4");
        const multiplyconstanct = 1000000000000000000;
        const stockPrice = 1 * multiplyconstanct;
        const bnValue = new BN(stockPrice.toString());
        const transactionParameters = {
            to: "0x1BB5b4752031c3A3e1149998A05D442e63F360F4", // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            data: window.contract.methods
                .buyNft(tokenId, "0x1BB5b4752031c3A3e1149998A05D442e63F360F4")
                .encodeABI(),
            value: bnValue.toString("hex")
        };

        try {
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });
            alert("keep eye on explorer: txt" + txHash)
        } catch (error) {
            debugger;
        }
        // return window.contract.methods.getNftData().call();

    }
}


