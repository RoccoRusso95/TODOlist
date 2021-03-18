import Task from "./task";
import { Connection, createConnection } from "mysql";

//classe di servizio per la connessione al db e la gestione delle query CRUD
export class TodoService {

    conn: Connection; 
    db_name: string = "todolist";
    table_name: string = "tasks";

    db: boolean = false;    

    constructor() {
        
    }

    async executeQuery(sql: string): Promise<void>{
        this.conn.query(sql, (err, result) => {
            if (err) throw err;
        })
    }

    async createDB(): Promise<void>{
        const sql: string = `CREATE DATABASE IF NOT EXISTS ${this.db_name}`;
        createConnection({host: "localhost",user: "root",password: ""}).query(sql, (err, result) => {
            if (err) throw err;
            this.db = true;
        })
    }

    async createTable(connection: Connection): Promise<void>{
        this.conn = connection;
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

    async createTask(task: Task): Promise<void>{
        const sql: string = 
        `INSERT INTO ${this.table_name} (titolo, descrizione, stato, data_scadenza) VALUES ('${task.titolo}', '${task.descrizione}', '${task.stato}', '${task.dataMysql}')`;
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
    
}