import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;

async function connector() {
  await client.connect();
  db = client.db("authdb");
  console.log("MongoDB Connected");
}

await connector();

export function clientConnector() {
  return db;
}
