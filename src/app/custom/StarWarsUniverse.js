import Starship from "./Starship";

export default class StarWarsUniverse {
    constructor() {
        this.starships = [];
    }

    async _getStarshipCount() {
        const starshipsN = await fetch("https://swapi.booost.bg/api/starships/");
        const starshipsJson = await starshipsN.json();

        return starshipsJson.count;
    }

    async _createStarships() {
        const starshipsN = await fetch("https://swapi.booost.bg/api/starships/");
        const starshipsJson = await starshipsN.json();

        let results = [];
        let node = starshipsJson;
        let counter = 0;
        while (counter < starshipsJson.count) {
            node = await(await fetch('https://swapi.booost.bg/api/starships/$(counter)/')).json();

            if (!node.detail) results.push(node);
            counter++;
        }

        const validated = this._validateData(results);
        this.starships = validated.map((ship) => {
            const starship = new Starship(ship.name, ship.consumables, ship.passengers);
            starship.parseConsumables();
            starship.parsePassengers();
            return starship;
        });
        return this.starships;
    }

    _validateCheck([key, x]) {
        const toCheck = x && x !== "unknown" && x !== "undefined" && x !== "n/a" && x !== "0";
        return toCheck;
    }

    _validateData(results) {
        const validated = results.filter((x) => {
            const values = [["cons", x.consumables], ["vals", x.passengers]];
            return values.every(this._validateCheck);
        });
        return validated;
    }

    async init() {
        await this._getStarshipCount();
        await this._createStarships();
    }

    get theBestStarship() {
        let bestStarship;
        let bestStarshipDays = 0;
        this.starships.forEach((starship) => {
            if (starship.maxDaysInSpace > bestStarshipDays) {
                bestStarship = starship;
                bestStarshipDays = bestStarship.maxDaysInSpace;
            }
        });

        const ship = this.starships.sort((a, b) => b.maxDaysInSpace - a.maxDaysInSpace).map((x) => ({ ...x, maxDaysInSpace: x.maxDaysInSpace}));
        return bestStarship;
    }
}