import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
import './App.css';
import Axios from 'axios'
import { useState, useEffect} from 'react';
import { useLocation } from 'react-router';


function getName(setEmployee, setTask, location) {

    Axios.get('http://localhost:3001/name' + location.pathname)
    .then((response) => {
        console.log(response.data);
        setEmployee(response.data.employee);
        setTask(response.data.employee.active ? response.data.task.task_description : "");
    });
}

function start(setEmployee, employee, task) {
    let query = {...employee, active: 1, task: task};
    Axios.post('http://localhost:3001/api/start', {query : query})
    .then((response) => {
        console.log(task)
        console.log(response.data);
        setEmployee(response.data[0]);
    });    
}

function stop(setEmployee, employee) {
    let query = {...employee, active: 0};
    Axios.post('http://localhost:3001/api/stop', {query : query})
    .then((response) => {
        console.log(response.data);
        setEmployee(response.data[0]);
    });        
}

function MainPage() {
    const [employee, setEmployee] = useState({})
    const [task, setTask] = useState("")
    const [enabled, setEnabled] = useState(true)
    const location = useLocation();

    useEffect(()=>{
        getName(setEmployee, setTask, location)
    }, [location]
    );

    return (
        <div className="App">
        <header className="App-header">
            <div className="Container">
            <Logo className="logo"></Logo>
            <h1>{employee.name}</h1>
            <textarea className="TaskDescription" placeholder="Опишите планируемую задачу" readOnly={employee.active} value={task} onChange={(e)=>{setTask(e.target.value); 
                                                                                                                                                setEnabled(e.target.value.length > 10);}}></textarea>
            <button className="Button Green" disabled={(employee.active + !enabled) ? true : false} onClick={()=>{start(setEmployee, employee, task)}}>Старт</button>
            <button className="Button Red" disabled={!employee.active} onClick={()=>{stop(setEmployee, employee); setTask("");}}>Стоп</button>
            </div>
        </header>
    </div>    
    )
}

export default MainPage
