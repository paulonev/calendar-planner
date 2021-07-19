// const path = require("path");
// import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import "./css/main.scss";
import PlansDAO from "./dao/plansDAO.js";
import app from "./api/server.js";

// dotenv.config({path: path.join(__dirname, '.env')});
// removable logging procedure
console.log(process.env.PORT, process.env.APP_DB_URI);

const portNum = process.env.PORT || 8081;

MongoClient.connect(process.env.APP_DB_URI, {
    useNewUrlParser: true, poolSize: 10, wtimeout: 2500
})
  .catch(err => {
      console.error(err.stack);
      process.exit(1);
  })
  .then(async client => {
      await PlansDAO.connect(client);
      app.listen(portNum, () => {
          console.log(`App listening on port ${portNum}`);
      });
  })

// integrate app.js(client) with server.js(server api) `app` object
// client.js 
// 1. send user request for displaying planner widget
// 2. send user plans after choosing plans and submitting email form
// 3. send user request for creating(removing) a plan and updating a planlist
// 4. 
// api
// 1.
// 2.
// 3.
// 4.