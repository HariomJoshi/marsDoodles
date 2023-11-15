import React, { useState, useEffect } from "react";
import "./Clock.css";

function Clock({socket,initialTime}) {
  const [time, setTime] = useState(initialTime);
  const [startTimer, setStartTimer] = useState(false);
  const [stopTimer, setStopTime] = useState(false);

  useEffect(()=>{
    socket.on("startGame",()=>{
        setStartTimer(true);
        setStopTime(false)
    })
    socket.on("endGame",()=>{
        setStopTime(true)
        setStartTimer(true);
    })
  },[socket])

  useEffect(() => {
    let intervalId;

    if (startTimer) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0 || stopTimer) {
            clearInterval(intervalId);
            return prevTime;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [startTimer, stopTimer]);

  return (
    <div className="clock-container">
      <div className="digital-clock">
        <div className="digit">{formatDigit(Math.floor(time / 60))}</div>
        <div className="colon">:</div>
        <div className="digit">{formatDigit(time % 60)}</div>
      </div>
    </div>
  );
}

function formatDigit(digit) {
  return digit < 10 ? `0${digit}` : digit;
}

export default Clock;
