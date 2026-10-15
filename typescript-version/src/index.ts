import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import testConnection from "./models/testModel.js";
import userRoute from './routes/userRoute.js'

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/users", userRoute)

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to task API TypeScript version" });
});

testConnection()
  .then(() => {
    app.listen(port, () => {
      console.log("App is listening on port", port);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
