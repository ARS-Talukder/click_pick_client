import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { IoMdAlarm } from "react-icons/io";


const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) {
      return { status: "notStarted", time: start - now };
    } else if (now > end) {
      return { status: "ended", time: 0 };
    } else {
      return { status: "running", time: end - now };
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTime = (milliseconds) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    totalSeconds %= 3600;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return { hours, minutes, seconds };
  };

  if (timeLeft.status === "notStarted") {
    const { hours, minutes, seconds } = formatTime(timeLeft.time);
    return (
      <div className="flex items-center gap-2 text-orange-500 font-bold">
        <span>Starts in</span>
        <FaClock />
        <span className="bg-red-600 text-white px-2 py-1 rounded">{hours}</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded">{minutes}</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded">{seconds}</span>
      </div>
    );
  }

  if (timeLeft.status === "ended") {
    return <p className="text-red-600 font-bold">Offer ended</p>;
  }

  const { hours, minutes, seconds } = formatTime(timeLeft.time);

  return (
    <div className="flex items-center gap-2 font-bold">
      <span className="hidden text-red-600 lg:block md:block">Ending Offer</span>
      <IoMdAlarm className="text-red-600 text-2xl" />
      <span className="bg-red-600 text-white px-2 py-1 rounded">{hours}</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded">{minutes}</span>
      <span className="bg-red-600 text-white px-2 py-1 rounded">{seconds}</span>
    </div>
  );
};

export default CountdownTimer;