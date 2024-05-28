class Goal {
    constructor(descrizione, scadenza) {
        this.descrizione= descrizione;
        this.scadenza = scadenza;
        this.progress = 0;
    }

    updateProgress(progress) {
        this.progress += progress;
    }

    isCompleted() {
        return this.progress >= 100;
    }
}

export default Goal;
