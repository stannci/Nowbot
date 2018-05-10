
var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

var local = true;


// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

   console.log('%s listening to %s', server.name, server.url); 
});


// Create chat connector for communicating with the Bot Framework Service
var appId = "c8928f39-dac0-46e7-831e-0f7b845616ab";
var appPassword="dukIL144;:!kusnREHPC98^";

var connector = new builder.ChatConnector({
    appId: appId,
    appPassword:appPassword
});



    server.post('/api/messages', connector.listen());




var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: '38a927e6-693e-430c-9690-ae3e22594788', // process.env.QnAKnowledgebaseId, 
    subscriptionKey: ' 4e45e350-f5fe-417e-add7-44c083a1722b'}); //process.env.QnASubscriptionKey});

    
var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
recognizers: [recognizer],
defaultMessage: 'No match! Try changing the query terms!',
qnaThreshold: 0.3}
);



       

            var documentDbOptions = {

           host: 'https://plusninebot.documents.azure.com:443/', 
           masterKey: 'LFq3KuMXGKSfx6bzasFCLGojc9luLrRRXKxXFD6c7uzMDJ8xH9DQdtMUcgoiI00tMLrTLC8A30kTHUZI6ALChw==', 
           database: 'botdocs',   
           collection: 'botdata'

            };


                var docDbClient = new azure.DocumentDbClient(documentDbOptions);

                var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

                



               var luisAppId="ecfd8615-4745-49f8-84ba-aa814f9dac4c";
               var luisAPIKey="7ee2792f7e6c467fb396b0024e3789fd";
               var luisAPIHostName="westus.api.cognitive.microsoft.com";


                const luisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' +luisAPIKey;

                var recognizer = new builder.LuisRecognizer(luisModelUrl);
                var intents = new builder.IntentDialog({

                recognizers: [recognizer]

                        });

                        bot.dialog('/', intents);


//greet the user with a welcoming message and instructions on how to use the bot and what services are offered.
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text('Hi! Im NowBot, I will be your assitant today!\n\n I am here to help you with any of your web design needs, What can help you with?\n\nWebsite Services\nLogo Packages\nSEO Packages\nExplore Blog, Podcast and more\nFree Consultation\n\n To get to our Main Menu just say main menu. To cancel any request , just say cancel.')
                    

                bot.send(reply);
            }
        });
    }
});





//language understanding for general words/phrases that a user may enter such as hi hello morning etc
intents.matches('Repsonse', (session, args, next ) => {
    
    session.send("Hello! Welcome to the Plus Nine Design chatbot, To begin the conversation just say Main Menu to view our services. If you are stuck at anytime just say help.")
    var msg = new builder.Message(session)
    .addAttachment({
        contentUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/26166838_1608076352602067_8006391031418389035_n.jpg?_nc_cat=0&oh=83c05b60ad9e8cd9f49518d225043fa7&oe=5B93CD62',
        contentType: 'image/jpg',
        name: 'plusninedesign.jpg',
            
    });

session.send(msg);
;  
    

});




