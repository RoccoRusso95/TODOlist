"use strict";
exports.__esModule = true;
var todo_service_1 = require("./../backend/todo.service");
var task_1 = require("./../backend/task");
var http_1 = require("http");
var mysql_1 = require("mysql");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var querystring_1 = require("querystring");
/*const jsonTask = {
    titolo : "Task di prova",
    descrizione: "Questo è un semplice task di prova",
    stato: "IN_ELABORAZIONE",
    dataScadenza: Date.now()
}
const task = new Task(jsonTask);*/
var conn = mysql_1.createConnection({
    database: "todolist",
    host: "localhost",
    user: "root",
    password: "",
    dateStrings: true
});
conn.connect();
var service = new todo_service_1.TodoService(conn);
service.createDB();
service.createTable();
var modal = fs_1.createReadStream("./frontend/modal.html");
var html;
var head = '<!DOCTYPE html>\n<html>\n<head>\n';
var meta = '\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
var favicon = '\t<link rel="shortcut icon" href="./frontend/img/favicon.ico" />\n';
var css = '\t<link rel="stylesheet" type="text/css" href="./frontend/css/todo.css"/>\n';
var datePicker = '\t<link rel="stylesheet" href="https://unpkg.com/js-datepicker/dist/datepicker.min.css">\n';
var jquery = "\t<script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js\" type=\"text/javascript\"></script>\n<script src=\"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js\" type=\"text/javascript\"></script>\n<link href=\"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css\" rel=\"Stylesheet\" type=\"text/css\" />\n";
var fa = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
var js = '\t<script src="./frontend/js/todo.js"></script>\n';
var title = '\t<title>ToDo list</title>\n';
head += meta + favicon + css + jquery + fa + js + title + '</head>';
var h1 = '<h1>A simple TO-DO list app by Rocco Russo!</h1>';
html = head + '\n<body>\n\t' + h1;
var buttonAdd = '\n\t<div id="button_add"><input type="button" id="add" value="CREA NUOVO TASK" /></div>';
html += buttonAdd;
//create modal template
html += "\n<div id=\"modal\" class=\"modal\">\n    <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <span id=\"content\"></span>\n    </div>\n</div>\n";
var sql = "SELECT  * FROM tasks";
conn.query(sql, function (err, result) {
    if (err)
        throw err;
    //passo l'array dei risultati in un input hidden
    var hidden = "<input id=\"hidden\" type=\"hidden\" value='" + JSON.stringify(result).replace("'", "`") + "'/>";
    html += '\n\t<div id="table">' + hidden + '<table class="table">\n';
    var count = 0;
    result.forEach(function (tr) {
        count++;
        //create thead
        if (count == 1) {
            html += "\t\t<thead><tr>\n";
            Object.entries(tr).forEach(function (key, value) {
                html += "\t\t\t<th>" + key[0].toUpperCase() + "</th>";
            });
            html += "<th>AZIONI</th>\n\t\t</tr></thead>\n<tbody>\n";
        }
        html += "\t\t<tr>\n";
        var id;
        var iconEdit, iconDelete;
        Object.entries(tr).forEach(function (key, value) {
            if (key[0] == "id") {
                id = parseInt(key[1]);
            }
            if (key[0] == "data_scadenza") {
                key[1] = service.toItalianDate(key[1]);
            }
            html += "\t\t\t<td>" + key[1] + "</td>";
            iconEdit = "<a class=\"edit\" id=\"" + id + "\"><i class=\"fa fa-pencil\"></i></a>";
            iconDelete = "<a class=\"delete\" id =\"" + id + "\"><i class=\"fa fa-trash\"></i></a>";
        });
        html += "<td>" + iconEdit + iconDelete + "</td>\n\t\t</tr>\n";
    });
}).on("end", function () {
    //conn.end();
    http_1.createServer(function (req, res) {
        var path = "." + req.url;
        var ext = path_1.extname(path);
        var contentType;
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
        res.writeHead(200, { 'Content-Type': contentType });
        //render css and js files
        if (fs_1.existsSync(path) && path != "./") {
            fs_1.readFile(path, function (err, data) {
                if (err)
                    throw err;
                res.end(data, 'utf-8');
            });
        }
        else {
            var closure = "\t\t</tr>\n\t</tbody></table></div>\n</body>\n</html>";
            res.end(html + closure);
        }
        //gestione POST
        var url = url_1.parse(req.url, true);
        var method = req.method.toLowerCase();
        if (method == "post") {
            var body_1 = '';
            req.on('data', function (data) {
                body_1 += data;
            });
            req.on('end', function () {
                var post = querystring_1.parse(body_1);
                var obtainedTask;
                switch (url.path) {
                    case "/crea":
                        obtainedTask = new task_1["default"](post);
                        service.createTask(obtainedTask);
                        break;
                    case "/edit":
                        obtainedTask = new task_1["default"](post);
                        service.updateTask(obtainedTask, parseInt(post.id));
                        break;
                    case "/elimina":
                        service.deleteTask(parseInt(post.id));
                        break;
                }
            });
        }
    }).listen(3001);
});
