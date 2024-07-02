import { useState, useEffect } from "react";
import axios from "axios";

function StudentCalendar({ studentName }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("/api/slots/all")
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        console.log("Error fetching slots:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/slots/student/${studentName}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.log("Error fetching bookings:", error);
      });
  }, [studentName]);

  const handleBookSlot = (slotId) => {
    axios
      .post("/api/slots/book", { studentName, slotId })
      .then((response) => {
        setBookings([...bookings, response.data]);
        setSlots(
          slots.map((slot) =>
            slot._id === slotId ? { ...slot, isBooked: true } : slot
          )
        );
      })
      .catch((error) => {
        console.log("Error booking slot:", error);
      });
  };

  const handleCancelBooking = (slotId) => {
    axios
      .put(`/api/slots/cancel/${slotId}`)
      .then(() => {
        setBookings(bookings.filter((booking) => booking._id !== slotId));
        setSlots(
          slots.map((slot) =>
            slot._id === slotId
              ? { ...slot, isBooked: false, studentName: null }
              : slot
          )
        );
      })
      .catch((error) => {
        console.log("Error canceling booking:", error);
      });
  };

  return (
    <div>
      <h1>Student Calendar</h1>
      <ul>
        {slots
          .filter((slot) => !slot.isBooked)
          .map((slot) => (
            <li key={slot._id}>
              {new Date(slot.date).toLocaleDateString()} {slot.startTime} -{" "}
              {slot.endTime}
              <button onClick={() => handleBookSlot(slot._id)}>Book</button>
            </li>
          ))}
      </ul>
      <h2>My Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {new Date(booking.date).toLocaleDateString()} {booking.startTime} -{" "}
            {booking.endTime}
            <button onClick={() => handleCancelBooking(booking._id)}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentCalendar;
