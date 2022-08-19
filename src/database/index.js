const { connect } = require('mongoose');
const config = require('../config');

const createMongodbConnection = async () => {
    await connect(
      config.db.uri.replace('<dbname>', config.db.database),
    ).then(() => console.log('connected to mongodb server'));
};
  

module.exports = createMongodbConnection;