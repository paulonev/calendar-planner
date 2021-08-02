import { fileLogger } from "../../loggerSetup.js";

let pl_cal_db; // database handle
let plans;  // collection

const DEFAULT_STATUS = "active";
const DEFAULT_PRIORITY = "low";

export default class PlansDAO {
    static async connect(cnn) {
        if(pl_cal_db) return;
        try {
            pl_cal_db = await cnn.db(process.env.APP_DB_NS);
            plans = pl_cal_db.collection("user_plans"); //create plans collection
            this.plans = plans; // only for testing
        } catch(e) {
            console.error(`Unable to establish a collection handle in PlansDAO: ${e}`);
            fileLogger.error(`Unable to establish a collection handle in PlansDAO: ${e}`);
        }
    }
    
    /**
    * Retrieves the connection pool size, write concern and user roles on the
    * current client.
    * @returns {Promise<ConfigurationResult>} An object with configuration details.
    */
    static async getConfiguration() {
        const roleInfo = await pl_cal_db.command({ connectionStatus: 1 });
        const authInfo = roleInfo.authInfo.authenticatedUserRoles[0];
        const { poolSize, wtimeout } = plans.s.db.serverConfig.s.options;
        let response = {
            poolSize,
            wtimeout,
            authInfo,
        };
        return response;
    }

    /**
     * Gets plans for any element in days collection
     * @param {Object[]} days 
     */
    static async getPlans(days, user) {
        // Design collection "user_plans"s schema
        const groupExpr = 
        {
            '$group': {
                '_id': '$date', 
                'items': {
                    '$push': {
                        'time': '$time', 
                        'plan': '$plan'
                    }
                }
            }
        };

        const matchExpr = 
        {
            '$match': {
                'date': {'$in': days},
                'user_name': user
            }
        };
        try {
            return await plans.aggregate([matchExpr, groupExpr]).toArray();
        } catch (error) {
            console.error(`getPlans(DAO) error. ${error}`);
            fileLogger.error(`getPlans(DAO) error. ${error}`);
        }
    }

    /**
     * Inserts a plan into the `user_plans` collection, with the following fields:
     *   "user_plans" collection design:
     *   -  "text", main information about a plan
     *   -  "date", calendar date when a plan should be fullfilled
     *   -  "begin_time", time of the plan to start
     *   -  "end_time" [opt], time of the plan to finish
     *   -  "priority", priority for the day(high, medium, low) to use for sorting plans with equal time or undefined time
     *   -  "status", fulfilled, postponed 
     *   -  "user_name", the _id of the user that created a plan {in future, when user management will be added}
     *
     * @returns Boolean value indicating whether this write result was acknowledged
    */
    static async addPlan(
        userPlan, 
        planDate, 
        planTime, 
        userName, 
        planPriority, 
        planStatus
    ) {
        try {
            const filter = { plan: userPlan, date: planDate, time: planTime };
            const updateDoc = {
                $set: {
                    plan: userPlan,
                    date: planDate,
                    time: planTime,
                    user_name: userName,
                    priority: planPriority ?? DEFAULT_PRIORITY,
                    status: planStatus ?? DEFAULT_STATUS
                }
            };
            const options = { upsert: true };
            return await plans.updateOne(filter, updateDoc, options);
            
            // return await this.getPlans([planDate], userName);
        } catch (error) {
            // console.error(`DAO-error: unable to add plan, ${e}`);
            fileLogger.error(`DAO-error: unable to add plan, ${error}`);
            return error;
        }
    }

    static async deletePlan(date, time, plan, userName) {
        try {
            const {deletedCount} = await plans.deleteOne({plan, date, time});
            fileLogger.info(`Removed ${deletedCount} docs from user_plans`);

            return deletedCount;
        } catch(error) {
            fileLogger.error(`DAO-error: unable to delete plan, ${error}`);
        }
    }
}