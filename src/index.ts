import { TodoService } from './../backend/todo.service';
import Task from "./../backend/task";
import Util from "../backend/util";
import { createServer } from 'http';
import { Connection, createConnection } from 'mysql';
import { existsSync, readFile } from 'fs';
import { extname } from 'path';
import datepicker from 'js-datepicker';
import {parse} from "url";
import {parse as queryParse} from "querystring";


let service: TodoService = new TodoService();
let util: Util = new Util();
let conn: Connection;

//crea un database chiamato 'todolist' nel caso non ne esista uno
service.createDB().then(() => {
    setTimeout(() => {
        //crea la connessione al db 
        conn = createConnection({
            database: "todolist",
            host: "localhost",
            user: "root",
            password: "",
            dateStrings: true
        });
        conn.connect((err) => {
            if (err) throw err;
            
            //crea la tabella 'tasks' in caso non esista
            service.createTable(conn).then(() => { 
                
                //crea l'intestazione della pagina html
                let html: string = util.creaIntestazione();
        
                //effettua una select dalla tabella 'tasks' e crea la resa grafica dei risultati in caso ce ne sia almeno 1
                const sql: string = `SELECT  * FROM tasks`;
                conn.query(sql, (err, result) => {
                    if (err) throw err;

                    if (result.length == 0){
                        html += '<h2 style="width:100%; text-align: center;">Non sono presenti task, creane uno nuovo</h2>';
                    }
                    else {
                        html += util.renderizzaRisultati(result);
                    } 
                }).on("end", () => {
                    //alla fine della query crea il server che restituirà come HttpResponse la single-page app html
                    createServer((req, res) => {
                        const path = "."+req.url;
                        const ext = extname(path);
        
                        //definisce il tipo di contenuto da renderizzare in base all'estensione del file
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
        
                        //gestione delle query di inserimento, cancellazione e modifica in modalità POST
                        const method = req.method.toLowerCase();
                        if (method == "post"){
                            let body = '';
                            req.on('data', (data) => {
                                body += data;
                            });
                            req.on('end', () => {
                                const post = queryParse(body);
                                let obtainedTask;
                                
                                const url = parse(req.url,true);
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

                                //al termine di una delle query effettua una nuova select generale per aggiornare i risultati
                                conn.query(sql, (err, result) => {
                                    html = util.creaIntestazione() + util.renderizzaRisultati(result);
                                }).on("end", () => {
                                    //crea una nuova response con la pagina html aggiornata e ritorna all'indirizzo principale
                                    res.writeHead(301, { 'Content-Type': "text/html", Location: "http://localhost:3001"});
                                    const closure = "\t\t</tr>\n\t</tbody></table></div>\n</body>\n</html>";
                                    res.end(html+closure);
                                })
                            });
                        }
                        else {
                            //legge e renderizza i file css e js e completa la response
                            if (existsSync(path) && path != "./"){
                                readFile(path, (err, data) => {
                                    if (err) throw err;
                                    res.end(data, 'utf-8');
                                })
                            }
                            //completa la response della pagina html
                            else {
                                const closure = "\t\t</tr>\n\t</tbody></table></div>\n</body>\n</html>";
                                res.end(html+closure);
                            }
                        }        
                    }).listen(3001);
                });
            })
        });
    }, 3000)
});