//imports needed for this function
//dc5687c5d5430bf00519

//API Secret
//3cd065362925cb71194af28112954f28562421dec986a66a6c1dcb5c7fe3f576


const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

pinFileToIPFS = async(_month, _date) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const fileName = _month+_date+'.png';

    console.log(fileName);
    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(fileName));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            month: _month,
            date: _date
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: "dc5687c5d5430bf00519",
                pinata_secret_api_key: "3cd065362925cb71194af28112954f28562421dec986a66a6c1dcb5c7fe3f576"
            }
        });
};

pinataFunction = async() => {

try {
    for(let counter = 1; counter < 29; counter++) {
        const data = await pinFileToIPFS("Feb", counter);
    }
} catch(error) {
    console.error(error);
    console.error("Could not pin");
}
}

pinataFunction()
