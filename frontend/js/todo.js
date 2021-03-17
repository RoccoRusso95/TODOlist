window.onload = function (){
    const modal = document.getElementById("modal");
    const button = document.getElementById("add");
    const modalContent = document.getElementById("content");
    const span = document.getElementsByClassName("close")[0];
    const edit = document.getElementsByClassName("edit");
    const del = document.getElementsByClassName("delete");  

    const hidden = document.getElementById("hidden");
    const tasks = JSON.parse(hidden.value);


    function getTaskById(id){
        return Array.from(tasks).find(task => task.id == id);
    }
    
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
    

    function showModalFormCrea(){
        const form = `
        <form method="post" action="/crea">
            <input id="title" name="titolo" type="text" maxlength="100" placeholder="Titolo del task"/><br>
            <textarea id="descrizione" name="descrizione" maxlength="500" rows="10" cols="50" placeholder="Descrizione del task"/></textarea><br>
            <select id="stato" name="stato">
                <option value="0">INSERITO</option>
                <option value="1">IN ELABORAZIONE</option>
                <option value="2">COMPLETATO</option>
            </select><br>
            <input id="data_scadenza" name="dataScadenza" type="text"/><br>
            <input id="submit" type="submit" value="CONFERMA"/>
        </form>
        `;
        openModal(form);
        gestisciData();
    } 

    function formatDate(date){
        const parts = date.split("/");
        return [parts[2],parts[0],parts[1]].join("/");
    }

    function toDatePicker(date){
        const parts = date.split("-");
        return [parts[2],parts[1],parts[0]].join("/");
    }

    function gestisciData(){
            $("#data_scadenza").datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect:function(date) {            
                    //date = formatDate(date)
                    return date;
                }
            });
    }

    function showModalFormEdit(id){
        const task = getTaskById(id);
        const form = `
        <form method="post" action="/edit">
            <input type="hidden" name="id" value="${id}"/>
            <input id="title" name="titolo" type="text" maxlength="100" placeholder="Titolo del task" value="${task.titolo}"/><br>
            <textarea id="descrizione" name="descrizione" maxlength="500" rows="10" cols="50" 
            placeholder="Descrizione del task"/>${task.descrizione}</textarea><br>
            <select id="stato" name="stato">
                <option value="0" ${task.stato == "INSERITO" ? "selected" : null}>INSERITO</option>
                <option value="1" ${task.stato == "IN_ELABORAZIONE" ? "selected" : null}>IN ELABORAZIONE</option>
                <option value="2" ${task.stato == "COMPLETATO" ? "selected" : null}>COMPLETATO</option>
            </select><br>
            <input id="data_scadenza" name="dataScadenza" type="text" value="${task.data_scadenza}"/><br>
            <input id="submit" type="submit" value="CONFERMA"/>
        </form>
        `;
        openModal(form);
        gestisciData();
    }
    
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

    Array.from(edit).forEach(el => {
        el.onclick = function(){
            const id = el.id;
            showModalFormEdit(id);
        };
    });

    Array.from(del).forEach(el => {
        el.onclick = function(){
            const id = el.id;
            showModalElimina(id);
        };
    });

    

    const buttonAnnulla = document.getElementsByClassName("annulla");
    const buttonElimina = document.getElementsByClassName("elimina");
    

    function openModal(content){
        fillModal(content);
        modal.style.display = "block";
        if (buttonAnnulla != undefined && buttonAnnulla != null){
            assignPropertyToClass(buttonAnnulla, null)
        }
    }

    function closeModal(){
        modal.style.display = "none";
        fillModal("");
    }

    function fillModal(content){
        modalContent.innerHTML = content;
    }

    button.onclick = function() {
        showModalFormCrea();
    }

    span.onclick = closeModal;

    window.onclick = function (event) {
        if (event.target == modal){
            closeModal();
        }
    }
}