import {PlanListItem} from "./utils/planListItem.js";

// client-side script
export default class Planner {
    constructor(dates) {
        this.dates = dates;
        this.plans = [];
    }
    
    // TODO: make user-friendly dates output, grouping by month
    async update() {
        let planner = document.querySelector(".widgets__planner");
        if(!planner) {
            return;
        }
        
        if(planner.children.length === 0 && this.dates.length > 0) {
            let selectedDaysDiv = document.createElement("div");
            selectedDaysDiv.setAttribute("class", "planner__selected-days");
            selectedDaysDiv.innerText = `${this.dates.length}`;
            planner.appendChild(selectedDaysDiv);
            
            let planInput = document.createElement("div");
            let header3 = document.createElement("h3");
            header3.appendChild(document.createTextNode("Choose time and write some plans"));
            planInput.appendChild(header3);
            planInput.setAttribute("class", "input-plan");
            planner.appendChild(planInput);
            
            let formTimeInput = document.createElement("input");
            formTimeInput.type = "time";
            formTimeInput.id = "time";
            formTimeInput.name = "time";
            formTimeInput.value = "00:00";
            let formPlanInput = document.createElement("input");
            formPlanInput.type = "text";
            formPlanInput.id = "plan";
            formPlanInput.name = "plan";
            formPlanInput.placeholder = "Write up your plan";
            let formButton = document.createElement("button");
            formButton.innerText = "Create";
            let form = document.createElement("form");
            [formTimeInput, formPlanInput, formButton].forEach((elem) => form.appendChild(elem));
            form.setAttribute("class", "input-plan__form");
            
            form.addEventListener("submit", (ev) => {
                ev.preventDefault();
                const data = new FormData(ev.target);
/*callback */     this.addPlan(data, (data) => {
                    /* Func that append a plan to planlist */
                    const parsedFormDataObject = Object.create({});
                    for(let [key, value] of data) {
                        parsedFormDataObject[key] = value;
                    }
                    const planListItem = new PlanListItem(parsedFormDataObject);
                    planList.appendChild(planListItem.getHtmlNode());
                })
            })
            
            planner.appendChild(form);
            let header4 = document.createElement("h4");
            header4.appendChild(document.createTextNode("Planlist"));
            planner.appendChild(header4);
            
            let planList = document.createElement("div");
            planList.setAttribute("class", "widget__planner-planlist");
            planner.appendChild(planList);
            
            let planEmailForm = document.createElement("div");
            header3 = document.createElement("h3");
            header3.appendChild(document.createTextNode("Email anybody with this plans"));
            planEmailForm.appendChild(header3)
            
            let formEmailInput = document.createElement("input");
            formEmailInput.type = "email";
            formEmailInput.id = "email";
            formEmailInput.name = "email";
            formEmailInput.placeholder = "Email";
            let emailFormButton = document.createElement("button");
            emailFormButton.innerText = "Send";
            let emailForm = document.createElement("form");
            emailForm.appendChild(formEmailInput);
            emailForm.appendChild(emailFormButton);
            emailForm.setAttribute("class", "email-form");
            
            planEmailForm.appendChild(emailForm);
            
            planner.appendChild(planEmailForm);
            
            let closeButton = document.createElement("button");
            closeButton.innerText = "Close";
            closeButton.addEventListener("click", () => planner.innerHTML = null);
            planner.appendChild(closeButton);
        }
        else {
            let elem = document.querySelector(".planner__selected-days");
            elem.innerText = this.dates.length;
        }
        
        //using fetch API instead on PlansController
        //interaction with server-side script 
        //make plans.controller request to get user plans to display
        //we have this.dates and process.env.DEFAULT_USER
        const planListNode = document.querySelector(".widget__planner-planlist");
        try {
            //work around nested obj parsing issue
            const req = { days: this.dates, userName : "paulOkunev@mgail.com" };
            const url = new URL("http://localhost:8080/plans");
            url.search = new URLSearchParams(req).toString();
            
            const res = await fetch(url);
            const {data} = await res.json();

            data.forEach((d) => {
                const planItemDTO = new PlanListItem(d);
                planListNode.appendChild(planItemDTO.getHtmlNode());
            });
        } catch (error) {
            console.log(error);
            planListNode.appendChild(document.createTextNode("Sorry. We have an error. Retry later, please."));
        }
    }
    
    /**
    * TODO: set this is event listener
    * @param {Object} plan - form data
    * @param {Object} callback - update planList node
    */
    async addPlan(plan, callback) {
        var url = new URL("http://localhost:8080/plans");
        
        if(!plan) {
            //create error
            //dispatch error on planner
            console.error("Error. Undefined plan.");
            return;
        }      
        
        this.plans.push(plan);
        
        //TODO: use controller commands to update db
        for(let date in this.dates) {
            try
            {
                const req = { plan, date };
                await fetch(url, 
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(req)
                    }
                );
            } catch (error)
            {
                console.error(`Db error. Couldn't add a plan.`)
            }
        }
        
        // decide upon callback usage
        // update UI
        callback(plan);
    }
}