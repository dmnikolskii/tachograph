import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
import {ReactComponent as Excel} from './excel.svg';
import Axios from 'axios'
import { useState, useEffect } from 'react';

var fileDownload = require('js-file-download');

const DOMAIN = "http://localhost:3001" // http://localhost:3001

function DownloadExcel() {
    console.log("Creating Excel");
    Axios.get(DOMAIN+'/api/getexcel', {         
        responseType: 'blob', // Important
    })
    .then((response) => {
        console.log("THIS IS AN EXCEL: " + response.data); 
        fileDownload(response.data, `Task Report.xlsx`);
    });

}

function Analytics() {
    const [analyticsRows, setAnalyticsRows] = useState([]);
    const [summaryRows, setSummarysRows] = useState([]);


    useEffect(() => {
        Axios.get(DOMAIN+'/api/analytics')
        .then((response) => {
            setAnalyticsRows(response.data.tasks);
            setSummarysRows(response.data.summary);
            console.log("THIS IS A RESPONSE: " + response.data); 
        });
    }, [])


    
    //console.log(analyticsRows);
    //className="wide_modal item_container"

    const summaryItems = summaryRows.map((row) =>
        <tr key={row.id} >
            <td>{row.name}</td>
            <td>{row.daily}</td>
            <td>{row.mtd}</td>
            <td>{row.ytd}</td>
        </tr>
    );

    const listItems = analyticsRows.map((row) =>
        <tr key={row.id} >
            <td>{row.employee_name}</td>
            <td>{row.task_description}</td>
            <td>{row.start}</td>
            <td>{row.finish}</td>
            <td>{row.period}</td>
            <td style={(row.finish_time && row.finish_time !== "-") ? {color: 'green'} : {color: 'red'}}>{(row.finish_time && row.finish_time !== "-") ? "Выполнено" : "В процессе"}</td>            
        </tr>
    );

    return (
        <div className="main">
            <Excel className="Excel_Button" onClick={()=>{DownloadExcel()}}></Excel>
            <header className="header">
                <Logo className="header img"></Logo>
            </header>
            <div className="wide_modal item_container">
            <table id="tasks">
                <thead>
                    <tr>
                        <th>Имя Сотрудника </th>
                        <th>День</th>
                        <th>Месяц</th>
                        <th>Год</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryItems}
                </tbody>
            </table>
            </div>

            <div className="wide_modal item_container">
            <table id="tasks">
                <thead>
                    <tr>
                        <th>Имя Сотрудника</th>
                        <th>Описание работы</th>
                        <th>Время начала</th>
                        <th>Время окончания</th>
                        <th>Длительность(мин.)</th>
                        <th>Статус</th>                    
                    </tr>
                </thead>
                <tbody>
                    {listItems}
                </tbody>
            </table>
            </div>
        </div>    
    )
}

export default Analytics
