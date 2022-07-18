import { useRef } from 'react';
import './App.css';
import Hex2Rgb from './components/Hex2Rgb';

function App() {
  const appHeaderRef = useRef();

  // обработчик события ошибочного ввода
  const onFailedHandler = () => {
    appHeaderRef.current.style.backgroundColor = "#FF0000";
  }

  // обработчик события измененного цвета
  const onColorConvertedHandler = (rgb, hex) => {
    appHeaderRef.current.style.backgroundColor = hex;
  }

  return (
    <div className="App">
      <header className="App-header" ref={appHeaderRef}>
        <Hex2Rgb onColorConverted={onColorConvertedHandler} onFailed={onFailedHandler} defaultValue="#"/>
      </header>
    </div>
  );
}

export default App;
