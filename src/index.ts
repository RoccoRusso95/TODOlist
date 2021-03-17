import { TodoService } from './../backend/todo.service';
import Task from "./../backend/task";
import TodoController from "./../backend/todo.controller";
import { createServer } from 'http';
import { Connection, createConnection } from 'mysql';
import { createReadStream, exists, existsSync, readFile, readFileSync } from 'fs';
import { extname } from 'path';
import datepicker from 'js-datepicker';
import {parse} from "url";
import {parse as queryParse} from "querystring";

const conn: Connection = createConnection({
    database: "todolist",
    host: "localhost",
    user: "root",
    password: "",
    dateStrings: true
});

conn.connect();

let service: TodoService = new TodoService(conn);

service.createDB();
service.createTable();

const modal = createReadStream("./frontend/modal.html");

let html: string;

let head = '<!DOCTYPE html>\n<html>\n<head>\n';
const meta = '\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
const favicon = '\t<link rel="shortcut icon" href="./frontend/img/favicon.ico" />\n';
const css = '\t<link rel="stylesheet" type="text/css" href="./frontend/css/todo.css"/>\n';
const datePicker = '\t<link rel="stylesheet" href="https://unpkg.com/js-datepicker/dist/datepicker.min.css">\n';
const jquery = `\t<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js" type="text/javascript"></script>
<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet" type="text/css" />\n`;
const fa = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
const js = '\t<script src="./frontend/js/todo.js"></script>\n';
const title = '\t<title>ToDo list</title>\n';
head += meta + favicon + css + jquery + fa + js + title + '</head>';

const h1 = '<h1>A simple TO-DO list app by Rocco Russo!</h1>';
html = head + '\n<body>\n\t'+ h1; 

const buttonAdd = '\n\t<div id="button_add"><input type="button" id="add" value="CREA NUOVO TASK" /></div>';
html += buttonAdd;

//create modal template
html += `
<div id="modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <span id="content"></span>
    </div>
</div>\n`;

let originalHead = html;

const sql: string = `SELECT  * FROM tasks`;

conn.query(sql, (err, result) => {
    if (err) throw err;
    
    //passo l'array dei risultati in un input hidden
    const hidden = `<input id="hidden" type="hidden" value='${JSON.stringify(result).replace("'","`")}'/>`;
    html += '\n\t<div id="table">'+hidden+'<table class="table">\n';
    let count=0;
    result.forEach(tr => {
        count++;
        //create thead
        if (count ==1){
            html += "\t\t<thead><tr>\n";
            Object.entries(tr).forEach((key, value) => {
                html += "\t\t\t<th>"+key[0].toUpperCase()+"</th>";
            });
            html += "<th>AZIONI</th>\n\t\t</tr></thead>\n<tbody>\n";
        }
        html += "\t\t<tr>\n";
        let id: number;
        let iconEdit, iconDelete;
        Object.entries(tr).forEach((key, value) => {
            if (key[0] == "id") {
                id = parseInt(key[1] as string);
            }
            if (key[0] == "data_scadenza"){
                key[1] = service.toItalianDate(key[1] as string);
            }
            html += "\t\t\t<td>"+key[1]+"</td>";
            iconEdit = `<a class="edit" id="${id}"><i class="fa fa-pencil"></i></a>`;
            iconDelete = `<a class="delete" id ="${id}"><i class="fa fa-trash"></i></a>`;
        });
        
        html += "<td>"+iconEdit+iconDelete+"</td>\n\t\t</tr>\n";
    });
}).on("end", () => {
    //conn.end();
    createServer((req, res) => {
        const path = "."+req.url;
        const ext = extname(path);
        //gestione POST
        const url = parse(req.url,true);
        const method = req.method.toLowerCase();

        let contentType;
        switch (ext) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            default:
                contentType = 'text/html';
                break;
        }
            
        res.writeHead(200, { 'Content-Type': contentType});

        if (method == "post"){
            let body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                const post = queryParse(body);
                let obtainedTask;
                
                switch (url.path){
                    case "/crea":
                        obtainedTask = new Task(post);
                        service.createTask(obtainedTask);
                        break;
                    case "/edit":
                        obtainedTask = new Task(post);
                        service.updateTask(obtainedTask,parseInt(post.id as string));
                        break;
                    case "/elimina":
                        service.deleteTask(parseInt(post.id as string));
                        break;
                }
                conn.query(sql, (err, result) => {
                    html = originalHead;
                    //passo l'array dei risultati in un input hidden
                    const hidden = `<input id="hidden" type="hidden" value='${JSON.stringify(result).replace("'","`")}'/>`;
                    html += '\n\t<div id="table">'+hidden+'<table class="table">\n';
                    let count=0;
                    result.forEach(tr => {
                        count++;
                        //create thead
                        if (count ==1){
                            html += "\t\t<thead><tr>\n";
                            Object.entries(tr).forEach((key, value) => {
                                html += "\t\t\t<th>"+key[0].toUpperCase()+"</th>";
                            });
                            html += "<th>AZIONI</th>\n\t\t</tr></thead>\n<tbody>\n";
                        }
                        html += "\t\t<tr>\n";
                        let id: number;
                        let iconEdit, iconDelete;
                        Object.entries(tr).forEach((key, value) => {
                            if (key[0] == "id") {
                                id = parseInt(key[1] as string);
                            }
                            if (key[0] == "data_scadenza"){
                                key[1] = service.toItalianDate(key[1] as string);
                            }
                            html += "\t\t\t<td>"+key[1]+"</td>";
                            iconEdit = `<a class="edit" id="${id}"><i class="fa fa-pencil"></i></a>`;
                            iconDelete = `<a class="delete" id ="${id}"><i class="fa fa-trash"></i></a>`;
                        });
                        
                        html += "<td>"+iconEdit+iconDelete+"</td>\n\t\t</tr>\n";
                    });
                }).on("end", () => {
                    res.writeHead(301, { 'Content-Type': "text/html", Location: "http://localhost:3001"});
                    const closure = "\t\t</tr>\n\t</tbody></table></div>\n</body>\n</html>";
                    res.end(html+closure);
                })
            });
        }
        else {
            //render css and js files
            if (existsSync(path) && path != "./"){
                readFile(path, (err, data) => {
                    if (err) throw err;
                    res.end(data, 'utf-8');
                })
            }
            else {
                const closure = "\t\t</tr>\n\t</tbody></table></div>\n</body>\n</html>";
                res.end(html+closure);
            }
        }        
    }).listen(3001);
});
    

