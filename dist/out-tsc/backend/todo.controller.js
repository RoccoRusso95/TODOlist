"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TodoController {
    constructor(service) {
        this.service = service;
    }
    createTask(task) {
        this.service.createTask(task);
    }
}
exports.default = TodoController;
//# sourceMappingURL=todo.controller.js.map