//language understanding for words/phrases related to a user looking for a website.
intents.matches('browseWebsites', (session, args, next ) => {
    var savedAddress = session.message.address;
    session.send("sure I can help you here, Have a look at our services we offer below! If you want to get in contact at anytime just say 'Book Consultation' ")

    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }

    // Display the website services and packages
    var card = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type': 'AdaptiveCard',
            'version': '1.0',
            'body': [
                {
                    'type': 'Container',
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
                                            'url': 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/26166838_1608076352602067_8006391031418389035_n.jpg?_nc_cat=0&oh=83c05b60ad9e8cd9f49518d225043fa7&oe=5B93CD62',
                                            'size': 'medium',
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
                                            'text': 'Here are our Web Design services',
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
                
                {
                    'type': 'Action.ShowCard',
                    'title': 'One Page Website',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body':[
                            {
                                'type': 'TextBlock',
                                'text': 'One Page Websites experts',
                                "style": "auto",
                                "size": "auto",
                                'weight': 'bolder'

                            } ,
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Cost",
                                        "value": "€449"
                                    },
                                    {
                                        "title": "Devlopment Time",
                                        "value": "3 weeks"
                                    },
                                    {
                                        "title": "Content Managment",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Domain included",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Hosting",
                                        "value": "Yes"
                                    }
                                ]
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Have a look at some of our work below',
                                'weight': 'bolder'
                            },
                            {
                                "type": "Image",
                                "url": "http://blog.jejualan.com/wp-content/uploads/2014/11/4.jpg",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.alirevite.fr/wp-content/uploads/2016/03/responsive_design.png",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.icore.net.in/wp-content/uploads/2017/12/Ecommerce-Website-Development.jpg",
                                "size": "auto",
                                "style": "auto"
                              }
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "http://plusninedesign.com/contact-plus-nine/",
                              "title": "Get in touch"
                            }
                          ]
                    }
                },
                {
                    'type': 'Action.ShowCard',
                    'title': 'Wordpress Website',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'We specialise in Wordpress',
                                "style": "auto",
                                "size": "auto",
                                'weight': 'bolder'

                            } ,
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Cost",
                                        "value": "€1500"
                                    },
                                    {
                                        "title": "Devlopment Time",
                                        "value": "3 weeks"
                                    },
                                    {
                                        "title": "Content Managment",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Domain included",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Hosting",
                                        "value": "Yes"
                                    }
                                ]
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Have a look at some of our work below',
                                'weight': 'bolder'
                            },
                            {
                                "type": "Image",
                                "url": "http://blog.jejualan.com/wp-content/uploads/2014/11/4.jpg",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.alirevite.fr/wp-content/uploads/2016/03/responsive_design.png",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.icore.net.in/wp-content/uploads/2017/12/Ecommerce-Website-Development.jpg",
                                "size": "auto",
                                "style": "auto"
                              }
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "http://plusninedesign.com/contact-plus-nine/",
                              "title": "Get in touch"
                            }
                          ]
                    }
                },

                {
                    'type': 'Action.ShowCard',
                    'title': 'E-Commerce Store',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'We specialise in E-commerce',
                                "style": "auto",
                                "size": "auto",
                                'weight': 'bolder'

                            } ,
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Cost",
                                        "value": "€1500"
                                    },
                                    {
                                        "title": "Devlopment Time",
                                        "value": "3 weeks"
                                    },
                                    {
                                        "title": "Products included",
                                        "value": "50+"
                                    },
                                    {
                                        "title": "Domain included",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Hosting",
                                        "value": "Yes"
                                    }
                                ]
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Have a look at some of our work below',
                                'weight': 'bolder'
                            },
                            {
                                "type": "Image",
                                "url": "http://blog.jejualan.com/wp-content/uploads/2014/11/4.jpg",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.alirevite.fr/wp-content/uploads/2016/03/responsive_design.png",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "http://www.icore.net.in/wp-content/uploads/2017/12/Ecommerce-Website-Development.jpg",
                                "size": "auto",
                                "style": "auto"
                              }
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "http://plusninedesign.com/contact-plus-nine/",
                              "title": "Get in touch"
                            }
                          ]
                    }
                }, {
                    'type': 'Action.ShowCard',
                    'title': 'Custom Website',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'We do many different custom websites for clients',
                                "style": "auto",
                                "size": "auto",
                                'weight': 'bolder'

                            } ,
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Cost",
                                        "value": "€899"
                                    },
                                    {
                                        "title": "Devlopment Time",
                                        "value": "3-5 weeks"
                                    },
                                    {
                                        "title": "Domain included",
                                        "value": "Yes"
                                    },
                                    {
                                        "title": "Pages included",
                                        "value": "20+"
                                    },
                                    {
                                        "title": "Hosting",
                                        "value": "Yes"
                                    }
                                ]
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Have a look at some of our work below',
                                'weight': 'bolder'
                            },
                            {
                                "type": "Image",
                                "url": "https://eac.com.au/wp-content/uploads/sites/3/2017/05/estate-agents-cooperative-eac-services-real-estate-agency-websites-secondary-placeholder.png",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "https://appyourself.net/wp-content/uploads/2017/03/Mobile-Website-Checker_optimiert-fu%CC%88r-alle-Gera%CC%88te.png",
                                "size": "auto",
                                "style": "auto"
                              },
                              {
                                "type": "Image",
                                "url": "https://i1.wp.com/www.leaodejudah.com.br/wp-content/uploads/2018/01/mobile-websites.png?fit=854%2C508",
                                "size": "auto",
                                "style": "auto"
                              }
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "http://plusninedesign.com/web-design-2/",
                              "title": "Get in touch"
                            }
                          ]
                    }
                }
            ]
        }
    };


              var msg = new builder.Message(session)
               .addAttachment(card);
               session.send(msg);
               })
   


