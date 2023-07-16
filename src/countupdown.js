import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMoon } from "react-icons/fa";
import "./myform.css";

const CountApp = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [theme, setTheme] = useState("light");
  const [daysCount, setDaysCount] = useState(null);
  const [countButtonClicked, setCountButtonClicked] = useState(false);
  const [word, setWord] = useState("since");
  const [isSaved, setIsSaved] = useState(false);
  const [name, setName] = useState("");
  const [savedDates, setSavedDates] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    console.log(newTheme);
  };

  const handleCountClick = () => {
    if (selectedDate) {
      setCountButtonClicked(true);
      const today = moment();
      const targetDate = moment(selectedDate);
      const duration = moment.duration(today.diff(selectedDate));
      let future = targetDate.diff(today) > 0;
      const days = Math.abs(Math.floor(duration.asDays()));
      const hours = Math.abs(duration.hours());
      const minutes = Math.abs(duration.minutes());
      let seconds = Math.abs(duration.seconds());
      setWord(future ? "till" : "since");
      setDaysCount([days, hours, minutes, seconds]);
      setInterval(() => {
        setDaysCount((prevState) => {
          let newSeconds = future ? prevState[3] - 1 : prevState[3] + 1;
          let newMinutes = prevState[2];
          let newHours = prevState[1];
          let newDays = prevState[0];

          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes = newMinutes + 1;
          }

          if (newMinutes === 60) {
            newMinutes = 0;
            newHours = newHours + 1;
          }

          if (newHours === 24) {
            newHours = 0;
            newDays += 1;
          }

          if (newSeconds === 0) {
            newSeconds = 59;
            newMinutes = newMinutes - 1;
          }

          if (newMinutes === 0) {
            newMinutes = 59;
            newHours = newHours - 1;
          }

          if (newHours === 0) {
            newHours = 23;
            newDays -= 1;
          }
          return [newDays, newHours, newMinutes, newSeconds];
        });
      }, 1000);
    }
  };

  useEffect(() => {
    setCountButtonClicked(false);
  }, [selectedDate]);

  const handleSaveClick = () => {
    if (selectedDate && name) {
      const newSavedDate = {
        name,
        date: selectedDate
      };

      setSavedDates((prevSavedDates) => [...prevSavedDates, newSavedDate]);
    }

    setSelectedDate(null);
    setName("");
    setIsSaved(true);
  };

  return (
    <div className={`${theme} container`}>
      <div className="bar">
        <h1>Countdown App</h1>
        <div className="right">
          <button className="ic">
            <FaMoon onClick={toggleTheme}>Toggle Theme</FaMoon>
          </button>
        </div>
      </div>
      <div className="input-container">
        <div className="dateform">
          <label htmlFor="date" className="text">
            Select a date
          </label>
          <DatePicker
            id="date"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            // minDate={new Date()}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            className="date-input"
          />
        </div>
        <div className="saveform">
          <label htmlFor="name" className="text">
            Name:
          </label>
          <input
            className="tinput"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="buttonbar">
        <button
          onClick={handleCountClick}
          disabled={!selectedDate || countButtonClicked}
        >
          Count
        </button>
        <button onClick={handleSaveClick} disabled={!name}>
          Save
        </button>
      </div>
      <div className="result">
        <div className="result-container">
          {daysCount !== null && selectedDate && (
            <h3>
              Time {word} {selectedDate.toString()}:
            </h3>
          )}
          {daysCount !== null && selectedDate && (
            <p>{`${daysCount[0]} Days ${daysCount[1]} Hours ${daysCount[2]} Minutes ${daysCount[3]} Seconds`}</p>
          )}
        </div>
      </div>
      {isSaved && (
        <div className="savedlist">
          <h2>Saved Views</h2>
          {savedDates.map((savedDate, index) => (
            <div key={index}>
              <p>
                {index + 1}. {savedDate.name} :{" "}
              </p>
              <p>{savedDate.date.toString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountApp;
