"use strict";
exports.__esModule = true;
var stato_enum_1 = require("./stato.enum");
var Task = /** @class */ (function () {
    function Task(jsonTask) {
        this.titolo = jsonTask.titolo;
        this.descrizione = jsonTask.descrizione;
        var stato = jsonTask.stato;
        this.stato = stato_enum_1["default"][stato];
        this.dataScadenza = this.formatDate(jsonTask.dataScadenza);
    }
    Task.prototype.formatDate = function (date) {
        var parts = date.split("/");
        return [parts[2], parts[0], parts[1]].join("/");
    };
    return Task;
}());
exports["default"] = Task;
