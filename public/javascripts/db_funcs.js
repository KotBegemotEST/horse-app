async function readRaces(db) {
    var data
    const promise = new Promise((resolve) => {
        const races = db.ref('/Race/')
        races.on('value', (snapshot) => {
            data = snapshot.val()
            resolve(data)
        })
    })
    const result = await promise
    return result
}

async function readCompetitors(db) {
    var data
    const promise = new Promise((resolve) => {
        const races = db.ref('/Competitors/')
        races.on('value', (snapshot) => {
            data = snapshot.val()
            resolve(data)
        })
    })
    const result = await promise
    return result
}


async function getBet(db) {
    var data
    const promise = new Promise((resolve) => {
        const races = db.ref('/Bets/')
        races.on('value', (snapshot) => {
            data = snapshot.val()
            resolve(data)
        })
    })
    const result = await promise
    return result
}

async function readHorses(db) {
    var data
    const promise = new Promise((resolve) => {
        const horses = db.ref('/Competitors/')
        horses.on('value', (snapshot) => {
            data = snapshot.val()
            resolve(data)
        })
    })
    const result = await promise
    return result
}

async function readResults(db) {
    var data
    const promise = new Promise((resolve) => {
        const horses = db.ref('/Results/')
        horses.on('value', (snapshot) => {
            data = snapshot.val()
            resolve(data)
        })
    })
    const result = await promise
    return result
}

module.exports = {
    writeRaces: function (db, id, place, time, min, max) {
        db.ref('/Race/' + id).set({
            place: place,
            time: time,
            min: min,
            max: max
        });
    },
    readRaces,
    readHorses,
    readResults,
    writeHorses: function (db, raceId, horseId, name, color) {
        db.ref('/Competitors/' + horseId).set({
            raceId: raceId,
            name: name,
            color: color
        });
    },
    writeResults: function (db, raceId, winnerHorseId, losers) {
        db.ref('/Results/' + raceId).set({
            raceId: raceId,
            winnerHorseId: winnerHorseId,
            losers: losers,
        })
    },
    readCompetitors,
    getBet,
    writeBet: function (db,betId, raceId, horseId, bet) {
        db.ref('/Bets/' + betId).set({
            raceId: raceId,
            horseId: horseId,
            bet: bet
        })
    },

}
