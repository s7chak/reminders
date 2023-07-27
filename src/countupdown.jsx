import React, { useState, useEffect } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMoon } from "react-icons/fa";
import Cookies from 'js-cookie';
import "./myform.css";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { motion } from "framer-motion";





function FadeInWhenVisible({ children }) {
	return (
	  <motion.div
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true }}
		transition={{ duration: 2 }}
		variants={{
		  visible: { opacity: 1, scale: 1 },
		  hidden: { opacity: 0, scale: 1 }
		}}
	  >
		{children}
	  </motion.div>
	);
  }


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
    setIsListSaved(false);
    setSavedDates([]);
    Cookies.remove('savedDates');
  };
  

  useEffect(() => {
    setCountButtonClicked(false);
  }, [selectedDate]);

  const handleRefreshClick = () => {

  }

  const handleSaveClick = (dateType) => {
    if (selectedDate && name) {
      let formattedDate;
      
      if (dateType === 'Annual') {
        formattedDate = moment(selectedDate).format("MM-DD");
      } else if (dateType === 'Monthly') {
        formattedDate = moment(selectedDate).format("DD");
      } else if (dateType === 'Daily') {
        formattedDate = moment(selectedDate).format("HH:mm");
      }
  
      const newSavedDate = {
        name,
        type: dateType,
        date: formattedDate,
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
      <FadeInWhenVisible><h2> Your Reminders </h2></FadeInWhenVisible>
      {(isSaved || isListSaved) && (
        <FadeInWhenVisible>
          <div className="list-container">
            <div className="savedlist">
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
            </FadeInWhenVisible>
        )}

      {!isSaved && !isListSaved && (
        <div><br/><br/><br/></div>
      )}


      <div className="setup-container">
        <div className="form-container">
          <div className="bar">
            <span className="gheader">Find a Day or Time</span>
              <div className="right">
                <FaMoon size={18} style={{ marginRight: '0' }} onClick={props.changeTheme}/>
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
      
        {daysCount !== null && selectedDate && (<div className='result'>
          <FadeInWhenVisible><div className="result-container">
              <div><h3>
                Time {word} {moment(selectedDate).format("YYYY-MM-DD HH:mm")}:
              </h3></div>
              <div><p>{`${daysCount[0]} Days ${daysCount[1]} Hours ${daysCount[2]} Minutes ${daysCount[3]} Seconds`}</p>
              </div>
          </div></FadeInWhenVisible>
        </div>
        )}

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
          <div onClick={() => handleSaveClick('Annual')} disabled={!name} className="sbutton">
            Annual Reminder
          </div>
          <div onClick={() => handleSaveClick('Monthly')} disabled={!name} className="sbutton">
            Monthly Reminder
          </div>
          <div onClick={() => handleSaveClick('Daily')} disabled={!name} className="sbutton">
            Daily Reminder
          </div>
          </div>
      </div>
      </div>
    </div>
  );
};

export default CountApp;


const calculateTimeDiff = (today, targetDate) => {
  const past = today.diff(targetDate, "days") > 0;
  let diff;

  if (past) {
    diff = moment.duration(today.diff(targetDate));
  } else {
    diff = moment.duration(targetDate.diff(today));
  }

  const years = Math.abs(diff.years());
  const months = Math.abs(diff.months());
  const days = Math.abs(diff.days());
  const hours = Math.abs(diff.hours());
  const minutes = Math.abs(diff.minutes());

  let resMessage = "";

  if (years > 0) {
    resMessage += `${years} year${years !== 1 ? "s" : ""} `;
  }

  if (months > 0) {
    resMessage += `${months} month${months !== 1 ? "s" : ""} `;
  }

  if (days > 0) {
    resMessage += `${days} day${days !== 1 ? "s" : ""} `;
  }

  if (hours > 0) {
    resMessage += `${hours} hour${hours !== 1 ? "s" : ""} `;
  }

  if (minutes > 0) {
    resMessage += `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  return resMessage.trim() || "0 minutes";
};


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

const calculateTimeSinceOrTill = (date, dateType) => {
  const today = moment();
  let targetDate;
  console.log(today, date);
  let resMessage = "Time remaining: ";

  if (dateType === "Annual") {
    targetDate = moment(date, "MM-DD"); 
    if (targetDate.isBefore(today)) {
      targetDate.year(today.year() + 1);
    } else {
      targetDate.year(today.year());
    }
    resMessage += calculateTimeDiff(today, targetDate);
  } else if (dateType === "Monthly") {
    targetDate = moment(date, "DD"); 
    targetDate.year(today.year());
    if (targetDate.date() < today.date()) {
      targetDate.add(1, 'month');
    }
    resMessage += calculateTimeDiff(today, targetDate);
  } else if (dateType === "Daily") {
    targetDate = moment(date, "HH:mm"); 
    targetDate.year(today.year());
    targetDate.month(today.month());
    if (targetDate.isBefore(today)) {
      targetDate.add(1, 'day');
    }
    resMessage += calculateTimeDiff(today, targetDate);
  } else {
    resMessage = "Invalid Date Type";
  }

  return [resMessage];
};



const formatDate = (date, type) => {
  let resString = "";
  if (type=="Annual") {
    resString = moment(date).format("MM-DD");
  } else if (type=="Monthly") {
    let suffix = (date === '01' || date === '21' || date === '31') ? "st" : (date === '02' || date === '22') ? "nd" : (date === 3 || date === 23) ? "rd" : "th";
    let dayOfMonth = parseInt(date);
    dayOfMonth = dayOfMonth.toString();
    resString = "Every "+dayOfMonth+suffix;
  } else if (type=="Daily") {
    resString = "Every "+date;
  } else {
    resString = "No type detected"
  }
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
          <th>Type</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {savedDates.map((savedDate, index) => (
          <React.Fragment key={index}>
            <tr className="mainrow" onClick={() => handleRowClick(index)}>
              <td>{savedDate.name}</td>
              <td>{savedDate.type}</td>
              <td>{formatDate(savedDate.date, savedDate.type)}</td>              
            </tr>
            {expandedRow === index && (
              <>
                <tr className="expanded-row">
                  <td colSpan="3">{calculateTimeSinceOrTill(savedDate.date, savedDate.type)}</td>
                </tr>
                {/* <tr className="expanded-row">
                  <td colSpan="2">{formatDays(calculateInterval(savedDate.date)[0])}</td>
                </tr> */}
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
