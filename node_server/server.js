import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const router = express.Router();

// C O N N E C T I N G   T O   S E R V E R
const uri =
  "mongodb+srv://uzmanqaisar12:VuAWTrdCtjFGw8Oz@testserver.npts0f7.mongodb.net/";
await mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// C R E A T I N G   S C H E M A S
const slotSchema = new mongoose.Schema({
  adminName: String,
  studentName: { type: String, default: null },
  date: Date,
  startTime: String,
  endTime: String,
  isBooked: { type: Boolean, default: false },
});
const Slot = mongoose.model("slotSchema", slotSchema);

//////////////////////////////////////////////////////////////////////////////////

// R O U T E S
// Admin: Create a slot
router.post("/create", async (req, res) => {
  const { adminName, date, startTime, endTime } = req.body;
  const newSlot = new Slot({ adminName, date, startTime, endTime });
  try {
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: View/Delete their slots
router.get("/admin/:adminName", async (req, res) => {
  const { adminName } = req.params;
  try {
    const slots = await Slot.find({ adminName });
    res.status(200).json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete/:slotId", async (req, res) => {
  const { slotId } = req.params;
  try {
    await Slot.findByIdAndDelete(slotId);
    res.status(200).json({ message: "Slot deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Student: View all slots
router.get("/all", async (req, res) => {
  try {
    const slots = await Slot.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Student: Book a slot
router.post("/book", async (req, res) => {
  const { studentName, slotId } = req.body;
  try {
    const slot = await Slot.findById(slotId);
    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    slot.isBooked = true;
    slot.studentName = studentName;
    await slot.save();
    res.status(200).json(slot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Student: View/Delete their bookings
router.get("/student/:studentName", async (req, res) => {
  const { studentName } = req.params;
  try {
    const slots = await Slot.find({ studentName });
    res.status(200).json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/cancel/:slotId", async (req, res) => {
  const { slotId } = req.params;
  try {
    const slot = await Slot.findById(slotId);
    slot.isBooked = false;
    slot.studentName = null;
    await slot.save();
    res.status(200).json(slot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use("/api/slots", router);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
