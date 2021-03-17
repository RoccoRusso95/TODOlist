import Task from "./task";
import { Connection, createConnection } from "mysql";
import { IncomingMessage, ServerResponse } from "http";

export class TodoService {

    conn: Connection; 
    db_name: string = "todolist";
    table_name: string = "tasks";
    

    constructor(connection: Connection) {
        this.conn = connection;
    }

    async executeQuery(sql: string): Promise<void>{
        const create = (t) => this.createTask(t);
        this.conn.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Result: " + JSON.stringify(result));

            //Creo un task di prova se il db è vuoto
            if (sql.includes('DATABASE') && result.affectedRows != 0){
                const jsonTask = {
                    titolo : "Task di prova",
                    descrizione: "Questo è un semplice task di prova",
                    stato: "IN_ELABORAZIONE",
                    dataScadenza: "2021/03/31"
                }
                const task = new Task(jsonTask);
                create(task);
            }
        })
    }
    
    async createTask(task: Task): Promise<void>{
        const sql: string = 
        `INSERT INTO ${this.table_name} (titolo, descrizione, stato, data_scadenza) VALUES ('${task.titolo}', '${task.descrizione}', '${task.stato}', '${task.dataScadenza}')`;
        await this.executeQuery(sql);
    }

    async createDB(): Promise<void>{
        const sql: string = `CREATE DATABASE IF NOT EXISTS ${this.db_name}`;
        await this.executeQuery(sql);
    }

    async createTable(): Promise<void>{
        const sql: string = `CREATE TABLE IF NOT EXISTS todolist.${this.table_name} (
            id INT NOT NULL AUTO_INCREMENT,
            titolo VARCHAR(100) NULL,
            descrizione VARCHAR(500) NULL,
            stato VARCHAR(45) NULL,
            data_scadenza DATETIME NULL,
            PRIMARY KEY (id));
          `;
        await this.executeQuery(sql);
    }

    async deleteTask(id: number): Promise<void>{
        const sql: string = `DELETE FROM ${this.table_name} WHERE id=${id}`;
        await this.executeQuery(sql);
    }

    async updateTask(newTask: Task, id:number): Promise<void>{
        const sql: string = `UPDATE ${this.table_name} SET titolo='${newTask.titolo}', descrizione='${newTask.descrizione}',
        stato='${newTask.stato}', data_scadenza='${newTask.dataScadenza}' WHERE id=${id}`;
        await this.executeQuery(sql);
    }

    toItalianDate(date: string){
        const parts = date.split("-");
        return [parts[2],parts[1],parts[0]].join("/");
    }

    
}