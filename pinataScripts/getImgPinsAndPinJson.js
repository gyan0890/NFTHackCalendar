const axios = require('axios');

const userPinList = (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=50`;
    return axios
        .get(url, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
};

const pinJSONToIPFS = (pinataApiKey, pinataSecretApiKey, JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
};

getPinsFunction = async() => {
    const data = await userPinList("dc5687c5d5430bf00519", "3cd065362925cb71194af28112954f28562421dec986a66a6c1dcb5c7fe3f576");
    let rows = data.data.rows;
    //console.log(data.data);
    for(const row of rows) {
        //console.log(row.ipfs_pin_hash);
        //console.log(row.metadata);
        let _month = row.metadata.keyvalues.month
        let _date = row.metadata.keyvalues.date
        let _year = "2022"
        let _description = "This is a one of a kind NFT belonging to the 2022 calendar"
        let _name = _month +  _date + 'meta'
        let JSONBody = {
                pinataMetadata: {
                    name:_name ,
                    keyvalues: {
                        imageHash: "https://gateway.pinata.cloud/ipfs/"+row.ipfs_pin_hash,
                        description: _description,
                        date: _date,
                        month: _month,
                        year: _year,
                    }
                },
                pinataContent: {
                    name:_name ,
                    keyvalues: {
                        imageHash: "https://gateway.pinata.cloud/ipfs/"+row.ipfs_pin_hash,
                        description: _description,
                        date: _date,
                        month: _month,
                        year: _year,
                    }
                }
            
        }
        const metaResponse = await pinJSONToIPFS("dc5687c5d5430bf00519", "3cd065362925cb71194af28112954f28562421dec986a66a6c1dcb5c7fe3f576", JSONBody);
        console.log("Done")
    }
}

getPinsFunction()