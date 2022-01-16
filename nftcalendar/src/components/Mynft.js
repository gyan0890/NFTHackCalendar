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
    const [wallet, setwallet] = useState(null)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(async () => {
        if (wallet) {
            const data = await PinataService.getPinataStorage();


            let contranctdata = await ContractService.getAllNFT(wallet);
            contranctdata = contranctdata.filter(d => d.tokenOwner == wallet);
            debugger;
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
        }
    }, [wallet])

    const renderbody = (data) => {

        if (props.wallet && props.wallet[0] && !wallet) {
            debugger;
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
                <div className='fl'>
                    <Button variant="primary m-1" onClick={handleShow}>Personalize</Button>
                    <Button variant="primary m-1">Set Sale</Button>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Personalize</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Title</label>
                                <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Title" />

                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Description</label>
                                <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Description" />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlFile1">Upload customized image</label>
                                <input type="file" class="form-control-file" id="exampleFormControlFile1" />
                            </div>

                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>

                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer> */}
                </Modal>
            </Card.Body>
        </Card>)
    }
    return (
        <>{renderbody()}</>

    );
}

export default MyNft;