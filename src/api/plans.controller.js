import PlansDAO from "../dao/plansDAO.js";

export default class PlansController {
    // 1. user wants to view his plans for each of selected days
    // would I use express routing mechanisms here? suppose, no.
    // so req object contains just my data, i.e. dates[] 
    static async apiGetPlans(req) {
        let days = req.days ?? []; //assume it to be a collection
        let user = req.user;
        let response = await PlansDAO.getPlans(days, user);
    
        if('error' in response) {
            return { status: 500, error: response };
        }

        return { status: 200, data: response };
    }

    // 2. user wants to create new plan that will be stored in db
    static async apiCreatePlan(req) {
        //plan, date, user, priority, status
        let plan = req.plan ?? {};
        let date = req.date ?? new Date();
        let user = { name: process.env.DEFAULT_USER };

        let response = await PlansDAO.addPlan(plan, date, user);
        if('error' in response){
            return { status: 500, error: response };
        }

        return { status: 200, data: response };
    }
}