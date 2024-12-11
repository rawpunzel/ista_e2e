import cors from "cors";
import express from "express";
import { appointmentRoutes } from "./routes/appointmentRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
