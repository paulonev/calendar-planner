const { MongoClient } = require("mongodb");
require('dotenv').config();

// MongoClient creates connection to a db
const client = new MongoClient(process.env.APP_DB_URI, {useNewUrlParser: true});

//test connection code 
async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

        // retrieve client options
        const clientOptions = client.s.options; // {ssl, user, authSource}
        // console.log(clientOptions);

        // can explore connections that exist on the database
        // const dbConnections = await dbHandle.listConnections().toArray();
        // console.log(dbConnections);

        // collection handle
        // const coll = dbHandle.collection("planner");
        // console.log(coll);

        // get amount of documents
        // const collCount = await coll.countDocuments({});
        // console.log(collCount);

        // ==============================================
        // Insert new document with data sample into collection
        // ==============================================
        // const document = [
        //     {
        //         "date": { "day": 12, "month": 4, "year": 2022 },
        //         "plan": "code webserver logic",
        //         "timestamp": { "hour": 11, "minute": 30, "AM": true },
        //         "duration" : { "hours": 2, "minutes": 0, "seconds": 0 }
        //     },
        //     {
        //         "date": { "day": 12, "month": 4, "year": 2022 },
        //         "plan": "code frontend logic",
        //         "timestamp": { "hour": 3, "minute": 30, "AM": false },
        //         "duration" : { "hours": 4, "minutes": 30, "seconds": 0 }
        //     }
        // ];
        // const coll = client.db("PlannerDB").collection('planner');
        // let {n, ok} = await (await coll.insertMany(document)).result;
        // expect E11000 duplicate key if we try duplicate insert 

        // ========================================
        // Insert if unexist or update if exist
        // ========================================
        // const coll = client.db("PlannerDB").collection("planner");
        // produce some result, programmer: check API
        // const updateInsertResult = await coll.updateOne(
        //     { plan: "work with databases" },
        //     {
        //         $set: { "timestamp.minute": 20 }
        //     },
        //     { upsert: true } // allows to insert
        // );
        // console.log(updateInsertResult.result.upserted);

        // ===================================
        // Find document in collection
        // excluding _id and date from output
        // ===================================
        // const coll = client.db("PlannerDB").collection("planner");
        // const data = await coll
        //     .find(
        //         { plan: "<string>" }, 
        //         { projection: { _id: 0, date: 0 }} // 0-not include (optional)
        //     )
        //     .toArray();
        // console.log(data);
        
        // ========== collection.deleteOne() ===============
        // Delete first document from collection that matches the PREDICATE
        // without a predicate it will delete first one that goes in order of insertion (bad practice)
        // This op changes collection data
        //         updates indexes
        //         add entries on the `oplog`
        // const userPlans = client.db("PlannerDB").collection("planner");
        // let documentsCount = await userPlans.count({});
        // console.log("Documents before DELETE: ", documentsCount);

        // let deleteDocument = await userPlans.deleteOne({ "duration.hours": 2 });

        // documentsCount = await userPlans.count({});
        // console.log("Documents after DELETE: ", documentsCount);
        
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);