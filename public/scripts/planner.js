import {PlanListItem} from "./utils/planListItem.js";

// client-side script
export default class Planner {
    constructor(dates) {
        this.dates = dates;
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
                const formData = new FormData(ev.target);
                try {
                    /* updateView is a func that append a plan to planlist */ 
                    this.addPlan(formData, this.updateView);
                    form.reset();
                } catch(error) {
                    console.error(error);
                }
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
            //work around nested obj parsing issue, or choose another tool (axios, for instance)
            const req = { days: this.dates, userName : "paulOkunev@mgail.com" };
            const url = new URL("http://localhost:8080/plans");
            url.search = new URLSearchParams(req).toString();
            
            const res = await fetch(url);
            const {data} = await res.json();
            
            this.updateView(planListNode, data);
        } catch (error) {
            console.log(error);
            planListNode.appendChild(document.createTextNode("Sorry. We have an error. Retry later, please."));
        }
    }
    
    // === Callback that appends data to planListNode in form of html ===
    updateView(planListNode, data) {
        planListNode.innerHTML = "";
        data.forEach((d) => {
            planListNode.appendChild(document.createElement("h4")).appendChild(document.createTextNode(d._id));
            d.items.forEach((item) => {
                const planListItem = new PlanListItem(item);
                planListNode.appendChild(planListItem.getHtmlNode());
            });
        });
    }

    /**
    * TODO: set this is event listener
    * @param {Object} formData - form data (time, plan)
    * @param {Object} callback - update planList node
    */
    async addPlan(formData, callback) {
        if(!formData) {
            //create error
            //dispatch error on planner
            console.error("Error. Undefined plan.");
            return;
        }      
        try
        {
            for(let date of this.dates) {
                const req = { ...this.formDataToObject(formData), date };
                console.log("Request on the client side ", req);

                const url = new URL("http://localhost:8080/plans");
                url.search = new URLSearchParams(req).toString();
                const fetchParams = {
                    method: "post"
                }; 

                const insertedPlan = await fetch(url, fetchParams);

                // for UI update
                const planListNode = document.querySelector(".widget__planner-planlist");
                
                // === Receives back plans for specified date(s) and calls updateView() === 
                insertedPlan
                  .json()
                  .then((res) => {
                    console.log("FROM API result", res.data);
                    callback(planListNode, res.data);
                });
            }
        } catch (error)
        {
            console.error(`Db error. Couldn't add a plan. ${error}`);
            throw error;
        }
    }

    formDataToObject(formData) {
        if(Object.getPrototypeOf(formData) === FormData.prototype)
        {
            const parsedFormDataObject = Object.create({});
            for(let [key, value] of formData) {
                parsedFormDataObject[key] = value;
            }
        
            return parsedFormDataObject;
        }
    }
}