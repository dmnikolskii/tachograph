import React from 'react'
import {ReactComponent as Logo} from './Pepsico_logo.svg';
import './App.css';
import Axios from 'axios'
import { useState, useEffect} from 'react';
import { useLocation } from 'react-router';
import { useRef } from 'react';

const DOMAIN = "" // http://localhost:3001

function getName(setEmployee, setTask, name) {

    Axios.get(DOMAIN+'/name/' + name)
    .then((response) => {
        console.log(response.data);
        setEmployee(response.data.employee);
        setTask(response.data.employee.active ? response.data.task.task_description : "");
    });
}

function start(setEmployee, employee, task) {
    let query = {...employee, active: 1, task: task};
    Axios.post(DOMAIN+'/api/start', {query : query})
    .then((response) => {
        console.log(task)
        console.log(response.data);
        setEmployee(response.data[0]);
    });    
}

function stop(setEmployee, employee) {
    let query = {...employee, active: 0};
    Axios.post(DOMAIN+'/api/stop', {query : query})
    .then((response) => {
        console.log(response.data);
        setEmployee(response.data[0]);
    });        
}

const useQueryParam = (paramName) => {
    const query = new URLSearchParams(useQuery());
    const param = query.get(paramName);
   
    function useQuery() {
     return new URLSearchParams(useLocation().search);
    }
   
    return param
   }

function MainPage() {
    const [employee, setEmployee] = useState({})
    const [task, setTask] = useState("")
    const [enabled, setEnabled] = useState(false)
    const inputRef = useRef(task);

    const name = useQueryParam('name');
 
    useEffect(()=>{
        console.log("The name is: " + name)
        getName(setEmployee, setTask, name)
    }, [name]
    );

    //if (!name) return;

    return (
        <div className="App">
        <header className="App-header">
            {name && <div className="Container">
            <Logo className="logo"></Logo>
            <h1>{employee.name}</h1>
            <textarea className="TaskDescription" placeholder="Опишите планируемую задачу" readOnly={employee.active} ref={inputRef} value={task} onChange={(e)=>{setTask(e.target.value); 
                                                                                                                                                setEnabled(e.target.value.length > 10);}}></textarea>
            <button className="Button Green" disabled={(employee.active + !enabled) ? true : false} onClick={()=>{start(setEmployee, employee, task)}}>Старт</button>
            <button className="Button Red" disabled={!employee.active} onClick={()=>{stop(setEmployee, employee); setTask("");}}>Стоп</button>
            </div>}
        </header>
    </div>    
    )
}

export default MainPage
