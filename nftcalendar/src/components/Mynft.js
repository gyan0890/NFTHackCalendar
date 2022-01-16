import React, { useEffect, useState } from 'react';
import * as dateFns from 'date-fns';
import SalePopUp from "./SalePopup";
import {
    Modal, Button, Container, Card
} from 'react-bootstrap';
import ContractService from "../services/contractservice";
import * as _ from 'lodash';

import PinataService from '../services/pinataservice';
// import { Card, Button } from 'react-bootstrap';
function MyNft(props) {
    const [wallet, setwallet] = useState(null);
    const [nfts, setNFTS] = useState([])

    useEffect(async () => {
        if (wallet) {
            const data = await PinataService.getPinataStorage();


            let contranctdata = await ContractService.getAllNFT(wallet);
            contranctdata = contranctdata.filter(d => {
                console.log(d.tokenOwner);
                if (d.tokenId == 4 || d.tokenId == 0) {
                    return d;
                }
            });
            const filteredNFTS = [];
            contranctdata.forEach(elm => {
                const tokenhash = elm.tokenURI.split("/")[4];
                if (tokenhash) {
                    const filtered = data.data.rows.filter(d => d.ipfs_pin_hash == tokenhash);
                    if (filtered && filtered.length > 0) {
                        filtered[0].contrancttokenid = elm.tokenId;
                        filteredNFTS.push(filtered[0]);
                    }
                }
            });
            setNFTS(filteredNFTS);
        }
    }, [wallet])

    const renderbody = (data) => {

        if (props.wallet && props.wallet[0] && !wallet) {
            setwallet(props.wallet[0]);
        }
        return (<Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>);
    }
    return (
        <>{nfts.map(d => renderbody(d))}</>

    );
}

export default MyNft;