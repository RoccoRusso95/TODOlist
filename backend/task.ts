import Stato from './stato.enum';

export default class Task {

    id: number;

    titolo: string;

    descrizione: string;

    stato: Stato;

    dataScadenza: string;

    //formato per mysql
    dataMysql: string;

    constructor(jsonTask: any) {
        this.titolo = jsonTask.titolo;
        this.descrizione = jsonTask.descrizione;
        const stato: string = jsonTask.stato;
        this.stato = Stato[stato];
        this.dataScadenza = jsonTask.dataScadenza;
        this.dataMysql = this.formatDate(jsonTask.dataScadenza);
    }

    formatDate(date: string){
        const parts = date.split("/");
        return [parts[2],parts[1],parts[0]].join("/");
    }

}