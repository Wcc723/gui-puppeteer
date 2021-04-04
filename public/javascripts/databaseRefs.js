const config = {
  apiKey: "AIzaSyAAew1ArwvbZnvFW1xRUZx4VfbwL5PeNww",
  authDomain: "puppteer-test-tool.firebaseapp.com",
  databaseURL: "https://puppteer-test-tool-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(config);

const database = firebase.database();
const refs = {};
refs.workerRef = database.ref('/workers');
refs.sequenceWorksRef = database.ref('/sequenceWorks');

export default refs;
