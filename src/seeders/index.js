const createMongodbConnection = require("../database")
const models = require('../database/models');
const walletseed = require('./seed/walletseed');

const run = async () => {
    await createMongodbConnection();
    for (wallet of walletseed) {
        await models.Wallet.create(wallet);
    }
}

run()
    .then(() => {
        console.log('successfully seeded wallet')
        process.exit(1)
    }).catch((err) => {
        console.error()
        process.exit(-1)
    })
