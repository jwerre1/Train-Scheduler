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
  var diffMinutes;
  // var todayDate = moment().format("MMMM Do YYYY")
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
  
  // var trainBase = moment(todayDate + " " + sv.firstTrain).format("MMMM Do YYYY, HH:mm");
  // console.log(trainBase);          




            nextArrival = sv.firstTrain;
            var difference = moment.utc(moment(nextArrival, "HH:mm").diff(moment(now, "HH:mm"))).format("HH:mm")
            console.log(difference);
            var diffMinutes = moment.duration(difference).as('minutes')
            console.log(diffMinutes);

            // var hhmmFrequency = moment(sv.frequency).format("HH:mm");
            // console.log(hhmmFrequency);


            // nextArrival = moment(sv.firstTrain, "HH:mm").add(sv.frequency, 'minutes').format('HH:mm');
            // console.log(nextArrival);

            function findNext() {
              nextArrival = moment(nextArrival, "HH:mm").add(sv.frequency, 'm').format('HH:mm');
              difference = moment.utc(moment(nextArrival, "HH:mm").diff(moment(now, "HH:mm"))).format("HH:mm")
              diffMinutes = moment.duration(difference).as('minutes')
              console.log(nextArrival);
              console.log(difference);
              console.log(diffMinutes);

              if (diffMinutes > sv.frequency) {
                findNext();
             }

            }

        
            if (diffMinutes > sv.frequency) {
               findNext();
            }

  let tRow = $("<tr>");

  // converts time of next train into hh:mm a
  var nextArrivalAMPM = moment(nextArrival, "HH:mm").format('LT');

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