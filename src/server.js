import process from "process";
import express, { Router } from "express";
import cors from "cors"; //enables cors as express middleware
import PlansController from "./api/plans.controller.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    const options = {
        root: process.env.PUB,
        headers: {
            "x-timestamp": Date.now(),
            "x-author": "Paul Okuneu"
        }
    };
    
    res.sendFile("index.html", options, (err) => { if(err) console.log("Error", err) });
});

const router = new Router();
router.route("/plans")
  .post(PlansController.apiCreatePlan)
  .get(PlansController.apiGetPlans)
  .delete(PlansController.apiDeletePlan);

app.use("/", router);
app.use(express.static("public"));
app.use("/utils", express.static("src/utils"));
app.use("/scripts/dayjs", (req, res) => {
    res.sendFile("C:\\Users\\Pavel.Okuneu\\coding\\OnBenchCodings\\pureJSpure\\calendar-planner\\node_modules\\dayjs\\dayjs.min.js");
});
export default app;