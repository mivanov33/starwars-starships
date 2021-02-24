export default class Starship {
    constructor(name, _consumables, _passengers) {
        this.name = name;
        this._consumables = _consumables;
        this._passengers = _passengers;
    }

    parseConsumables() {
        const consumable = this._consumables.split(" ");
        if (consumable[1] === "years" || consumable[1] === "year") {
            this._consumables = Number(consumable[0]) * 365;
        } else if (consumable[1] === "months" || consumable[1] === "month") {
            this._consumables = Number(consumable[0]) * 30;
        } else if (consumable[1] === "weeks" || consumable[1] === "week") {
            this._consumables = Number(consumable[0]) * 7;
        } else {
            this._consumables = Number(consumable[0]);
        }
    }

    parsePassengers() {
        this._passengers = Number(this._passengers.replace(/,/gi, ""));
    }

    get maxDaysInSpace() {
        return this._consumables / this._passengers;
    }
}