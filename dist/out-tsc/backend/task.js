"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import {IsNotEmpty, IsDefined, MaxLength, IsString, IsEnum} from 'class-validator';
const stato_enum_1 = require("./stato.enum");
class Task {
    constructor(jsonTask) {
        this.titolo = jsonTask.titolo;
        this.descrizione = jsonTask.descrizione;
        const stato = jsonTask.stato;
        this.stato = stato_enum_1.default[stato];
        this.dataScadenza = jsonTask.dataScadenza;
    }
}
exports.default = Task;
//# sourceMappingURL=task.js.map