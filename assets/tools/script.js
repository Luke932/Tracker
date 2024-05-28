import { addGoal, getGoals, updateGoal, deleteGoal } from './database.js';

// Ottieni riferenze agli elementi HTML
const form = document.getElementById('aggiungi-form');
const scadenzaInput = document.getElementById('scadenza');
const elencoObiettiviContainer = document.getElementById('elenco-obiettivi');

// Aggiungi un listener per l'evento di invio del form
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const descrizione = form.descrizione.value;
    const scadenza = form.scadenza.value;

    // Definisci un'espressione regolare per il formato della data (GG-MM-AA)
    const formatoDataRegex = /^\d{2}-\d{2}-\d{2}$/;

    // Verifica se la data è nel formato corretto
    if (!formatoDataRegex.test(scadenza)) {
        alert('Inserisci la data nel formato corretto (GG-MM-AA).');
        return;
    }

    // Dividi la data in giorno, mese e anno
    const [giorno, mese, anno] = scadenza.split('-').map(Number);

    // Verifica che il mese sia compreso tra 1 e 12
    if (mese < 1 || mese > 12) {
        alert('Il mese deve essere compreso tra 1 e 12.');
        return;
    }

    // Array dei nomi dei mesi
    const nomiMesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    // Determina il numero massimo di giorni per il mese
    const giorniMassimi = new Date(anno + 2000, mese, 0).getDate(); // Aggiungi 2000 all'anno per gestire correttamente gli anni nel range 2000-2099

    // Verifica che il giorno sia compreso tra 1 e il massimo dei giorni per il mese
    if (giorno < 1 || giorno > giorniMassimi) {
        alert(`Il mese di ${nomiMesi[mese - 1]} ha un massimo di ${giorniMassimi} giorni.`);
        return;
    }

    // Verifica che l'anno non sia inferiore a 24
    if (anno < 24) {
        alert('L\'anno non può essere inferiore a 24.');
        return;
    }

    // Verifica che la data non sia nel passato rispetto alla data corrente
    const dataCorrente = new Date();
    const dataInserita = new Date(anno + 2000, mese - 1, giorno); // Aggiungi 2000 all'anno per gestire correttamente gli anni nel range 2000-2099
    if (dataInserita < dataCorrente) {
        alert('La data è antecedente a quella di oggi, vuoi finire questa attività nel passato?');
        return;
    }

    // Aggiungi l'obiettivo al database
    addGoal(descrizione, scadenza).then(() => {
        alert('Obiettivo aggiunto con successo!');
        form.reset();
        aggiornaElencoObiettivi();
    }).catch((error) => {
        console.error('Errore durante l\'aggiunta dell\'obiettivo:', error);
    });
});

function aggiornaElencoObiettivi() {
    getGoals().then((goals) => {
        elencoObiettiviContainer.innerHTML = '';
        if (goals.length === 0) {
            elencoObiettiviContainer.innerHTML = '<p>Nessun obiettivo presente.</p>';
        } else {
            goals.forEach((goal, index) => {
                const goalElement = document.createElement('li');
                goalElement.textContent = `${index + 1}. Descrizione: ${goal.descrizione} - Scadenza: ${goal.scadenza} 👍`;

                // Aggiungi bottoni Modifica ed Elimina
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifica';
                editButton.addEventListener('click', () => modificaObiettivo(goal.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Elimina';
                deleteButton.addEventListener('click', () => eliminaObiettivo(goal.id));

                // Dentro la funzione aggiornaElencoObiettivi(), dopo aver creato i pulsanti:
                editButton.classList.add('modifica-button');
                deleteButton.classList.add('elimina-button');


                goalElement.appendChild(editButton);
                goalElement.appendChild(deleteButton);

                elencoObiettiviContainer.appendChild(goalElement);
            });
        }
    }).catch((error) => {
        console.error('Errore durante il recupero degli obiettivi:', error);
    });
}

function modificaObiettivo(id) {
    const nuovaDescrizione = prompt('Inserisci la nuova descrizione:');
    const nuovaScadenzaInput = prompt('Inserisci la nuova scadenza (GG-MM-AA):');

    // Verifica che la data sia nel formato corretto (GG-MM-AA)
    const formatoDataRegex = /^\d{2}-\d{2}-\d{2}$/;
    if (!formatoDataRegex.test(nuovaScadenzaInput)) {
        alert('Inserisci la data nel formato corretto (GG-MM-AA).');
        return;
    }

    // Dividi la data in giorno, mese e anno
    const [giorno, mese, anno] = nuovaScadenzaInput.split('-').map(Number);

    // Verifica che il mese sia compreso tra 1 e 12
    if (mese < 1 || mese > 12) {
        alert('Il mese deve essere compreso tra 1 e 12.');
        return;
    }

    // Verifica che l'anno non sia inferiore a 24
    if (anno < 24) {
        alert('L\'anno non può essere inferiore a 24.');
        return;
    }

    // Determina il numero massimo di giorni per il mese
    const giorniMassimi = new Date(anno, mese, 0).getDate();

    // Verifica che il giorno sia compreso tra 1 e il massimo dei giorni per il mese
    if (giorno < 1 || giorno > giorniMassimi) {
        alert(`Il mese di ${getNomeMese(mese)} ha un massimo di ${giorniMassimi} giorni.`);
        return;
    }

    // Verifica che la data non sia nel passato rispetto alla data corrente
    const dataCorrente = new Date();
    const dataInserita = new Date(anno + 2000, mese - 1, giorno);
    if (dataInserita < dataCorrente) {
        alert('La data è antecedente a quella di oggi, vuoi finire questa attività nel passato?');
        return;
    }

    // Converti la stringa della data in un formato accettabile per il database
    const nuovaScadenza = nuovaScadenzaInput.replace(/^(\d{2})-(\d{2})-(\d{2})$/, (match, giorno, mese, anno) => {
        return `${giorno}-${mese.padStart(2, '0')}-${anno}`;
    });


    // Modifica l'obiettivo nel database
    updateGoal(id, { descrizione: nuovaDescrizione, scadenza: nuovaScadenza }).then(() => {
        alert('Obiettivo modificato con successo!');
        aggiornaElencoObiettivi();
    }).catch((error) => {
        console.error('Errore durante la modifica dell\'obiettivo:', error);
    });

}



function eliminaObiettivo(id) {
    if (confirm('Sei sicuro di voler eliminare questo obiettivo?')) {
        deleteGoal(id).then(() => {
            alert('Obiettivo eliminato con successo!');
            aggiornaElencoObiettivi();
        }).catch((error) => {
            console.error('Errore durante l\'eliminazione dell\'obiettivo:', error);
        });
    }
}


// Aggiorna l'elenco degli obiettivi al caricamento della pagina
document.addEventListener('DOMContentLoaded', aggiornaElencoObiettivi);
