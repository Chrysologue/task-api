import "dotenv/config";
import express from "express";
import connectToDB from "./models/baseModel.js";
import router from "./route/seedRoute.js";
import userRote from "./route/userRoute.js";
import taskRoute from "./route/taskRoute.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/tasks", router);
app.use("/api/users", userRote);
app.use("/tasks", taskRoute);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to task Api" });
});

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
