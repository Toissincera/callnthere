import { useState } from "react";
import AdminCalendar from "./components/AdminCalendar";
import StudentCalendar from "./components/StudentCalendar";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(true);
  function changeRole() {
    setIsAdmin(!isAdmin);
  }
  return (
    <div className="main">
      <button onClick={changeRole}>
        Switch to {isAdmin ? "Student" : "Admin"}
      </button>
      {isAdmin ? (
        <AdminCalendar adminName={"The Night King"} />
      ) : (
        <StudentCalendar studentName={"A"} />
      )}
    </div>
  );
}

export default App;
