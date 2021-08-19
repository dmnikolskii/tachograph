import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
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

function Analytics() {
    const [analyticsRows, setAnalyticsRows] = useState([]);

    if (loadAnalytics) getAnalytics(setAnalyticsRows);
    loadAnalytics = false;

    console.log(analyticsRows);

    const listItems = analyticsRows.map((row) =>
        <div key={row.id}>
            <div>{row.employee_name}</div>
            <div>{row.task_description}</div>
            <div>{row.start_time}</div>
            <div>{row.finish_time}</div>
                <div>
                    {row.period}
                </div>
        </div>
    );

    return (
        <div className="App">
            <header className="App-header">
                <div className="Container">
                <Logo className="logo"></Logo>
                {listItems}
                </div>
            </header>
        </div>    
    )
}

export default Analytics