//language understanding to understand for blog, podcast , videos, explore area
intents.matches('Learn', (session, args, next ) => {
    session.send("Hey, If you want to explore our extra services just type explore!")
    });



intents.matches('BookConsultation', (session, args, next ) => {
    var savedAddress = session.message.address;
    session.send("Perfect, Please Fill out the form below to book your free sonsultation!");
    if (session.message && session.message.value) {
        // A Card's Submit Action obj was received
        processSubmitAction(session, session.message.value);
        return;
    }

    // Display adaptive card to help user get in touch with designer
    var card = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type': 'AdaptiveCard',
            'version': '1.0',
            'body': [
                {
                    'type': 'Container',
                    'speak': '<s>i!</s><s>Welcome to consultation booker</s>',
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
                                            'url': 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/26166838_1608076352602067_8006391031418389035_n.jpg?_nc_cat=0&oh=83c05b60ad9e8cd9f49518d225043fa7&oe=5B93CD62',
                                            'size': 'medium',
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
                                            'text': 'Lets book your consultation!?',
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
                // Book consulatation
                {
                    'type': 'Action.ShowCard',
                    'title': 'Book Now',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'Welcome to our consultation booker!', 
                                'weight': 'bolder',
                                'size': 'large'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Please enter your Location:'
                            },
                            {
                                'type': 'Input.Text',
                                'id': 'destination',  
                                'placeholder': 'Dublin, Ireland',
                                'style': 'text'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Choose a date'
                            },
                            {
                                'type': 'Input.Date',
                                'id': 'checkin',
                                
                            },
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "http://plusninedesign.com/contact-plus-nine/",
                              "title": "Submit"
                            }
                          ]
                    }
                },
                {
                    'type': 'Action.ShowCard',
                    'title': 'Call',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'You can call us Monday-Saturday 9am-7pm',
                                'weight': 'bolder'
                            } 
                        ],
                        "actions": [
                            {
                              "type": "Action.OpenUrl",
                              "url": "085 163 1955",
                              "title": "085 195 1344"
                            }
                          ]
                    }
                },
               
            ]
        }
        
    }
    


    var msg = new builder.Message(session)
    .addAttachment(card);
session.send(msg);
})
   


intents.matches('BrowseLogos', (session, args, next ) => {
    session.send("Thnkas for an interest in our logos! to view our logos say main menu")
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Silver Logo Package")
            .subtitle("A logo to make your brand instantly regognisible")
            .text("Price is €75")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1498075702571-ecb018f3752d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f4306ec4bfa5375e2483126ebbdd1171&auto=format&fit=crop&w=757&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy silver logo", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Gold Logo Package")
            .subtitle("100% design from sketch.")
            .text("Price is €199")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ed20c08f9e2dc8995ba70589a1ee4051&auto=format&fit=crop&w=749&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy gold logo", "Buy")
            ])
    ]);



    
    
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });




    

