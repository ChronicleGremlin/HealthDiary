import React, { useState } from "react";
import styles from "./Calendar.css";
// import RecordActionsModal from "../../components/RecordActionsModal/RecordActionsModal";

const Calendar = ({ records = [], onRecordUpdated }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const timeWithoutSeconds = timeStr.split(":").slice(0, 2).join(":");

    const [hours, minutes] = timeWithoutSeconds.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRecordsForDate = (date) => {
    console.log("Processing records for date:", date);
    console.log("All records:", records);

    return recods.filter((record) => {
      try {
        console.log("Processing record:", record);
        console.log("Record date:", record.date);
        console.log("Record time:", record.time);

        // The date is already in YYYY-MM-DD format from the backend
        const recordDate = new Date(record.date);

        // Check if the date is valid
        if (isNaN(recordDate.getTime())) {
          console.warn(`Invalid date for record ${record.id}: ${record.date}`);
          return false;
        }

        const recordDateObj = new Date(record.date);
        const recordDateStr = recordDateObj.toISOString().split("T")[0];
        const compareDateStr = date.toISOString().split("T")[0];

        console.log("Comparing dates:", {
          recordDateStr,
          compareDateStr,
          matches: recordDateStr === compareDateStr,
        });

        return recordDateStr === compareDateStr;
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
        return false;
      }
    });
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case "month":
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(currentDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case "month":
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(currentDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleRecordUpdated = () => {
    setShowRecordModal(false);
    setSelectedRecord(null);
    if (onRecordUpdated) {
      onRecordUpdated();
    }
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayHeaders = (
      <div className={styles.calendarWeekdays}>
        {weekdays.map((day, index) => (
          <div key={index} className={styles.calendarWeekday}>
            {day}
          </div>
        ))}
      </div>
    );

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className={`${styles.calendarDay} ${styles.calendarDayEmpty}`}
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayRecords = getRecordsForDate(date);

      days.push(
        <div key={day} className={styles.calendarDay}>
          <div className={styles.calendarDayNumber}>{day}</div>
          <div className={styles.calendarDayRecords}>
            {dayRecords.map((record) => (
              <div
                key={record.id}
                className={styles.calendarRecord}
                onClick={() => handleRecordClick(record)}
                title={`${formatTime(record.time)} - ${record.name}
                ${record.notes ? "\nNotes: " + record.notes : ""}`}
              >
                <div className={styles.recordTime}>{formatTime(record.time)}</div>
                <div className={styles.recordName}>{record.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Add empty cells for remaining days to complete the grid
    const totalDays = firstDay + daysInMonth;
    const remainingDays = Math.ceil(totalDays / 7) * 7 - totalDays;
    for (let i = 0; i < remainingDays; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          className={`${styles.calendarDay} ${styles.calendarDayEmpty}`}
        />
      );
    }

    return (
      <>
        {weekdayHeaders}
        <div className={styles.calendarGrid}>{days}</div>
      </>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();

    return (
      <div className={styles.calendarWeekView}>
        <div className={styles.calendarWeekHeader}>
          {weekDates.map((date, index) => (
            <div key={index} className={styles.calendarWeekDay}>
              <div className={styles.calendarWeekDayName}>
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className={styles.calendarWeekDayNumber}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.calendarWeekGrid}>
          {weekDates.map((date, dateIndex) => {
            const dayRecords = getRecordsForDate(date);
            return (
              <div key={dateIndex} className={styles.calendarWeekDayColumn}>
                {dayRecords.map((record) => (
                  <div key={record.id} className={styles.calendarRecordWeek}>
                    <div className={styles.weekRecordTime}>
                      {formatTime(record.time)}
                    </div>
                    <div className={styles.weekRecordName}>{record.name}</div>
                    {record.notes && (
                      <div className={styles.weekRecordNotes}>
                        📝 {record.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = getTimeSlots();
    const dayRecords = getRecordsForDate(currentDate);

    return (
      <div className={styles.calendarDayView}>
        <div className={styles.calendarDayHeader}>
          <div className={styles.calendarDayTitle}>
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className={styles.calendarDayTimeline}>
          {timeSlots.map((time, index) => (
            <React.Fragment key={index}>
              <div className={styles.calendarTime}>{time}</div>
              <div className={styles.calendarSlotContent}>
                {dayRecords
                  .filter(
                    (record) => record.time.split(":")[0] === time.split(":")[0]
                  )
                  .map((record) => (
                    <div key={record.id} className={styles.calendarRecordWeek}>
                      <div className={styles.weekRecordTime}>
                        {formatTime(record.time)}
                      </div>
                      <div className={styles.weekRecordName}>{record.name}</div>
                      {record.notes && (
                        <div className={styles.weekRecordNotes}>
                          📝 {record.notes}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case "month":
        return currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "week":
        const weekDates = getWeekDates();
        const startDate = weekDates[0];
        const endDate = weekDates[6];
        return `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      default:
        return "";
    }
  };

  const renderRecords = () => {
    if (!records || records.length === 0) return null;

    return records.map((record) => {
      console.log("Record data:", record);
      console.log("Date:", record.date);
      console.log("Time:", record.time);

      // The time is already in HH:mm format from the backend
      const timeStr = record.time;

      return (
        <div
          key={record.id}
          className={`calendar-record ${
            viewMode === "week" ? "week-record" : ""
          }`}
        >
          <span className="record-time">{timeStr}</span>
          <span className="record-name">{record.name}</span>
        </div>
      );
    });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <button onClick={handlePrevious}>&lt;</button>
          <h2>{getViewTitle()}</h2>
          <button onClick={handleNext}>&gt;</button>
        </div>
        <div className={styles.viewControls}>
          <button
            className={viewMode === "month" ? styles.active : ""}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={viewMode === "week" ? styles.active : ""}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={viewMode === "day" ? styles.active : ""}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
        </div>
      </div>
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
      {showRecordModal && selectedRecord && (
        <RecordActionsModal
          record={selectedRecord}
          onClose={() => setShowRecordModal(false)}
          onRecordUpdated={handleRecordUpdated}
        />
      )}
    </div>
  );
};

export default Calendar;