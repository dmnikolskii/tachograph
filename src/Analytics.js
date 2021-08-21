import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
import {ReactComponent as Excel} from './excel.svg';
import Axios from 'axios'
import { useState } from 'react';

var loadAnalytics = true;

function getAnalytics(setAnalyticsRows) {
    Axios.get('http://localhost:3001/api/analytics')
    .then((response) => {
        setAnalyticsRows(response.data);
        console.log(response.data);
    });    
}

function DownloadExcel() {

}

function Analytics() {
    const [analyticsRows, setAnalyticsRows] = useState([]);

    if (loadAnalytics) getAnalytics(setAnalyticsRows);
    loadAnalytics = false;

    console.log(analyticsRows);
    //className="wide_modal item_container"

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
                        <th>Длительность (мин.)</th>
                        <th>Статус</th>                    
                    </tr>
                </thead>

                {listItems}
            </table>
            </div>
        </div>    
    )
}

export default Analytics
