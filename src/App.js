import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="Container">
          <h1>Алиев Ж.О.</h1>
          <textarea className="TaskDescription" placeholder="Опишите планируемую задачу"></textarea>
          <button className="Button Green" disabled={true}>Старт</button>
          <button className="Button Red">Стоп</button>
        </div>
      </header>
    </div>
  );
}

export default App;
