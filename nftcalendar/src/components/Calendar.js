import React, { useEffect, useState } from 'react';
import * as dateFns from 'date-fns';
import SalePopUp from "./SalePopup";
import { Modal, Button } from 'react-bootstrap';

import * as _ from 'lodash';
import "../styles/calendar.scss"
import PinataService from '../services/pinataservice';
function Calendar(props) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [nfts, setNfts] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(async () => {
        try {
            const data = await PinataService.getPinataStorage();
            setCurrentMonth(dateFns.addMonths(currentMonth, 1))
            const pinatanfts = formatDataInMap(data.data.rows);
        } catch (error) {
            console.error('something went wrong getting from pinata')
        }
    }, [])

    const formatDataInMap = (data) => {
        const map = {};
        const transformed = {};
        data.forEach(d => {
            const kv = d.metadata.keyvalues
            const fdate = new Date(kv.date + "/" + kv.month + "/" + kv.year);
            map[fdate] = d;
        })
        const keys = Object.keys(map)
            .sort((d1, d2) => new Date(d1.date).getTime() - new Date(d2.date).getTime())
            .forEach(d => {
                transformed[d] = map[d];
            })
        setNfts(transformed)
    }


    const renderHeader = () => {

        const dateFormat = "MMM-yy";
        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={prevMonth}>
                        chevron_left
                    </div>
                </div>
                <div className="col col-center">
                    <span>
                        {dateFns.format(currentMonth, dateFormat)}
                    </span>
                </div>
                <div className="col col-end" onClick={nextMonth}>
                    <div className="icon">chevron_right</div>
                </div>
            </div>
        );

    }
    const renderDays = () => {
        const dateFormat = "EEEE";
        const days = [];
        let startDate = dateFns.startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }
    const renderCells = () => {
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);
        const pinataurl = "https://gateway.pinata.cloud/ipfs/";
        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
                const meta = nfts[day];
                let imageurl = require('../img/stock.jpg');
                if (meta) {
                    imageurl = pinataurl + meta.metadata.keyvalues.imageHash;
                }
                days.push(
                    <div
                        className={`col cell ${!dateFns.isSameMonth(day, monthStart)
                            ? "disabled"
                            : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
                        key={day}
                        onClick={() => { onDateClick(cloneDay) }}
                    >
                        {dateFns.isSameMonth(day, monthStart) &&
                            <div className="col-lg-3 col-sm-6 col-xs-12">

                                <div className="nft__item m-0">

                                    <div className="nft__item_wrap">
                                        <span>
                                            <img height="400" src={imageurl} />
                                        </span>
                                    </div>

                                    <div className="nft__item_info">
                                        <span >
                                            <h4>{meta ? meta.metadata.keyvalues.name : "NA"}</h4>
                                        </span>
                                        <div className="nft__item_price">
                                            2 ETH
                                        </div>
                                        <div className="nft__item_action" >
                                            <button onClick={handleShow}>Buy</button>
                                        </div>

                                        {/* <Modal show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Modal heading</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                                <Button variant="primary" onClick={handleClose}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal> */}

                                        <div className="nft__item_like">
                                            {/* <i className="fa fa-heart"></i><span>50</span>*/}
                                            <span className="number">{formattedDate}</span> 
                                            <span className="bg">{formattedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                       

                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    const onDateClick = (day) => { setSelectedDate(day) }
    const nextMonth = () => {
        setCurrentMonth(dateFns.addMonths(currentMonth, 1));
    }
    const prevMonth = () => {
        setCurrentMonth(dateFns.subMonths(currentMonth, 1));
    }
    return (
        <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}

export default Calendar;