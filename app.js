var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');


var local = true;

//For HTTPS
var https_options = {};
if (!local) {
    var fs = require('fs');
    https_options = {
        key: fs.readFileSync('/etc/letsencrypt/live/your.domain/privkey.pem'),
        certificate: fs.readFileSync('/etc/letsencrypt/live/your.domain/fullchain.pem'),
    };
}




// Setup Restify Server
var server = restify.createServer(https_options);

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



// Main menu
var menuItems = { 
      "Website Design": {
          item: "orderWebsite"
      },
      "Login/Sign Up": {
          item: "login"
      },
    
      "Logo": {
          item: "logo"
      },
      "SignIn": {
        item: "SignIn"
    },
      "Request Free Consultation call": {
          item: "freecon"
      },
       //...other menu items...,
       "Check out": {
            Description: "Check out",
            Price: 0 // Order total. Updated as items are added to order.
        }
  }
     var inMemoryStorage = new builder.MemoryBotStorage();
  
  // This is a reservation bot that has a menu of offerings.
  var bot = new builder.UniversalBot(connector, [
      function(session){
          session.send("Welcome to Plus Nine Design. say Main Menu to view our services! ");
         
      }
  ]).set('storage', inMemoryStorage); // Register in-memory storage 
  
  // Display the main menu and start a new request depending on user input.
  bot.dialog("mainMenu", [
      function(session){
          builder.Prompts.choice(session, "main menu:", menuItems);
      },
      function(session, results){
          if(results.response){
              session.beginDialog(menuItems[results.response.entity].item);
          }
      }
  ])
  .triggerAction({
      // The user can request this at any time.
      // Once triggered, it clears the stack and prompts the main menu again.
      matches: /^main menu $/i,
      confirmPrompt: "This will cancel your request. Are you sure?"
  });



  
//oder website

bot.dialog('orderWebsite', [
      function(session){
          session.send("Lets build you a website!");
          session.beginDialog("addItem");
      },
      function (session, results) {
          if (results.response) {
              // Display itemize order with price total.
              for(var i = 1; i < session.conversationData.orders.length; i++){
                  session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
              }
              session.send(`Your total is: $${session.conversationData.orders[0].Price}`);
  
              // Continue with the check out process.
              builder.Prompts.text(session, "What is your email address");
          } 
      },
      function(session, results){
          if(results.response){
              session.dialogData.room = results.response;
              var msg = `Thank you. Your order confirmation will be sent to #${results.response}`;
              session.send(msg);
              session.replaceDialog("ShowServices");
          }
      }
  ])

  //...attached triggers...
  
            .reloadAction(
      "restartOrderDinner", "Ok. Let's start over.",
      {
          matches: /^start over$/i
      }
  )
  .cancelAction(
      "cancelOrder", "Type 'Main Menu' to continue.", 
      {
          matches: /^cancel$/i,
          confirmPrompt: "This will cancel your order. Are you sure?"
      }
  );

 
      // The Website menu
      var websiteMenu = { 
            "Landing Page": {
                  item: "Landing Page",
                  Description: "A Landing Page to kickstart your online journey, Type 'Cancel' if you want to cancel your order",
                  Price:"250"
              },
              "Template Website": {
                  item: "Template website",
                  Description:"Premium website templates to build you the website you need , Type 'Cancel' if you want to cancel your order",
                  Price: "450"
                  
              },
              "Custom Wesbite": {
                  item: "Customized website",
                  Description:"Fully Customized Website, for people who need that bit extra. 10+ pages , Type 'Cancel' if you want to cancel your order",
                  Price: "750"

              },
              "Platinum Website": {
                  item: "Platinum Website",
                  Desciption: "Everything you need, unlimited pages and revisions , Type 'Cancel' if you want to cancel your order",
                  Price: "1500"
              },
              "Request Free Website Consultation":{
                  Description: "Book in with one of our website developers for a free website consultation to find out what suits you best , Type 'Cancel' if you want to cancel your order",
                  Price:"Free"
              },
              "Check out": {
                  Description: "Check out",
                  Price: 0// Order total. Updated as items are added to order.
              }
              
            
        }; 

        // Add services until the user decides to checkout. 
