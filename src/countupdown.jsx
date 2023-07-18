import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMoon } from "react-icons/fa";
import Cookies from 'js-cookie';
import "./myform.css";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';






const CountApp = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [theme, setTheme] = useState("light");
  const [daysCount, setDaysCount] = useState(null);
  const [countButtonClicked, setCountButtonClicked] = useState(false);
  const [word, setWord] = useState("since");
  const [titleWord, setTitleWord] = useState("Days");
  const [isSaved, setIsSaved] = useState(false);
  const [isListSaved, setIsListSaved] = useState(false);
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
    if (date) {
      setCountButtonClicked(true);
      let result = calculateInterval(date);
      setWord(result[1] ? "till" : "since");
      setDaysCount(result[0]);
    }
  };

  const handleClearClick = (date) => {
    setSavedDates([]);
  };
  

  useEffect(() => {
    setCountButtonClicked(false);
  }, [selectedDate]);

  const handleRefreshClick = () => {

  }

  const handleSaveClick = () => {
    if (selectedDate && name) {
      const newSavedDate = {
        name,
        date: selectedDate,
      };
  
      setSavedDates((prevSavedDates) => [...prevSavedDates, newSavedDate]);
      Cookies.set('savedDates', JSON.stringify([...savedDates, newSavedDate]));
    }
    setName("");
    setIsSaved(true);
  };

  useEffect(() => {
    const savedDatesFromCookies = Cookies.get('savedDates');
    if (savedDatesFromCookies) {
      setIsListSaved(true);
      setSavedDates(JSON.parse(savedDatesFromCookies));
    }
  }, []);

  return (
    <div className={`container`}>

    {(isSaved || isListSaved) && (
        <div className="list-container">
          <div className="savedlist">
            <h2>Your Saves</h2>
            <div className="listbuttonbar">
              <div onClick={handleRefreshClick} className="sbutton">
                Refresh
              </div>
              <div onClick={handleClearClick} className="sbutton">
                Clear List
              </div>
            </div>
              <div className="savedtable">
                <SavedDatesTable savedDates={savedDates} />
              </div>
            </div>
          </div>
      )}


      <div className="setup-container">
        <div className="form-container">
          <div className="bar">
            <div><span className="gheader">Find a Day or Time</span></div>
            <div className="right">
              <button className="ic">
                <FaMoon onClick={props.changeTheme}></FaMoon>
              </button>
            </div>
          </div>
          
          <div className="dateform">
            <Datetime
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="YYYY/MM/DD"
              timeFormat="HH:mm"
              input={false}
              className="date-input"
            />
          </div>
        </div>
      
        <div className='result'>
          <div className="result-container">
            {daysCount !== null && selectedDate && (
              <div><h3>
                Time {word} {moment(selectedDate).format("YYYY-MM-DD HH:mm")}:
              </h3></div>
            )}
            {daysCount !== null && selectedDate && (
              <div><p>{`${daysCount[0]} Days ${daysCount[1]} Hours ${daysCount[2]} Minutes ${daysCount[3]} Seconds`}</p>
              </div>
            )}
          </div>
        </div>

        <div className="saveform">
          <input
            className="tinput"
            type="text"
            id="name"
            placeholder="Set a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="buttonbar">
            <div onClick={handleSaveClick} disabled={!name} className="sbutton">
              Save Ann
            </div>
            <div onClick={handleSaveClick} disabled={!name} className="sbutton">
              Save Month
            </div>
            <div onClick={handleSaveClick} disabled={!name} className="sbutton">
              Save Date
            </div>`
          </div>
      </div>
      </div>
    </div>
  );
};

export default CountApp;


const calculateInterval = (date) => {
  const today = moment();
  const targetDate = moment(date);
  const duration = moment.duration(today.diff(date));
  const future = targetDate.diff(today) > 0;
  const days = Math.abs(Math.floor(duration.asDays()));
  const hours = Math.abs(duration.hours());
  const minutes = Math.abs(duration.minutes());
  const seconds = Math.abs(duration.seconds());

  let res = [[days, hours, minutes, seconds],future];

  return res;
}
const calculateDaysSinceOrTill = (date) => {
  const today = moment();
  const targetDate = moment(date);
  const daysInYear = moment(today.year(), "YYYY").isLeapYear() ? 366 : 365;
  const targetDateMMDD = targetDate.format("MM-DD");
  let targetDateThisYear = moment().month(targetDate.month()).date(targetDate.date());
  const past = today.diff(targetDateThisYear, 'days') > 0;
  targetDateThisYear = moment().month(targetDate.month()).date(targetDate.date());
  const daysSinceLast = past ? today.diff(targetDateThisYear, 'days') : daysInYear + today.diff(targetDateThisYear, 'days') ;
  const nextDate = targetDateThisYear.add(past?1:0, 'year');
  const daysTillNext = nextDate.diff(today, 'days');


  let resMessagePast = "";
  let resMessageFuture = "";
  resMessagePast = "Days since last: " + daysSinceLast;
  resMessageFuture = "Days till next: " + daysTillNext;

  let resMessage = [resMessagePast,resMessageFuture];
  
  return resMessage;
}


const formatDate = (date) => {
  let resString = moment(date).format("yyyy-MM-DD");
  return resString;
}

const formatDays = (dayCount) => {
  let resString = dayCount[0] +" Days "+ dayCount[1]+" Hours " + dayCount[2] + " Minutes " + dayCount[3] + " Seconds";
  return resString;
}

const SavedDatesTable = ({ savedDates }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null); // Collapse the row if it's already expanded
    } else {
      setExpandedRow(index);
    }
  };

  return (
    <table className="saved-dates-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {savedDates.map((savedDate, index) => (
          <React.Fragment key={index}>
            <tr className="mainrow" onClick={() => handleRowClick(index)}>
              <td>{savedDate.name}</td>
              <td>{formatDate(savedDate.date)}</td>              
            </tr>
            {expandedRow === index && (
              <>
                <tr className="expanded-row">
                  <td colSpan="2">{calculateDaysSinceOrTill(savedDate.date)[0]}</td>
                </tr>
                <tr className="expanded-row">
                  <td colSpan="2">{calculateDaysSinceOrTill(savedDate.date)[1]}</td>
                </tr>
                <tr className="expanded-row">
                  <td colSpan="2">{formatDays(calculateInterval(savedDate.date)[0])}</td>
                </tr>
              </>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};



// setInterval(() => {
//   setDaysCount((prevState) => {
//     let newSeconds = future ? prevState[3] - 1 : prevState[3] + 1;
//     let newMinutes = prevState[2];
//     let newHours = prevState[1];
//     let newDays = prevState[0];

//     if (newSeconds === 60) {
//       newSeconds = 0;
//       newMinutes = newMinutes + 1;
//     }

//     if (newMinutes === 60) {
//       newMinutes = 0;
//       newHours = newHours + 1;
//     }

//     if (newHours === 24) {
//       newHours = 0;
//       newDays += 1;
//     }

//     if (newSeconds === 0) {
//       newSeconds = 59;
//       newMinutes = newMinutes - 1;
//     }

//     if (newMinutes === 0) {
//       newMinutes = 59;
//       newHours = newHours - 1;
//     }

//     if (newHours === 0) {
//       newHours = 23;
//       newDays -= 1;
//     }
//     return [newDays, newHours, newMinutes, newSeconds];
//   });
// }, 1000);
