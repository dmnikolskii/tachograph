import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
import {ReactComponent as Excel} from './excel.svg';
import Axios from 'axios'
import { useState, useEffect } from 'react';


function DownloadExcel() {
    console.log("Creating Excel");
    Axios.get('http://localhost:3001/api/getexcel')
    .then((response) => {
        console.log("THIS IS AN EXCEL: " + response.data); 
    });

}

function Analytics() {
    const [analyticsRows, setAnalyticsRows] = useState([]);
    const [summaryRows, setSummarysRows] = useState([]);


    useEffect(() => {
        Axios.get('http://localhost:3001/api/analytics')
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
            <td>{row.start_time}</td>
            <td>{row.finish_time}</td>
            <td>{row.period}</td>
            <td style={row.finish_time ? {color: 'green'} : {color: 'red'}}>{row.finish_time ? "Выполнено" : "В процессе"}</td>            
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
