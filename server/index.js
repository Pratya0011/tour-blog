import express from "express";
import connection from "./db/index.js";
import bodyParser from "body-parser";
import { config } from "dotenv";
import userRouter from "./Router/userRoutes.js"
import cors from 'cors'
config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(
    {
        "origin": "http://localhost:5173",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
      }
))

app.use("/user", userRouter)

connection
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log("server listening on port", process.env.PORT);
      console.log("connected to mongoDB");
    })
  )
  .catch((err) => {
    console.log("server failed to listen with error", err);
  });