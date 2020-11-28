//use mqtt module
var mqtt = require('mqtt')

//connect client (this server) to local mqtt broker
var client  = mqtt.connect('mqtt://localhost:1883');


//set up client's callback function for on (successfully) connecting
client.on('connect', function() {
    console.log("\n MQTT Connected!\n");

    //subscribe to selected topic(s)
    client.subscribe("face-api-NR/emotions-detected", {qos: 1});
    client.subscribe("face-api-NR/labelled-image", {qos: 1});
});
 

//set up client's callback function for on receiving a message
client.on('message', function(topic, message) {
    //('message' is Buffer)
    
    //display message in console
    //console.log("Message recieved from Topic '" + topic + "' --", message.toString(), "\n");
    
    //display published emotion message
    if (topic == "face-api-NR/emotions-detected")
    {
        console.log("Message recieved from Topic '" + topic + "' --", message.toString(), "\n");
    }
    else if (topic == "face-api-NR/labelled-image")
    {
        //for image, indicate that it was received, but do not display full buffer content
        console.log("Message recieved from Topic '" + topic + "' (Image data).\n");
    }

    //client.end();
});


//------
//additional callback functions
client.on('close', () => {
    console.log("\n MQTT client disconnected.\n");
});

client.on('error', (err) => {
    console.log("\n ERROR:", err, "\n");
    client.end();
});
