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
    constructor({ date, user_name }) {
        this.time = date;
        this.plan = user_name;
        this.checkBoxOn = false;
    }

    getHtmlNode() {
        let itemHtmlNode = document.createElement("div");
        itemHtmlNode.setAttribute("class", "planlist__item");
        
        itemHtmlNode.innerHTML = `<div class="planlist__row1"><div class="planlist__time">${this.time}</div></div><div class="planlist__row2"><span class="planlist__checkbox"><input type="checkbox"/></span><span class="planlist__plan">${this.plan}</span><span class="planlist__actionButtons"><button class="actionButtons__edit">Edit</button><button class="actionButtons__remove">Remove</button></span></div>`
    
        return itemHtmlNode;
    }
}