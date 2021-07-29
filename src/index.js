/* eslint-disable no-undef */
// represents src module referenced from global index
// replicates app.js
import app from "./server.js";
import PlansDAO from "./dao/plansDAO.js";
import { MongoClient } from "mongodb";

const portNum = process.env.PORT || 8081;
MongoClient.connect(
    process.env.APP_DB_URI, 
    { useNewUrlParser: true, maxPoolSize: 10, wtimeoutMS: 2500 }
)
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