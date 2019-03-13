  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyARe27Y7yfMBq4RGdc8FQf0o_6C5oquyDA",
    authDomain: "train-scheduler-e5176.firebaseapp.com",
    databaseURL: "https://train-scheduler-e5176.firebaseio.com",
    projectId: "train-scheduler-e5176",
    storageBucket: "train-scheduler-e5176.appspot.com",
    messagingSenderId: "1075764684080"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var name = "";
  var destination = "";
  var firstTrain = "";
  var frequency;
  var nextArrival;
  var now = moment().format("HH:mm");
  console.log(now);


$("#add-train-btn").on("click", function(event) {

    event.preventDefault();

    name = $("#trainNameInput").val().trim();
    destination = $("#destinationInput").val().trim();
    firstTrain = $("#firstTrainInput").val().trim();
    frequency = $("#frequencyInput").val().trim();
  
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });
});

database.ref().on("child_added", function(snapshot) {


  var sv = snapshot.val();

  // Log the value of the various properties
  console.log(sv.name);
  console.log(sv.destination);
  console.log(sv.firstTrain);
  console.log(sv.frequency);
  

            
            //moment.js
            function findNext() {
                nextArrival = moment(nextArrival, "HH:mm").add(sv.frequency, 'minutes').format('HH:mm');
                console.log(nextArrival);
            }

            nextArrival = moment(sv.firstTrain, "HH:mm").add(sv.frequency, 'minutes').format('HH:mm');
            console.log(nextArrival);

            findNext();

            // if (nextArrival.diff(now) < 0) {
            //    findNext();
            // }

  let tRow = $("<tr>");

  let nameID = $("<td>").text(sv.name);
  let destinationID = $("<td>").text(sv.destination);
  let frequencyID = $("<td>").text(sv.frequency);
  let nextArrivalID = $("<td>").text("");
  let minutesAwayID = $("<td>").text("");

  // Append the td elements to the new table row
  tRow.append(nameID, destinationID, frequencyID, nextArrivalID, minutesAwayID);
  // Append the table row to the table element
  $(".table").append(tRow);

  // If any errors are experienced, log them to console.
  // Create Error Handling
  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);

});