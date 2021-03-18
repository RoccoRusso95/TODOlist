import  Task  from './task';
import { TodoService } from './todo.service';

export default class Util {

    constructor(){ }

    //metodo che formatta le date dal formato mysql (yyyy-mm-dd) a quello italiano (dd/mm/yyyy)
    toItalianDate(date: string){
        const parts = date.split("-");
        return [parts[2],parts[1],parts[0]].join("/");
    }

    //metodo che crea l'intestazione della pagina html
    creaIntestazione(): string {
        let html;
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

        return html;
    }

    //metodo che renderizza i risultati della select in html
    renderizzaRisultati(result: any): string{
        const hidden = `<input id="hidden" type="hidden" value='${JSON.stringify(result).replace("'","`")}'/>`;
        let html = '\n\t<div id="table">'+hidden+'<table class="table">\n';
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
                    key[1] = this.toItalianDate(key[1] as string);
                }
                html += "\t\t\t<td>"+key[1]+"</td>";
                iconEdit = `<a class="edit" id="${id}"><i class="fa fa-pencil"></i></a>`;
                iconDelete = `<a class="delete" id ="${id}"><i class="fa fa-trash"></i></a>`;
            });
            
            html += "<td>"+iconEdit+iconDelete+"</td>\n\t\t</tr>\n";
        });
        return html;
    }

}