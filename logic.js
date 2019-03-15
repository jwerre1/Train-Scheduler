$(document).ready(function() { 

//Initialize Firebase
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
var diffMinutes;
console.log(now);

// store new data when "submit" button is pushed
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

// runs when new data appears in database
database.ref().on("child_added", function(snapshot) {


  var sv = snapshot.val();

  // Log the value of the various properties
  console.log(sv.name);
  console.log(sv.destination);
  console.log(sv.firstTrain);
  console.log(sv.frequency);
        
  nextArrival = sv.firstTrain;
  var difference = moment.utc(moment(nextArrival, "HH:mm").diff(moment(now, "HH:mm"))).format("HH:mm");
  console.log(difference);
  var diffMinutes = moment.duration(difference).as('minutes');
  console.log(diffMinutes);

  // function finds when next train is
  function findNext() {
    nextArrival = moment(nextArrival, "HH:mm").add(sv.frequency, 'm').format('HH:mm');
    difference = moment.utc(moment(nextArrival, "HH:mm").diff(moment(now, "HH:mm"))).format("HH:mm");
    diffMinutes = moment.duration(difference).as('minutes');
    console.log(nextArrival);
    console.log(difference);
    console.log(diffMinutes);

    // if the next train found is longer away then the train's frequency, keep searching for next train until found
    if (diffMinutes > sv.frequency) {
      findNext();
    }
  }

  // initial check to see if next train needs to be found
  if (diffMinutes > sv.frequency) {
      findNext();
  }

  let tRow = $("<tr>");

  // converts time of next train into hh:mm a
  var nextArrivalAMPM = moment(nextArrival, "HH:mm").format('LT');

  // add data to td elements
  let nameID = $("<td>").text(sv.name);
  let destinationID = $("<td>").text(sv.destination);
  let frequencyID = $("<td>").text(sv.frequency);
  let nextArrivalID = $("<td>").text(nextArrivalAMPM);
  let minutesAwayID = $("<td>").text(diffMinutes);

  // Append the td elements to the new table row
  tRow.append(nameID, destinationID, frequencyID, nextArrivalID, minutesAwayID);
  // Append the table row to the table element
  $(".table").append(tRow);

  // If any errors are experienced, log them to console.
  // Create Error Handling
  }, function(errorObject) {
  console.log("The read failed: " + errorObject.code);

});

})