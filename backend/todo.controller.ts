import  Task  from './task';
import { TodoService } from './todo.service';

export default class TodoController {

    constructor(private service: TodoService){ }

    createTask(task: Task): void {
        this.service.createTask(task);
    }

    createDB(): void {
        this.service.createDB();
    }

    createTable(): void {
        this.service.createTable();
    }

}