module.exports = function (session) {
    // Generate ticket
    var tickerNumber = Math.ceil(Math.random() * 20000);

    // Reply and return to parent dialog
    session.send('Your message \'%s\' was recieved. If you are stuck just try these commands > "Main Menu" "Cancel" "Start Over" ', session.message.text);
    
    session.send('Thanks for contacting our support team. Your ticket number is %s.', tickerNumber);

    session.endDialogWithResult({
        response: tickerNumber
    });
};