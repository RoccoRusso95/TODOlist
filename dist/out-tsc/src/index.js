"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_service_1 = require("./../backend/todo.service");
const task_1 = require("./../backend/task");
const todo_controller_1 = require("./../backend/todo.controller");
let controller = new todo_controller_1.default(new todo_service_1.TodoService());
const jsonTask = {
    titolo: "Task di prova",
    descrizione: "Questo è un semplice task di prova",
    stato: "IN_ELABORAZIONE",
    dataScadenza: new Date()
};
console.log("prova");
const task = new task_1.default(jsonTask);
controller.createTask(task);
//# sourceMappingURL=index.js.map