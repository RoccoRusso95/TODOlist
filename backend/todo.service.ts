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
        this.conn.query(sql, (err, result) => {
            if (err) throw err;
            //console.log("Result: " + JSON.stringify(result));
        })
    }
    
    async createTask(task: Task): Promise<void>{
        const sql: string = 
        `INSERT INTO ${this.table_name} (titolo, descrizione, stato, data_scadenza) VALUES ('${task.titolo}', '${task.descrizione}', '${task.stato}', '${task.dataMysql}')`;
        console.log(sql);
        await this.executeQuery(sql);
    }

    async createDB(): Promise<void>{
        const sql: string = `CREATE DATABASE IF NOT EXISTS ${this.db_name}`;
        createConnection({host: "localhost",user: "root",password: ""}).query(sql, (err, result) => {
            if (err) throw err;
            //Creo un task di prova se il db è vuoto
            if (result.affectedRows != 0){
                const jsonTask = {
                    titolo : "Task di prova",
                    descrizione: "Questo è un semplice task di prova",
                    stato: "IN_ELABORAZIONE",
                    dataScadenza: "03/31/2021"
                }
                const task = new Task(jsonTask);
                this.createTask(task);
            }
        })
    }

    async createTable(): Promise<void>{
        const sql: string = `CREATE TABLE IF NOT EXISTS todolist.${this.table_name} (
            id INT NOT NULL AUTO_INCREMENT,
            titolo VARCHAR(100) NULL,
            descrizione VARCHAR(500) NULL,
            stato VARCHAR(45) NULL,
            data_scadenza DATE NULL,
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
        stato='${newTask.stato}', data_scadenza='${newTask.dataMysql}' WHERE id=${id}`;
        await this.executeQuery(sql);
    }

    toItalianDate(date: string){
        const parts = date.split("-");
        return [parts[2],parts[1],parts[0]].join("/");
    }

    
}