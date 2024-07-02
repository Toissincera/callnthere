// src/components/AdminCalendar.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const nodeHost = "http://localhost:5000"

export default function AdminCalendar({ adminName }) {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    axios
      .get(`${nodeHost}/api/slots/admin/${adminName}`)
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        console.log("Error fetching slots:", error);
      });
  }, [adminName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  const handleAddSlot = () => {
    axios
      .post(`${nodeHost}/api/slots/create`, { ...newSlot, adminName })
      .then((response) => {
        setSlots([...slots, response.data]);
      })
      .catch((error) => {
        console.log("Error adding slot:", error);
      });
  };

  const handleDeleteSlot = (slotId) => {
    axios
      .delete(`${nodeHost}/api/slots/delete/${slotId}`)
      .then(() => {
        setSlots(slots.filter((slot) => slot._id !== slotId));
      })
      .catch((error) => {
        console.log("Error deleting slot:", error);
      });
  };

  return (
    <div>
      <h1>Admin Calendar</h1>
      <div>
        <input
          type="date"
          name="date"
          value={newSlot.date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="startTime"
          value={newSlot.startTime}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="endTime"
          value={newSlot.endTime}
          onChange={handleInputChange}
        />
        <button onClick={handleAddSlot}>Add Slot</button>
      </div>
      <ul>
        {slots.map((slot) => (
          <li key={slot._id}>
            {new Date(slot.date).toLocaleDateString()} {slot.startTime} -{" "}
            {slot.endTime} {slot.isBooked ? "(Booked)" : ""}
            <button onClick={() => handleDeleteSlot(slot._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
