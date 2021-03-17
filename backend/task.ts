import Stato from './stato.enum';

export default class Task {

    id: number;

    titolo: string;

    descrizione: string;

    stato: Stato;

    dataScadenza: string;

    constructor(jsonTask: any) {
        this.titolo = jsonTask.titolo;
        this.descrizione = jsonTask.descrizione;
        const stato: string = jsonTask.stato;
        this.stato = Stato[stato];
        this.dataScadenza = this.formatDate(jsonTask.dataScadenza);
    }

    formatDate(date: string){
        const parts = date.split("/");
        return [parts[2],parts[0],parts[1]].join("/");
    }

}