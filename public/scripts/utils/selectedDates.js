import "../dayjs";

class SelectedDays {
    constructor() {
        this.days = [];
        this.formatString = "YYYY-MM-DD";
    }

    contains(day) {
        const dayString = this.format(day);
        let findResult = this.days.find(d => d === dayString);
        return findResult !== undefined ? true : false; 
    }

    add(day) {
        if(Object.getPrototypeOf(day) !== Date.prototype){
            console.error(`Add selected day error, added object ${day} has wrong type.`);
        }
        this.days.push(this.format(day));
    }

    remove(day) {
        const dayString = this.format(day);
        let removeIdx = this.days.findIndex(d => d === dayString);
        this.days.splice(removeIdx, 1);
    }

    format(day) {
        return dayjs(day).format(this.formatString);
    }
}

export default new SelectedDays;