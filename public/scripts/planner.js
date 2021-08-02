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
                    this.addPlan(formData);
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
        
        await this.updatePlanList();
    }
    
    // === Gets plans from DB and appends them to planListNode in form of html ===
    async updatePlanList() {
        const planListNode = document.querySelector(".widget__planner-planlist");
        planListNode.innerHTML = "";

        try {
            // === Sending GET request for specific selected dates and user ===
            // TODO: work around nested obj parsing issue, or choose another tool (axios, for instance)
            const req = { days: this.dates, userName : "paulOkunev@mgail.com" };
            // TODO: if i remove URLSearchparams, can i send data inside the body???
            const url = new URL("http://localhost:8080/plans");
            url.search = new URLSearchParams(req).toString();
            
            const res = await fetch(url);
            const {data} = await res.json();
            
            data.forEach((d) => {
                const planDateBlock = document.createElement("div");
                planDateBlock.setAttribute("class", "planlist__group");
                planDateBlock.setAttribute("date", d._id);
                const planDate = document.createElement("h4");
                planDate.setAttribute("class", "date");
                planDate.appendChild(document.createTextNode(d._id));
                planDateBlock.appendChild(planDate);
                d.items.forEach((item) => {
                    const planListItem = new PlanListItem(item);
                    planDateBlock.appendChild(planListItem.getHtmlNode());
                });
                planListNode.appendChild(planDateBlock);
            });
            
            // assign event callbacks
            let rmButtons = document.getElementsByClassName("actionButtons__remove");
            Array.prototype.forEach.call(rmButtons, (button) => {
                button.addEventListener("click", this.deletePlan.bind(this));
            });
        } catch (error) {
            console.log(error);
            planListNode.appendChild(document.createTextNode("Sorry. We have an error. Retry later, please."));
        }
    }

    async deletePlan(event) {
        // console.log(updateCallback);
        const targetElement = event.target;
        let { date, time, plan } = getPlanData();

        // === Finds data in plan, time and date nodes in DOM ===
        function getPlanData() {
            const planClassName = "planlist__plan";
            const timeClassName = "planlist__time";
            const groupClassName = "planlist__group";
            const planItemClassName = "planlist__item";
        
            let date, time, plan;
            let node = targetElement;
            while (node.className !== planItemClassName) {
                node = node.parentNode;
            }
            
            setPlanTime(node);
            setDate(node);

            // traversing tree from root (.planlist)
            function setPlanTime(node) {
                if (node === null) {
                    return;
                }
                
                if (node.className === planClassName) plan = node.textContent;
                if (node.className === timeClassName) time = node.textContent;
                
                for (let childNode of node.childNodes) {
                    setPlanTime(childNode);
                }
                return;
            }
            
            function setDate(node) {
                try {
                    while (node.className !== groupClassName) {
                        node = node.parentNode;
                    }
                    date = node.getAttribute("date");
                } catch(error) {
                    console.log(`Couldn't find node with className ${groupClassName}`);
                }
            }
            
            return { date, time, plan };
        }
        
        const url = new URL("http://localhost:8080/plans/");
        const reqObj = {date: date, time: time, plan: plan};
        const res = await fetch(url, {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqObj)
        });

        const deletedCount = await res.json();
        console.log(`Delete ${deletedCount} items`);

        // console.log(this); //event listener has another this
        await this.updatePlanList();
    }

    /**
    * TODO: set this is event listener
    * @param {Object} formData - form data (time, plan)
    */
    async addPlan(formData) {
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

                // === Receives back plans for specified date(s) and calls updatePlanList() === 
                insertedPlan
                  .json()
                  .then((res) => {
                    console.log("FROM API result", res.data);
                });
            }
            this.updatePlanList();
        } catch (error) {
            console.error(`Db error. Couldn't add a plan. ${error}`);
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