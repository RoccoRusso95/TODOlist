window.onload = function (){
    const modal = document.getElementById("modal");
    const button = document.getElementById("add");
    const modalContent = document.getElementById("content");
    const span = document.getElementsByClassName("close")[0];
    const edit = document.getElementsByClassName("edit");
    const del = document.getElementsByClassName("delete");  

    //elemento in cui sono contenuti i risultati della query
    const hidden = document.getElementById("hidden");
    const tasks = hidden != null ? JSON.parse(hidden.value) : null;


    function getTaskById(id){
        return Array.from(tasks).find(task => task.id == id);
    }
    
    //funzione che crea la modale per la cancellazione
    function showModalElimina(id){
        const modalElimina = `<p>Sei sicuro di voler cancellare questo task?</p>
        <form method="post" action="/elimina">
            <input type="hidden" name="id" value="${id}"/>
            <div id="modalButtons" style="text-align:center;">
                <input type="submit" value="CONFERMA" class="elimina" id="${id}"/>
                <input type="button" value="ANNULLA" class="annulla" />
            </div>
        </form>`;
        openModal(modalElimina);
    }
    
    //funzione che crea la modale per la creazione di un nuovo task
    function showModalFormCrea(){
        const form = `
        <form method="post" action="/crea">
            <input id="title" name="titolo" type="text" maxlength="100" placeholder="Titolo del task"/><br>
            <textarea id="descrizione" name="descrizione" maxlength="500" rows="10" cols="50" placeholder="Descrizione del task"/></textarea><br>
            <div id="stato_data">
                <label for="stato">Stato</label>
                <select id="stato" name="stato">
                    <option value="0">INSERITO</option>
                    <option value="1">IN ELABORAZIONE</option>
                    <option value="2">COMPLETATO</option>
                </select>
                <label for="dataScadenza">Data scadenza</label>
                <input id="data_scadenza" name="dataScadenza" type="text"/>
            </div>
            <input id="submit" type="submit" value="CONFERMA"/>
        </form>
        `;
        openModal(form);
        gestisciData();
    } 

    //funzione che crea la modale per la visualizzazione/modifica di un task
    function showModalFormEdit(id){
        const task = getTaskById(id);
        const form = `
        <form method="post" action="/edit">
            <input type="hidden" name="id" value="${id}"/>
            <input id="title" name="titolo" type="text" maxlength="100" placeholder="Titolo del task" value="${task.titolo}"/><br>
            <textarea id="descrizione" name="descrizione" maxlength="500" rows="10" cols="50" 
            placeholder="Descrizione del task"/>${task.descrizione}</textarea><br>
            <div id="stato_data">
                <label for="stato">Stato</label>
                <select id="stato" name="stato">
                    <option value="0" ${task.stato == "INSERITO" ? "selected" : null}>INSERITO</option>
                    <option value="1" ${task.stato == "IN_ELABORAZIONE" ? "selected" : null}>IN ELABORAZIONE</option>
                    <option value="2" ${task.stato == "COMPLETATO" ? "selected" : null}>COMPLETATO</option>
                </select>
                <label for="dataScadenza">Data scadenza</label>
                <input id="data_scadenza" name="dataScadenza" type="text" value="${toDatePicker(task.data_scadenza)}"/>
            </div>
            <input id="submit" type="submit" value="CONFERMA"/>
        </form>
        `;
        openModal(form);
        gestisciData();
    }

    //funzione che formatta le date dal formato mysql a quello italiano
    function toDatePicker(date){
        const parts = date.split("-");
        return [parts[2],parts[1],parts[0]].join("/");
    }

    //funzione di gestione del DatePicker
    function gestisciData(){
        $("#data_scadenza").datepicker({
            dateFormat: 'dd/mm/yy',
            onSelect:function(date) {    
                return date;
            }
        });
    }

    //funzione che associa un'azione all'onclick degli elementi di una classe
    function assignPropertyToClass(classElements, content) {
        Array.from(classElements).forEach(el => {
            el.onclick = function() {
                if (content == null){
                    closeModal();
                }
                else {
                    openModal(content);
                } 
            }
        })
    }

    const buttonAnnulla = document.getElementsByClassName("annulla");
    const buttonElimina = document.getElementsByClassName("elimina");
    
    //funzione di apertura della modale
    function openModal(content){
        fillModal(content);
        modal.style.display = "block";
        if (buttonAnnulla != undefined && buttonAnnulla != null){
            assignPropertyToClass(buttonAnnulla, null)
        }
    }

    //funzione di chiusura della modale
    function closeModal(){
        modal.style.display = "none";
        fillModal("");
    }

    //funzione che riempie la modale con il contenuto richiesto
    function fillModal(content){
        modalContent.innerHTML = content;
    }

    //associa la funzione di apertura modale creazione all'apposito tasto
    button.onclick = function() {
        showModalFormCrea();
    }

    //associa la funzione di apertura modale modifica alle apposite icone
    Array.from(edit).forEach(el => {
        el.onclick = function(){
            const id = el.id;
            showModalFormEdit(id);
        };
    });

    ////associa la funzione di apertura modale modifica alle apposite icone
    Array.from(del).forEach(el => {
        el.onclick = function(){
            const id = el.id;
            showModalElimina(id);
        };
    });

    //chiude la modale in caso di click sul tasto di chiusura
    span.onclick = closeModal;

    //chiude la modale in caso di click altrove
    window.onclick = function (event) {
        if (event.target == modal){
            closeModal();
        }
    }
}