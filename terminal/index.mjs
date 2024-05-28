import inquirer from 'inquirer';
import Goal from './goal.mjs';

const obiettivi = [];

function aggiungiObiettivo() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'descrizione',
            message: 'Inserisci la descrizione dell\'obiettivo:'
        },
        {
            type: 'input',
            name: 'scadenza',
            message: 'Inserisci la scadenza dell\'obiettivo (GG-MM-AAAA):'
        }
    ]).then(answers => {
        const obiettivo = new Goal(answers.descrizione, answers.scadenza);
        console.log(answers.descrizione);
        console.log(answers.scadenza);
        obiettivi.push(obiettivo);
        console.log(obiettivi);
        console.log('Obiettivo aggiunto con successo!');
        mostraMenu();
    });
}

function elencoObiettivi() {
    console.log('Obiettivi attuali:');
    obiettivi.forEach((obiettivo, indice) => {
        console.log(`${indice + 1}. Descrizione: ${obiettivo.descrizione} - Scadenza: ${obiettivo.scadenza}`);
    });
    mostraMenu();
}


function mostraMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'azione',
        message: 'Scegli un\'azione:',
        choices: ['Aggiungi obiettivo', 'Elenco degli obiettivi', 'Esci']
    }).then(answer => {
        switch (answer.azione) {
            case 'Aggiungi obiettivo':
                aggiungiObiettivo();
                break;
            case 'Elenco degli obiettivi':
                elencoObiettivi();
                break;
            case 'Esci':
                console.log('Arrivederci!');
                break;
        }
    });
}

console.log('Benvenuto nel Tracker degli Obiettivi!');
mostraMenu();
