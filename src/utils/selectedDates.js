class SelectedDays {
    constructor() {
        this.days = [];
    }

    contains(day) {
        const dayString = day.toDateString();
        let findResult = this.days.find(d => d.toDateString() === dayString);
        return findResult !== undefined ? true : false; 
    }

    add(day) {
        if(Object.getPrototypeOf(day) !== Date.prototype){
            console.error(`Add selected day error, added object ${day} has wrong type.`);
        }
        this.days.push(day);
    }

    remove(day) {
        const dayString = day.toDateString();
        let removeIdx = this.days.findIndex(d => d.toDateString() === dayString);
        this.days.splice(removeIdx, 1);
    }
}

export default new SelectedDays;