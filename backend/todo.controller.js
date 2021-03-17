"use strict";
exports.__esModule = true;
var TodoController = /** @class */ (function () {
    function TodoController(service) {
        this.service = service;
    }
    TodoController.prototype.createTask = function (task) {
        this.service.createTask(task);
    };
    TodoController.prototype.createDB = function () {
        this.service.createDB();
    };
    TodoController.prototype.createTable = function () {
        this.service.createTable();
    };
    return TodoController;
}());
exports["default"] = TodoController;