bot.dialog("addItem", [
      function(session, args){
          if(args && args.reprompt){
              session.send("is there anymore services you require?");
          }
          else{
              // New order
              // Using the conversationData to store the orders
              session.conversationData.orders = new Array();
              session.conversationData.orders.push({ 
                  Description: "Check out",
                  Price: 0
              })
          }
          builder.Prompts.choice(session, "Our website services:", websiteMenu);
      },
      function(session, results){
          if(results.response){
              if(results.response.entity.match(/^check out$/i)){
                  session.endDialog("Checking out...");
              }
              else {
                  var order = websiteMenu[results.response.entity];
                  session.conversationData.orders[0].Price += order.Price; // Add to total.
                  var msg = `You ordered: ${order.Description} for a total of €${order.Price}.`;
                  session.send(msg);
                  session.conversationData.orders.push(order);
                  session.replaceDialog("addItem", { reprompt: true }); // Repeat dinner menu
              }
          }
      }
  ])
 

  
  .reloadAction(
      "restartOrder", "Ok. Let's start over.",

      {
          matches: /^start over$/i
      }
  );


//Logo functionality

bot.dialog('logo', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Silver Logo €80")
            .subtitle("A Logo to use online")
            .text("Price is €80 (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL-a1LDdFjlOtkUk8s1EdF8CvB0saD-lv_9n51iK_aOddUkvGi')])
            .buttons([
                builder.CardAction.imBack(session, "buy Silver Logo", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Gold Logo €199")
            .subtitle("100% design from scratch")
            .text("Price is €199 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://www.silentdiscoireland.ie/wp-content/uploads/2012/08/GoldPackage_Silent-Disco.gif')])
            .buttons([
                builder.CardAction.imBack(session, "buy Gold Logo", "Buy")
            ])

            

    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });

// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonClick', [
    function (session, args, next) {

        // Get the details of the logo they are ordering

        var utterance = args.intent.matched[0];
        var color = /(standard|premium)/i.exec(utterance);
        var size = /\b(Extra Large|Large|Medium|Small)\b/i.exec(utterance);
        if (color) {

            // Initialize cart item
            var item = session.dialogData.item = { 
                product: "classic " + color[0].toLowerCase() + " t-shirt",
                size: size ? size[0].toLowerCase() : null,
                price: 80.0,
                qty: 1
            };
            if (!item.size) {

                // Prompt for size
                builder.Prompts.choice(session, "What size would you like?", "Small|Medium|Large|Extra Large");
            } else {

                //Skip to next waterfall step
                next();
            }
        } else {
            // Invalid product
            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {
        // Save size if prompted
        var item = session.dialogData.item;
        if (results.response) {
            item.size = results.response.entity.toLowerCase();
        }

        // Add to cart
        if (!session.userData.cart) {
            session.userData.cart = [];
        }
        session.userData.cart.push(item);

        // Send confirmation to users
        session.send("A '%(size)s %(product)s' has been added to your cart.", item).endDialog();
    }
]).triggerAction({ matches: /(buy|add)\s.*shirt/i });




//Free Consultation


bot.dialog('freecon', [
    function(session){
   
      

      
              session.send("Welcome! thanky ou for the interest in booking a consulation call! please fill out the form below and we will contact you on your desired date and time. We look forward to talking to you.");
              builder.Prompts.time(session, "Please provide a consultation date and time (e.g.: June 6th at 5pm)");
          },
          function (session, results) {
              session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);
              builder.Prompts.choice(session, "What are you interested in?", ["websites","logo","SEO", "Branding"]);
          },
          function (session, results) {
              session.dialogData.Size = results.response;
              builder.Prompts.text(session, "what is your full name??");
          },
          function (session, results) {
              session.dialogData.conName = results.response;
      
              // Process request and display reservation details
              session.send(`Consultation confirmed. The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
              session.endDialog();
          }
      ])


      bot.dialog('login', function (session, args) {
        if (!session.userData.greeting) {

            session.send("Hello. What is your name?");
            session.userData.greeting = true;

        } else if (!session.userData.name) {
            getName(session);


        } else if (!session.userData.email) {
            getEmail(session);


        } else if (!session.userData.password) {
            getPassword(session);
        } else {
            session.userData = null;
        }
      
    });

    function getName(session) {
        name = session.message.text;
        session.userData.name = name;
        session.send("Hello, " + name + ". What is your Email ID?");
    }
        

    function getEmail(session) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        email = session.message.text;
        if (re.test(email)) {
            session.userData.email = email;
            session.send("Thank you, " + session.userData.name + ". Please set a new password.");
        } else {
            session.send("Please type a valid email address. For example: test@hotmail.com");
        }
    }

    function getPassword(session) {
        var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        password = session.message.text;
        if (re.test(password)) {
            session.userData.password = password;
            var data = session.userData;
            sendData(data, function (msg) {
                session.send(msg);
                session.userData = null;
            });
        } else {
            session.send("Password must contain at least 8 characters, including at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character. For example: Mybot@123");
        }
    }


    function sendData(data, cb) {
        http.get("http://local.dev/github/Nowbot/saveData.php?name=" + data.name + "&email=" + data.email + "&password=" + data.password, function (res) {
            var msg = '';
            res.on("data", function (chunk) {
                msg += chunk;
            });
    
            res.on('end', function () {
                cb(msg);
            });
    
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    }


    /*
    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }

    // Display Welcome card with Hotels and Flights search options
    var card = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type': 'AdaptiveCard',
            'version': '1.0',
            'body': [
                {
                    'type': 'Container',
                    'speak': '<s>Hello!</s><s>?</s>',
                    'items': [
                        {
                            'type': 'ColumnSet',
                            'columns': [
                                {
                                    'type': 'Column',
                                    'size': 'auto',
                                    'items': [
                                        {
                                            'type': 'Image',
                                            'url': 'http://plusninedesign.com/wp-content/uploads/2017/05/cropped-plus-nine-design-2.jpg',
                                            'size': 'large',
                                            'style': 'person'
                                        }
                                    ]
                                },
                                {
                                    'type': 'Column',
                                    'size': 'stretch',
                                    'items': [
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Hello!',
                                            'weight': 'bolder',
                                            'isSubtle': true
                                        },
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Are you looking for consultation call?',
                                            'wrap': true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            'actions': [
                // con call
                {
                    'type': 'Action.ShowCard',
                    'title': 'Free Consultation call',
                    'speak': '<s>Call</s>',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'Welcome to the consultation booker!',
                                'speak': '<s>Welcome to consultation call !</s>',
                                'weight': 'bolder',
                                'size': 'large'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'What time suits you?'
                            },
                            {
                                'type': 'Input.Text',
                                'id': 'time',
                                'speak': '<s>Please enter your time</s>',
                                'placeholder': '9am-7pm',
                                'style': 'text'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'What date suits you?'
                            },
                            {
                                'type': 'Input.Date',
                                'id': 'date',
                                
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'What services are you interested in?'
                            },
                            {
                                'type': 'Input.Text',
                                'id': 'nights',
                                'speak': '<s>What services are you interested in?</s>',
                                'placeholder': 'Logo'
                            }
                        ],
                        'actions': [
                            {
                                'type': 'Action.Submit',
                                'title': 'Submit',
                                'speak': '<s>Submit</s>',
                                'data': {
                                    'type': 'ConForm'
                                }
                            }
                        ]
                    }
                },








               
            ]
        }
    };

    var msg = new builder.Message(session)
        .addAttachment(card);
    session.send(msg);


*/
  




    