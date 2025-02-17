import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "./CustomCalendar.scss";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const today = new Date(date);
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
    );
    let week = [];

    for (let i = 0; i < 7; i++) {
      let day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      week.push(day);
    }

    setWeekDates(week);
  }, [date]);

  useEffect(() => {
    if (
      weekDates.length > 0 &&
      weekDates.every((day) => day instanceof Date) &&
      date.toDateString() !== new Date().toDateString()
    ) {
      if (
        weekDates.some(
          (day) => day.toDateString() === new Date().toDateString()
        )
      ) {
        setDate(new Date());
      } else if (date.toDateString() !== weekDates[0].toDateString()) {
        setDate(weekDates[0]);
      }
    }
  }, [weekDates, date]);

  const getMonthName = () => {
    const monthSet = new Set(
      weekDates
        .filter((day) => day)
        .map((day) => day.toLocaleString("default", { month: "long" }))
    );
    return monthSet.size > 1
      ? `${[...monthSet].join(" / ")}`
      : monthSet.values().next().value;
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <h2 className="calendar__title">{getMonthName()}</h2>
      </div>

      <div className="calendar__week">
        <div className="calendar__weekdays">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index} className="calendar__weekday">
              {day}
            </div>
          ))}
        </div>

        {weekDates.length > 0 && weekDates.every((day) => day !== null) && (
          <div className="calendar__dates">
            {weekDates
              .filter((day) => day instanceof Date)
              .map((day, index) => (
                <div
                  key={index}
                  className={`calendar__date ${
                    date.toDateString() === day.toDateString()
                      ? "calendar__date--selected"
                      : ""
                  }`}
                  onClick={() => setDate(day)}
                >
                  {day.getDate()}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
