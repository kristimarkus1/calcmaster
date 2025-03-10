import React, { useState, useEffect } from "react";
import "./App.css";
import clickSound from "./click.mp3";

function App() {
  const [value, setValue] = useState("");
  const [quote, setQuote] = useState("");
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState(localStorage.getItem("notes") || "");
  const [darkMode, setDarkMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const clickAudio = new Audio(clickSound);

  useEffect(() => {
    const quotes = [
      "Believe in yourself!",
      "Keep pushing forward!",
      "Today is your day!",
      "You can achieve anything!",
      "Stay positive and strong!",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Tallinn&units=metric&appid=c94f27674bb4652a03ebf1239ee88a30"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));

    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("et-EE"));
    };

    updateTime();
    setInterval(updateTime, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  const handleClick = (button) => {
    if (soundOn) clickAudio.play();

    if (button === "AC") {
      setValue("");
    } else if (button === "=") {
      try {
        const expression = value.replace(/(\d+\.?\d*)([-+*/])(\d+\.?\d*)%/, (_, num1, operator, num2) => {
          const percentageValue = (parseFloat(num1) * parseFloat(num2)) / 100;
          return `${num1}${operator}${percentageValue}`;
        });

        setValue(eval(expression).toString());
      } catch {
        setValue("Error");
      }
    } else {
      setValue(value + button);
    }
  };

  const buttons = [
    "AC", "%", "/", "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "=",
  ];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <>
      <header className="header">
        <h1 className="app-logo"><img src="/img.png" alt="CalcMaster Logo" className="logo"/>CalcMaster</h1>
        
        <div className="toggle-options">
          <span className="toggle-text">
            {darkMode ? "Try out light mode" : "Try out dark mode"}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>

          <label className="sound-toggle">
            Sound Effects:
            <input
              type="checkbox"
              checked={soundOn}
              onChange={() => setSoundOn(!soundOn)}
            />
          </label>
        </div>
      </header>

      <div className={`calculator-container ${darkMode ? "dark-mode" : ""}`}>
        <div className="calculator">
          
          
          <input type="text" value={value} readOnly className="display" />
          <div className="buttons">
            {buttons.map((button) => (
              <button
                key={button}
                onClick={() => handleClick(button)}
                className={`button ${
                  button === "AC"
                    ? "button-clear"
                    : button === "="
                    ? "button-equal"
                    : "button-default"
                }`}
              >
                {button}
              </button>
            ))}
          </div>

          <div className="quote">{quote}</div>
          <textarea
            className="notes"
            placeholder="Quick notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      <footer className="footer">
        <p>
          © 2025 Kristi Markus |{" "}
          <a href="https://kristimarkus.vercel.app/" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>{" "}
          |{" "}
          {weather && weather.main ? (
            <>
              Tallinn: {weather.main.temp}°C, {weather.weather[0].main} | {time}
            </>
          ) : (
            "Loading weather..."
          )}
        </p>
      </footer>
    </>
  );
}

export default App;

