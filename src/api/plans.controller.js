import PlansDAO from "../dao/plansDAO.js";
import {fileLogger} from "../../loggerSetup.js";

export default class PlansController {
    // 1. user wants to view his plans for each of selected days
    static async apiGetPlans(req, res, next) {
        let days = req.query.days.split(',') ?? []; //assume it to be a collection
        let user = req.query.userName; //should be an object

        fileLogger.info(`getPlans(DAO) requested with: ${JSON.stringify({days: days, user: user})}`);

        let response = await PlansDAO.getPlans(days, user);
        
        fileLogger.info(`getPlans(DAO) responded with: ${JSON.stringify(response)}`);

        // sends promisable response to browser
        res.json({data: response});
    }

    // 2. user wants to create new plan that will be stored in db
    static async apiCreatePlan(req, res, next) {
        //plan, date, user, priority, status
        let {plan, date, time, user_name} = req.query;
        let user = user_name ?? "paulOkunev@mgail.com"; //testing purposes user

        fileLogger.info(`addPlan(DAO) requested with: ${JSON.stringify({plan: plan, date: date, time: time, user: user_name})}`);

        let insertedResponse = await PlansDAO.addPlan(plan, date, time, user);

        fileLogger.info(`addPlan(DAO) responded with: ${JSON.stringify(insertedResponse)}`);

        res.json({data: insertedResponse});
    }

    // 3. user deletes his plan identified by date, time and planText
    // should i implement delete only by id, thus performing somehow extra req for identifying id by date, time, planText
    static async apiDeletePlan(req, res, next) {
        // console.log(req.body);
        let {date, time, plan, user_name} = req.body;
        let user = user_name ?? "paulOkunev@mgail.com"; //testing purposes user

        fileLogger.info(`deletePlan(DAO) requested with: ${JSON.stringify({plan: plan, date: date, time: time})}`);

        let deletedCount = await PlansDAO.deletePlan(date, time, plan, user);
        res.json(deletedCount); //return status code if needed
    }
}