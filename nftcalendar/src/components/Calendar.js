import React, { useState } from 'react';
import * as dateFns from 'date-fns';
import "../styles/calendar.scss"
function Calendar() {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
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

        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
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
                                        <img  height="400" src={require('../img/stock.jpg')} />
                                    </span>
                                </div>

                                <div className="nft__item_info">
                                    <span >
                                        <h4>asdfasf</h4>
                                    </span>
                                    <div className="nft__item_price">
                                        2 ETH<span>1/20</span>
                                    </div>
                                    <div className="nft__item_action">
                                        <span>Place a bid</span>
                                    </div>
                                    <div className="nft__item_like">
                                        <i className="fa fa-heart"></i><span>50</span>
                                        <span className="number">{formattedDate}</span>
                                        <span className="bg">{formattedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
            }
<span className="number">{formattedDate}</span>
                                        <span className="bg">{formattedDate}</span>

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