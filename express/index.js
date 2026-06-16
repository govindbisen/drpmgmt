import express from "express";
import { clientConnector } from "./db.js";
import { ObjectId } from "mongodb";

const app = express();
const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());
app.listen(3000, () => {
  console.log("Connected");
});

const db = clientConnector();

app.get("/", async (request, response) => {
  try {
    const users = await db.collection("users").find().toArray();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});
