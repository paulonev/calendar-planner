import express, { Router } from 'express';
import cors from 'cors' //enables cors as express middleware
import { initCalendar } from '../calendar';
import PlansController from './plans.controller';

const app = express();

app.use(cors());

//designing rest api
const router = new Router();
router.route("/").get(initCalendar);
router.route("/plans").get(PlansController.apiGetPlans);

app.use("/", router);

export default app;