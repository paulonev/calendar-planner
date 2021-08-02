export default class PlanList {
    constructor() {
        this.list = []
    }
    
    /**
     * @param {PlanListItem} item 
     */
    addItem(item) {
        const listItem = new PlanListItem(item);
        this.list.push(listItem);
    }

    // getItemsHtml() {
    //     let fragment = new DocumentFragment();
    //     for(let item of this.list) {
    //         // append item.getHtml to general markup and return
    //         let itemHtml = document.createElement("div");
    //         itemHtml.setAttribute("class", "planlist__item");
    //         itemHtml.innerHTML = item.getHtml();
    //         fragment.appendChild(itemHtml);
    //     }
    //     return fragment.getRootNode(); //?
    // }
}

export class PlanListItem {
    constructor({ time, plan }) {
        this.time = time;
        this.plan = plan;
        this.checkBoxOn = false;
    }

    // getHtmlNode() {
    //     let itemHtmlNode = document.createElement("div");
    //     itemHtmlNode.setAttribute("class", "planlist__item");
        
    //     itemHtmlNode.innerHTML = `<div class="planlist__row1"><div class="planlist__time">${this.time}</div></div><div class="planlist__row2"><span class="planlist__checkbox"><input type="checkbox"/></span><span class="planlist__plan">${this.plan}</span><span class="planlist__actionButtons"><button class="actionButtons__edit">Edit</button><button class="actionButtons__remove">Remove</button></span></div>`
    
    //     return itemHtmlNode;
    // }

    async deleteEvent(event) {
        //find out date, time and plan values
        //find by id (another approach)
        const targetElement = event.target;
        let { date, time, plan } = getPlanData(targetElement);

        // === Finds data in plan, time and date nodes in DOM ===
        function getPlanData(targetElement) {
            const planClassName = "planlist__plan";
            const timeClassName = "planlist__time";
            const dateClassName = "planlist__date";
        
            let date, time, plan;
            let node = targetElement;
            while (node.className !== dateClassName) {
                node = node.parentNode;
            }
        
            // traversing tree from root (.planlist)
            function postOrder(node) {
                if (node === null) {
                    return;
                }
                
                if (node.className === planClassName)
                plan = node.textContent;
                if (node.className === timeClassName)
                time = node.textContent;
                if (node.className === dateClassName)
                date = node.textContent;
                
                for (let childNode of node.childNodes) {
                    postOrder(childNode);
                }
                return;
            }
            
            postOrder(node);
            
            return { date, time, plan };
        }
        
        const url = new URL("http://localhost:8080/plans");
        const reqObj = {date, time, plan};
        const res = await fetch(url, {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reqObj)
        });
        return await res.json();
    }
    
    editEvent(event) {}
    
    getHtmlNode() {
        let itemHtmlNode = document.createElement("div");
        itemHtmlNode.setAttribute("class", "planlist__item");
        
        // === Row1 ===
        let row1 = document.createElement("div");
        row1.setAttribute("class", "planlist__row1");
        let planListTime = document.createElement("div");
        planListTime.setAttribute("class", "planlist__time");
        planListTime.appendChild(document.createTextNode(`${this.time}`));
        row1.appendChild(planListTime);
        
        // === Row2 ===
        let row2 = document.createElement("div");
        row2.setAttribute("class", "planlist__row2");
        
        // === Checkbox ===
        let planListCheckbox = document.createElement("span");
        planListCheckbox.setAttribute("class", "planlist__checkbox");
        let checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        planListCheckbox.appendChild(checkboxInput);
        
        // === Plan ===
        let planListPlan = document.createElement("span");
        planListPlan.setAttribute("class", "planlist__plan");
        planListPlan.appendChild(document.createTextNode(`${this.plan}`));
        
        // === Buttons ===
        let planListBtns = document.createElement("span");
        planListBtns.setAttribute("class", "planlist__actionButtons");
        let editBtn = document.createElement("button");
        editBtn.setAttribute("class", "actionButtons__edit");
        editBtn.appendChild(document.createTextNode("Edit"));
        editBtn.addEventListener("click", this.editEvent);
        
        let removeBtn = document.createElement("button");
        removeBtn.setAttribute("class", "actionButtons__remove");
        removeBtn.appendChild(document.createTextNode("Remove"));
        // removeBtn.addEventListener("click", this.deleteEvent);
        
        planListBtns.appendChild(editBtn);
        planListBtns.appendChild(removeBtn);
        
        row2.appendChild(planListCheckbox);
        row2.appendChild(planListPlan);
        row2.appendChild(planListBtns);
        
        itemHtmlNode.appendChild(row1);
        itemHtmlNode.appendChild(row2);
        return itemHtmlNode;
    }
}