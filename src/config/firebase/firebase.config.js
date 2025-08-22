const admin = require('firebase-admin');
const serviceAccount = require('./service_file.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;