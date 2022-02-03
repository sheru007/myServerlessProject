import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is React project for severless programming.
        </p>
        <a
          className="App-link"
          href="https://www.youtube.com/playlist?list=PLmexTtcbIn_gP8bpsUsHfv-58KsKPsGEo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Serverless
        </a>
      </header>
    </div>
  );
}

export default App;
