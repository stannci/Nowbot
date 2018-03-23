var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '9a4b00d6-fcc7-48da-94cf-649b05b855ea',
    appPassword: 'ksUW806@|)!yfknbETZZZ23'
});

// Listen for messages from users 
var bot = new builder.UniversalBot(connector) ;
server.post('/api/messages', connector.listen());

//-------------------------------
//recognizers
//---------------
var recognizer = cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: '957d859b-f94c-42dd-9ce4-e6211eb693b6',
    subscriptionKey: '3799561d36b346ac823fab897f53d590'});

    var BasicQnAMakerDialog = cognitiveservices.QnAMakerDialog({
        recognizers: [recognizer],
        defaultMessage: 'No good match in FAQ.',
        qnaThreshold: 0.5 }
    );

/*This is a prototype and uses a waterfall technique to prompt users for input.*/

var bot = new builder.UniversalBot(connector, [
    
    function (session) {
        session.send("Welcome to the Plus Nine Design Bot.");
        builder.Prompts.choice(session, "please choose an option from below?", "Website|Logo|Domain", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
       

        
    },
    function (session, results) {
        session.dialogData.Budget = results.response;
        builder.Prompts.text(session, "Please provide us with your current website name or company name?");
    },
    function (session, results) {
        session.dialogData.Name = results.response;
        

        // Process request and display details
        session.send(`Thank you! Consultation set.  details: <br/>Date/Time: ${session.dialogData.Date} <br/>Budget: ${session.dialogData.Budget} <br/>Name: ${session.dialogData.Name}`);
        session.endDialog();
    }

    
]);