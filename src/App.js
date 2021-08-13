import {ReactComponent as Logo} from './Pepsico_logo.svg';
import { useState } from 'react';
import './App.css';

function getName({setName}) {

}

function App() {
  const [name, setName] = useState("")


  return (
    <div className="App">
      <header className="App-header">
        <div className="Container">
          <Logo className="logo"></Logo>
          <h1>{name}</h1>
          <textarea className="TaskDescription" placeholder="Опишите планируемую задачу"></textarea>
          <button className="Button Green" disabled={false}>Старт</button>
          <button className="Button Red">Стоп</button>
        </div>
      </header>
    </div>
  );
}

export default App;
