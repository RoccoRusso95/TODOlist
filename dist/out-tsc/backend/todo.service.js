"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = require("mysql");
class TodoService {
    constructor() {
        this.conn = mysql_1.createConnection({
            database: "todolist",
            host: "localhost",
            user: "root",
            password: ""
        });
    }
    executeQuery(sql) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.conn.connect(function (err) {
                if (err)
                    throw err;
                console.log(this.conn);
                this.conn.query(sql, function (err, result) {
                    if (err)
                        throw err;
                    console.log("Result: " + result);
                });
            });
        });
    }
    createTask(task) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO tasks (titolo, descrizione, stato, data_scadenza) VALUES (
            ${task.titolo}, ${task.descrizione}, ${task.stato}, ${task.dataScadenza})`;
            yield this.executeQuery(sql);
        });
    }
}
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map