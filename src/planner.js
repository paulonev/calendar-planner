export default class Planner {
    constructor(dates) {
        this.dates = dates;
        this.plans = [];
    }

    // TODO: make user-friendly dates output, grouping by month
    update() {
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
    }

    // TODO: set this is event listener
    addPlan(plan, callbackFn) {
        if(!plan) {
            //create error
            //dispatch error on planner
            return;
        }
        //TODO: use dao commands to update db

        this.plans.push(plan);
        callbackFn();
        return;
    }
}