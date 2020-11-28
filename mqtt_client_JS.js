
//--MQTT SET UP CODE

//set up variables needed to connect to mqtt broker using mqtt-over-websockets
var mws_broker = "localhost";
var mws_port = 9001;

//create client using Paho Library
var client = new Paho.MQTT.Client(mws_broker, mws_port, "myclientid_" + parseInt(Math.random()*100, 10));

//set up client's onConnectionLost callback function
client.onConnectionLost = function(responseObject) {
    console.log("\nConnection Lost:", responseObject.errorMessage, "\n");
}

//set up client's onMessageArrived callback function
client.onMessageArrived = function(message) {
    console.log("\nMessage Arrived:\n\t", message.destinationName, ' -- ', message.payloadString);

    //display on HTML page
    //$("#resultsDisplay").append(message.destinationName, ' -- ', message.payloadString);
    //$("#resultsDisplay").append("<br/><hr/><br/>");

    if (message.destinationName == "face-api-NR/labelled-image")
    {
        //parse image (sent in JSON object as base-64 format)
        var labelled_image = JSON.parse(message.payloadString).labelledImage;

        //display labelled image on page 
        $("#resultsDisplay").append('<img src="data:image/jpg;base64,' + labelled_image + '" class="card-img-top" alt="Labelled Image" width="30%" height="auto"/>');
        
    }
    else if (message.destinationName == "face-api-NR/emotions-detected")
    {
        //parse expressions array (sent in JSON object)
        var expressionsDetectedArr = JSON.parse(message.payloadString).expressions;

        //create message to display based on emotion(s) returned
        var emotionMessages = "";

        //handle if the array returned is empty (no expressions detected)
        if (expressionsDetectedArr.length == 0)
        { emotionMessages += "Oh no! It seems that no expressions were detected in the image. Take another image and try again!<br/>"; }

        //handle all expressions returned
        for (anExpression of expressionsDetectedArr)
        {
            console.log("In Loop: Current 'anExpression' =", anExpression);
            switch(anExpression)
            {
                case "happy":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>happy</span>, glad to see it!<br/>";
                    break;
                case "sad":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>sad</span>, cheer up!<br/>";
                    break;
                case "suprised":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>suprised</span>, hope it's good news!<br/>";
                    break;
                case "angry":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>angry</span>, hope you feel happier soon!<br/>";
                    break;
                case "disgusted":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>disgusted</span>, what's with the sour look?<br/>";
                    break;
                case "fearful":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>fearful</span>, don't worry, it's okay!<br/>";
                    break;
                case "neutral":
                    emotionMessages += "Someone seems <span style='font-weight:bold;'>neutral</span>, don't be afraid to be more expressive!<br/>";
                    break;
            }
        }

        //display emotions messsage(s) on page 
        $("#resultsDisplay").append('<p style="color:green;">' + emotionMessages + '</p>');
        console.log("Emotions Messages displayed:", emotionMessages);
    }
}

//set options for MQTT connection
var options = {
    timeout: 3,
    onSuccess: function() {         //connection to MQTT broker was successful
        console.log("\nMQTT Connected!\n");

        //subscribe to selected topic(s)
        client.subscribe("face-api-NR/emotions-detected", {qos: 1});
        client.subscribe("face-api-NR/labelled-image", {qos: 1});

    },
    onFailure: function(message) {  //connection to MQTT broker was unsuccessful
        console.log("\nMQTT Connection failed:", message.errorMessage, "\n");
    }
}

//---------------------------------------------------------

function setUpMQTTClient()  //called on load of HTML page
{
    //connect client
    client.connect(options);   
}
