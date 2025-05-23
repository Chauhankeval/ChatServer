import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoute from "./routes/AuthRoutes.js";
import path from "path";
import ContectRoute from "./routes/ContectRoute.js";
import setUpSocket from "./Socket.js";
import MessagesRoute from "./routes/MessageRoutes.js";
import ChannelRoute from "./routes/ChannelRoute.js";


dotenv.config();
const app = express();

const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;

console.log(process.env.ORIGIN)
const allowedOrigins = process.env.ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


app.use("/uploads/profiles", express.static(path.resolve("uploads/profiles")));
app.use("/uploads/files", express.static(path.resolve("uploads/files")));

app.use(express.json());
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", AuthRoute);
app.use("/api/contects", ContectRoute);
app.use("/api/messages", MessagesRoute);
app.use("/api/channel", ChannelRoute);


const server = app.listen(port, () => {
  console.log(`server is running on port  http://localhost:${port}`);
});
app.get("/", async (req, res) => {
  res.send(
    "<h1>HII THERE IM SERVER WELCOME TO MT CHATAPP AND GOSIP WITH YOU BUDDY</h1>"
  );
});

setUpSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("<<<<<<database connect successfully");
  })
  .catch((error) => console.log("<<<ERROR", error));