intents.matches('browseSEO', (session, args, next ) => {
    session.send("Thnkas for an interest in our seo packages ! Have a look at some of our packages below")
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("SEO Bronze Package")
            .subtitle("Start your SEO Journey")
            .text("Price is €250 per month")
            .images([builder.CardImage.create(session, 'http://randyscarwash.com/wp-content/uploads/2016/09/bronze-300x300-2.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy bronze SEO", "Buy SEO")
            ]),
        new builder.HeroCard(session)
            .title("Silver SEO Package")
            .subtitle("Get to the #1 page on Google")
            .text("Price is €850 per month")
            .images([builder.CardImage.create(session, 'https://armconvention.com/wp-content/uploads/2017/05/Silver-Package-Graphics-Design.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy silver SEO", "Buy SEO")
            ]),
            new builder.HeroCard(session)
            .title("Gold SEO Package")
            .subtitle("Top 3 on #1 page of Goole")
            .text("Price is €1499 per month")
            .images([builder.CardImage.create(session, 'https://www.conciergeservicesverrado.com/wp-content/uploads/2017/09/Gold-Package-Graphics-Design-1.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy gold SEO", "Buy SEO")
            ]),
            new builder.HeroCard(session)
            .title("Platinum SEO Package")
            .subtitle("100% #1 spot on first page of Google")
            .text("Price is €2500 per month")
            .images([builder.CardImage.create(session, 'http://www.designvamp.com/wp-content/uploads/2015/07/Platinum-Package-Graphics-Design.png.pagespeed.ce.AuPHwKiMkO.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy platinum SEO", "Buy SEO")
            ])
    ]);
    session.send(msg).endDialog();



})



// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonSEO', [
    function (session, args, next) {
        // Get color and optional size from users utterance
        var utterance = args.intent.matched[0];
        var color = /(bronze|silver|gold|platinum)/i.exec(utterance);
        var size = /\b(1 month|3 months|6 months|12 months)\b/i.exec(utterance);
        if (color) {
            // Initialize cart item
            var item = session.dialogData.item = { 
                product: "SEO"  + color[0].toLowerCase() +  " Package",
                size: size ? size[0].toLowerCase() : null,
                
                qty: 1
            };
            if (!item.size) {
                // Prompt for size
                builder.Prompts.choice(session, "Select the time of contract?", "1 month|3 months|6 months|12 months");
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
        session.send("Your almost there!A '%(size)s %(product)s is a great choice!' Please fill out the questions below in relation to your Logo", item) ,
      
    session.send("Thank you for your interest in purchasing a logo , please answer these questions and we will be in touch");
                       builder.Prompts.time(session, "What date do you need your Logo for?");
                   },
                   function (session, results) {
                       session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);
                       builder.Prompts.text(session, "What is your email address");
                       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                       email = session.message.text;
                       if (re.test(email)) {
                           session.userData.email = email;
                           
                       } else {
                           session.send("Please type a valid email address. For example: test@hotmail.com");
                       }
                   
                   },
                   function (session, results) {
                       session.dialogData.Size = results.response;
                       builder.Prompts.text(session, "what is your full name??");
                   },
                   function (session, results) {
                       session.dialogData.conName = results.response;
               
                       // Process request and display reservation details
                       session.send(`Logo confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                       session.endDialog();
                   }
    
     


]).triggerAction({ matches: /(buy|add)\s.*SEO/i });

// Main menu
var menuItems2 = { 
    
    "Explore now": {
        item: "explore"
    },
    "Home": {
        item: "mainmenu"
    },

    
}


// Display the main menu and start a new request depending on user input.
bot.dialog("tutorialMenu", [
  function(session){
      builder.Prompts.choice(session, "Welcome to our Exploring Section:\n\n ", menuItems2);
      
  },
  function(session, results){
      if(results.response){
          session.beginDialog(menuItems2[results.response.entity].item);
      }
  }
])
.triggerAction({
  // The user can request this at any time.
  // Once triggered, it clears the stack and prompts the main menu again.
  matches: /^explore$/i,
  confirmPrompt: "This will cancel your request. Are you sure?"
});




// Main menu
var menuItems = { 
     
      "Login/Sign Up": {
          item: "signin"
      },
    
      "Logo": {
          item: "logo"
      }, 
        "FAQ": {
        item: "FAQ"
    },
    "SEO": {
        item: "SEO"
    },
      "Request Free Consultation call": {
          item: "explore"
      },
    
  }
 


  // Display the main menu and start a new request depending on user input.
  bot.dialog("mainMenu", [
    function(session){
        builder.Prompts.choice(session, "This is our Main Menu:  ", menuItems);
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

// Help
bot.dialog('support', require('./support'))
.triggerAction({
  matches: [/help/i, /support/i, /problem/i]
});

// log any bot errors into the console
bot.on('error', function (e) {
console.log('And error ocurred', e);
});




bot.dialog('signin', [
    

    
            function (session) {
                builder.Prompts.choice(session, 'Choose Sign in', CardNames1, {
                maxRetries: 3,
                retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
                           });
                    },
                        function (session, results) {

                  // create the card based on selection
                       var selectedCardName = results.response.entity;
                      var card = createCard(selectedCardName, session);

                      // attach the card to the reply message
                      var msg = new builder.Message(session).addAttachment(card);
                       session.send(msg);
                    }
            ]       )


               var SigninCardName = 'Sign-in card';
               var CardNames1 = [ SigninCardName,];


                          function createCard(selectedCardName, session) {
                          switch (selectedCardName) {
    
                   case SigninCardName:
                    return createSigninCard(session);
    
               }
        }

function createSigninCard(session) {
return new builder.SigninCard(session)
    .text('BotFramework Sign-in Card')
    .button('Sign-in', 'https://login.microsoftonline.com');
}


  
  // Display the main menu and start a new request depending on user input.
  bot.dialog("websiteMenu", [
      function(session){
          builder.Prompts.choice(session, "This is our Main Menu:  ", websiteMenu);
      },
      function(session, results){
          if(results.response){
              session.beginDialog(websiteMenu[results.response.entity].item);
          }
      }
  ])
  .triggerAction({
      // The user can request this at any time.
      // Once triggered, it clears the stack and prompts the main menu again.
      matches: /^website menu $/i,
      confirmPrompt: "This will cancel your request. Are you sure?"
  });


// log any bot errors into the console
bot.on('error', function (e) {
console.log('And error ocurred', e);
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
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              email = session.message.text;
              if (re.test(email)) {
                  session.userData.email = email;
                  session.send("Thank you, " + session.userData.name + ". Please set a new password.");
              } else {
                  session.send("Please type a valid email address. For example: test@hotmail.com");
              }
          
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



// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});



//Logo functionality

bot.dialog('logo', function (session) {

    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Silver Logo Package")
            .subtitle("A logo to make your brand instantly regognisible")
            .text("Price is €75")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1498075702571-ecb018f3752d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f4306ec4bfa5375e2483126ebbdd1171&auto=format&fit=crop&w=757&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy silver logo", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Gold Logo Package")
            .subtitle("100% design from sketch.")
            .text("Price is €199")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ed20c08f9e2dc8995ba70589a1ee4051&auto=format&fit=crop&w=749&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy gold logo", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });





// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonClick', [
    function (session, args, next) {
        // Get color and optional size from users utterance
        var utterance = args.intent.matched[0];
        var color = /(silver|gold)/i.exec(utterance);
        var size = /\b( Entrepreneur|Start Up|Blogger|Business)\b/i.exec(utterance);
        if (color) {
            // Initialize cart item
            var item = session.dialogData.item = { 
                product: "Logo"  + color[0].toLowerCase() +  " Package",
                size: size ? size[0].toLowerCase() : null,
                
                qty: 1
            };
            if (!item.size) {
                // Prompt for size
                builder.Prompts.choice(session, "What matches you most?", "Business|Blogger|Start Up|Entrepreneur");
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
        session.send("Your almost there!A '%(size)s %(product)s is a great choice!' Please fill out the questions below in relation to your Logo", item) ,
      
    session.send("Thank you for your interest in purchasing a logo , please answer these questions and we will be in touch");
                       builder.Prompts.time(session, "What date do you need your Logo for?");
                   },
                   function (session, results) {
                       session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);
                       builder.Prompts.text(session, "What is your email address");
                       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                       email = session.message.text;
                       if (re.test(email)) {
                           session.userData.email = email;
                           
                       } else {
                           session.send("Please type a valid email address. For example: test@hotmail.com");
                       }
                   
                   },
                   function (session, results) {
                       session.dialogData.Size = results.response;
                       builder.Prompts.text(session, "what is your full name??");
                   },
                   function (session, results) {
                       session.dialogData.conName = results.response;
               
                       // Process request and display reservation details
                       session.send(`Logo confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                       session.endDialog();
                   }
    
     


]).triggerAction({ matches: /(buy|add)\s.*logo/i });







//Free Consultation


bot.dialog('freeCn', [
    function(session){
   
    


        
              session.send("Welcome! thank you for the interest in booking a consulation call! please fill out the form below and we will contact you on your desired date and time. We look forward to talking to you.");
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
      
      .cancelAction(
        "cancelOrder", "Type 'Main Menu' to continue.", 
        {
            matches: /^Free Con$/i,
            confirmPrompt: "This will cancel your order. Are you sure?"
        }) ;



        bot.dialog('explore', [
            
        function (session) {
            builder.Prompts.choice(session, 'What would you like to explore?? Say main menu anytime to exit.', CardNames, {
                maxRetries: 3,
                retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
            });
        },
        function (session, results) {
    
            // create the card based on selection
            var selectedCardName = results.response.entity;
            var card = createCard(selectedCardName, session);
    
            // attach the card to the reply message
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
        }
    ])



    
    var HeroCardName = 'Our Blog';
    var ThumbnailCardName = 'Portfolio';
    var ReceiptCardName = 'Receipt card';
    var SigninCardName = 'Sign-in card';
    var AnimationCardName = "Animation card";
    var VideoCardName = "Videos";
    var AudioCardName = "Podcasts";
    var CardNames = [HeroCardName, ThumbnailCardName, VideoCardName, AudioCardName];
    
    function createCard(selectedCardName, session) {
        switch (selectedCardName) {
            case HeroCardName:
                return createHeroCard(session);
            case ThumbnailCardName:
                return createThumbnailCard(session);
            case ReceiptCardName:
                return createReceiptCard(session);
            case SigninCardName:
                return createSigninCard(session);
            case AnimationCardName:
                return createAnimationCard(session);
            case VideoCardName:
                return createVideoCard(session);
            case AudioCardName:
                return createAudioCard(session);
            default:
                return createHeroCard(session);
        }
    }
    
    function createHeroCard(session) {
        return new builder.HeroCard(session)
            .title('Welcome to our Blog')
            .subtitle('5 benefits of a website for your business')
            .text('Having a website is crucial to your businesses success. It is the growth that many businesses need, it can bring that increase in sales and that exposure that you have being looking for. Your market goes from local to worldwide. Read on and discover exactly how a website can be beneficial for you.')
            .images([
                builder.CardImage.create(session, 'http://plusninedesign.com/wp-content/uploads/2018/02/Pexels-1024x683-768x512.jpeg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://plusninedesign.com/benefits-of-a-website-for-your-business/', 'Read More')
            ]); session.send(msg).endDialog()


            .triggerAction({
                confirmPrompt: "This will cancel your order. Are you sure?"

        });
    } 
    
    function createThumbnailCard(session) {
        return new builder.ThumbnailCard(session)
            .title('Our Portfolio')
            .subtitle('Some of our work')
            .text('Browse our portfolio and see some of our Graphic Design work, Websites we have build and Logos we have designed')
            .images([
                builder.CardImage.create(session, 'http://plusninedesign.com/wp-content/uploads/2018/02/Pexels-1024x683.jpeg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://plusninedesign.com/our-work/', 'View Full Portfolio')
            ]); session.send(msg).endDialog()

            .triggerAction({
                confirmPrompt: "This will cancel your order. Are you sure?"

        });
            
    } 

    function createVideoCard(session) {
        return new builder.VideoCard(session)
            .title('SEO for your business')
            .subtitle('More Detailed look at our SEO Services')
            .text('All major search engines such as Google, Bing and Yahoo have primary search results, where web pages and other content such as videos or local listings are shown and ranked based on what the search engine considers most relevant to users. Payment isn’t involved, as it is with paid search ads.')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
            .media([
                { url: 'https://www.youtube.com/watch?v=X_sLdwhmdJI' }
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.plusninedesign.com', 'Learn More')
            ]); session.send(msg).endDialog()


                .triggerAction({
                    confirmPrompt: "This will cancel your order. Are you sure?"

            });

    }
    
    function createAudioCard(session) {
        return new builder.AudioCard(session)
            .title('Listen now - The fascinating future of AI')
            .subtitle('Tim Ferris Podcast about Artificial intelligence')
            .text('Tim O’Reilly (@timoreilly) is one of the most fascinating polymaths I’ve ever encountered. Wired has called him “the trend spotter” in the world of tech and macrotrends.Tim is the founder and CEO of O’Reilly Media, Inc. His original business plan was pretty simple: “interesting work for interesting people,” and that’s worked out pretty well. His company has generated hundreds of millions of dollars in revenue doing everything from online learning, book publishing, running conferences, urging companies to create more value than they capture, and trying to change the world by spreading and amplifying the knowledge of innovators.')
            .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
            .media([
                { url: 'https://dfkfj8j276wwv.cloudfront.net/episodes/00ba562c-2ed1-4258-93c2-04d525c75349/c96f407ed1cce646a80891fd4f6a298d707a27161e412ca0e3ba956903050fd196363f86188fbe523e7bad32e60dba633382d6289453c207c9052c74284af2fc/The%20Tim%20Ferriss%20Show%20-%20Tim%20O%27Reilly.mp3' }
            ])
                .buttons([
                builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/Artificial_intelligence', 'Read More')
            ]); session.send(msg).endDialog()

            .triggerAction({
             confirmPrompt: "This will cancel your order. Are you sure?"

            });
              
    }
    