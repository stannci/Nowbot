var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 
var cognitiveservices = require('botbuilder-cognitiveservices');
var https = require('https');




// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {

   console.log('%s listening to %s', server.name, server.url); 
});

    var connector = new builder.ChatConnector({
    appId: 'c8928f39-dac0-46e7-831e-0f7b845616ab',
    appPassword: 'mmvahZL022%*isKXAIU84|(' 
});

var bot = new builder.UniversalBot(connector) ;
server.post('/api/messages', connector.listen());


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


//this is the welcoming message that the user will be greeted with when they enter a conversation session with the bot
bot.on('conversationUpdate', function (message) {
       if (message.membersAdded) {
                message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                var reply = new builder.Message()
                    .address(message.address)
                    .text('Hi, Welcome! Im NowBot, I will be your assistant today!\n\n Here is what I can help you with\n\nWebsite Services\nLogo Packages\nDomain checker\nSEO Packages\n\ book Consultation\n\n If you get lost at anytime just say help ')
                    bot.send(reply);
                    }
                });
            }
        });




//language understanding for general words/phrases that a user may enter such as hi hello morning etc also when bot does not understand a message from user they will be directed back to here
intents.matches('Repsonse', (session, args, next ) => {


    //this is the prompt for Facebook/messanger users
    session.send("Hello! Welcome I'm NowBot I will be your assistant! Heres what I can help you with. Type your selection to begin\n\nWebsite Services\nLogo Packages\nSEO Packages\nDomain checker\nConsultation\n\nIf you are stuck at anytime just type help or home.")
    var msg = new builder.Message(session)
    .addAttachment({
        contentUrl: 'http://plusninedesign.com/wp-content/uploads/2018/05/Websites-1.jpg',
        contentType: 'image/jpg',
        name: 'plusninedesign.jpg',
            
    });

session.send(msg);
;  
    

});




intents.matches('GoHome', (session, args, next ) => {
  session.send("Hey! I noticed your stuck! not to worry , just type any of these options to get out of here.\n\nWebsites\n\n SEO\n\n Logo\n\n Book Consultation\n")

});

intents.matches('Domain', (session, args, next ) => {
    session.send("To check your domain availability, just type Domain Checker")
       
 
  });




//language understanding for words/phrases related to a user looking for a website.
    intents.matches('browseWebsites', (session, args, next ) => {

        session.send("Thank you for an interest in our website packages ! Have a look at some of our packages below")

        var msg = new builder.Message(session);

        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([


            new builder.HeroCard(session)
                .title("One page Website")
                .subtitle("Start your webiste Journey")
                .text("Price is €349 once off")
                .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1504608245011-62d9758c1bb9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4f55a58cec78baa23d950fd25871e463&auto=format&fit=crop&w=1350&q=80')])
                .buttons([
                    builder.CardAction.imBack(session, "buy one page Website", "Buy Wesbite")
                ]),


            new builder.HeroCard(session)
                .title("Wordpress Website")
                .subtitle("Content managament Website")
                .text("Price is €549 once off")
                .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1519211975560-4ca611f5a72a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ae34625b8db390fb2b784800d76d225&auto=format&fit=crop&w=1350&q=80')])
                .buttons([
                    builder.CardAction.imBack(session, "buy Wordpress Website", "Buy Website")
                ]),


                new builder.HeroCard(session)
                .title("E-commerce Website")
                .subtitle("Sell your products online")
                .text("Price is €899 once off")
                .images([builder.CardImage.create(session, 'https://images.unsplash.com/19/desktop.JPG?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60f9c32ab84b0de2266d6afca2fabf4c&auto=format&fit=crop&w=1350&q=80')])
                .buttons([
                    builder.CardAction.imBack(session, "buy E-commerce Website", "Buy Website")
                ]),


                new builder.HeroCard(session)
                .title("Custom Website")
                .subtitle("Totally customized website to suit your needs")
                .text("Price is €1250")
                .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9943985ab543c6dc5300988f49545e73&auto=format&fit=crop&w=1349&q=80')])
                .buttons([
                    builder.CardAction.imBack(session, "buy Custom Website", "Buy Website")
                ])
        ]);
        session.send(msg).endDialog();
    
    
    
    })

        
// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonWebsites', [

    function (session, args, next) {

        var utterance = args.intent.matched[0];

        var color = /(one page|Wordpress|E-commerce|Custom)/i.exec(utterance);
        var size = /\b(Business|Blogger|Entrepreneur|Start up)\b/i.exec(utterance);
        if (color) {
            var item = session.dialogData.item = { 
                product: "Website"  + color[0].toLowerCase() +  " Package",
                size: size ? size[0].toLowerCase() : null,
                
                qty: 1
            };
            if (!item.size) {
                builder.Prompts.choice(session, "Please choose what matches you most?", "Business|Blogger|Entrepreneur|Start up");
            } else {
                next();
            }
        } else {
            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {

        var item = session.dialogData.item;

        if (results.response) {

            item.size = results.response.entity.toLowerCase();
        }
        if (!session.userData.cart) {

            session.userData.cart = [];


        }

        session.userData.cart.push(item);

      
        session.send("Your almost there!A '%(product)s is a great choice!' Please fill out the questions below in relation to your website", item) ,
      
    session.send("Thank you for your interest in purchasing a website from us! Please answer these questions and we will be in touch");

                       builder.Prompts.time(session, "What date do you need your want your website for?");
                   },
                   function (session, results) {

                       session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);

                       builder.Prompts.text(session, "What is your email address");

                       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                      
                       email = session.message.text;
                       if (re.test(email)) {

                           session.userData.email = email;

                           session.send("Thank you, " + session.userData.email + "email is ok");

                       } else {

                           session.send("Please type a valid email address. For example: hi@live.com");
                       }
                   
                   },
                   function (session, results) {
                       session.dialogData.Size = results.response;
                       builder.Prompts.text(session, "what is your full name??");
                   },
                   function (session, results) {
                       session.dialogData.conName = results.response;
               
     
                       session.send(`Website confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Email: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                       session.endDialog();
                   }
    
     


]).triggerAction({ matches: /(buy|add)\s.*Website/i });





//LUIS language understanding
intents.matches('Learn', (session, args, next ) => {
    session.send("Hey, If you want to go to home just type Home")
    
    });



intents.matches('BookConsultation', (session, args, next ) => {
    session.send("I can help you here! To get a free quote just type book consultation");


});



/*
   

intents.matches('OnlineUsers', (session, args, next ) => {

    var savedAddress = session.message.address;

    session.send("Perfect, Please Fill out the form below to book your free sonsultation!");

    if (session.message && session.message.value) {
        

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
                                vvv
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
   


*/

intents.matches('BrowseLogos', (session, args, next ) => {
    session.send("Thanks for an interest in our logos!")
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




bot.dialog('buyButtonSEO', [
    function (session, args, next) {
     
        var utterance = args.intent.matched[0];

        var color = /(bronze|silver|gold|platinum)/i.exec(utterance);

        var size = /\b(1 month|3 months|6 months|12 months)\b/i.exec(utterance);
        if (color) {
            
            var item = session.dialogData.item = { 
                product: "SEO"  + color[0].toLowerCase() +  " Package",
                size: size ? size[0].toLowerCase() : null,
                
                qty: 1
            };
            if (!item.size) {
                
                builder.Prompts.choice(session, "Select the time of contract?", "1 month|3 months|6 months|12 months");
            } else {
              
                next();
            }
        } else {
            
            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {
    
        
        var item = session.dialogData.item;
        if (results.response) {

            item.size = results.response.entity.toLowerCase();
        }

        if (!session.userData.cart) {
            session.userData.cart = [];
        }
        session.userData.cart.push(item);

    
        session.send("Your almost there!A '%(size)s %(product)s is a great choice!' Please fill out the questions below in relation to your SEO", item) ,
      
    session.send("Thank you for your interest in purchasing SEO from us , please answer these questions and we will be in touch");

                       builder.Prompts.time(session, "When do you want to start work?");
                   },
                   function (session, results) {
                       session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);
                       builder.Prompts.text(session, "What is your email address");
                       var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                       email = session.message.text;
                       if (re.test(email)) {
                           session.userData.email = email;
                           
                       } else {
                           session.send("Please type a valid email address. For example: hi@live.com");
                       }
                   
                   },
                   function (session, results) {
                       session.dialogData.Size = results.response;

                       builder.Prompts.text(session, "what is your full name??");
                   },
                   function (session, results) {
                       session.dialogData.conName = results.response;
               
                 
                       session.send(`SEO Package confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName} `);
                       
                               }
    
     


]).triggerAction({ matches: /(buy|add)\s.*SEO/i });


var menuItems2 = { 
    
    "Discover now": {
        item: "Discover"
    },
    "Home": {
        item: "mainMenu"
    },

    
}


bot.dialog("DiscoverMenu", [
  function(session){
      builder.Prompts.choice(session, "Welcome to our Discovery Section: To exit just type discover again at any time\n\n ", menuItems2);
      
  },
  function(session, results){
      if(results.response){
          session.beginDialog(menuItems2[results.response.entity].item);
      }
  }
])
.triggerAction({

  matches: /^discover$/i,
  confirmPrompt: "This will cancel your request. Are you sure?"
});


//This is the Main menu
var menuItems = { 
     
    "website": {
        item: "buywebsitehome"
   

      },
    
      "Logos": {
     item: "logo"

          
      }, 
      "SEO": {
        item: "buyButtonSEO"
        
        
    }, 
    "Domain checker": {
        item: "domainMenu"
        
        
    }, 

   "Blog": {
    item: "blog"
    
  
     }, 
     "Consultation": {
        item: "ConsultationBook"
        
        
           }, 
            
    
  }
 


  bot.dialog("mainMenu", [
    function(session){
        builder.Prompts.choice(session, "This is our Main Menu: type what you are looking for! ", menuItems);
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    }
])
.triggerAction({
    

    matches: /^main menu$|^Main Menu$|^Home$|home$/i,
    confirmPrompt: "This will cancel your request. Are you sure?"
});






bot.dialog('blog', [
    
function (session) {
    builder.Prompts.choice(session, 'Welcome to the blog', CardNames3, {
        maxRetries: 3,
        retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
    });
},
function (session, results) {


    var selectedCardName = results.response.entity;
    var card = createCard(selectedCardName, session);

  
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
}
])
.triggerAction({

matches: /^blog$/i,

confirmPrompt: "This will cancel your request. Are you sure?"
});




var HeroCardName3 = 'Our Blog';
var ThumbnailCardName = 'Portfolio';

var CardNames3 = [ThumbnailCardName,HeroCardName3];

             function createCard(selectedCardName, session) {
                switch (selectedCardName) {
               case HeroCardName3:
            return createHeroCard(session);
           case ThumbnailCardName:
            return createThumbnailCard(session);
        
    }
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

function createHeroCard(session) {

    return new builder.HeroCard(session)

        .title('Blog Post number 1')
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


bot.dialog('buywebsitehome', function (session) {

    session.send("Thank you for an interest in our website packages ! Have a look at some of our packages below")

    var msg = new builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.carousel)

    msg.attachments([



        new builder.HeroCard(session)
            .title("One page Website")
            .subtitle("Start your webiste Journey")
            .text("Price is €349 once off")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1504608245011-62d9758c1bb9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4f55a58cec78baa23d950fd25871e463&auto=format&fit=crop&w=1350&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy one page Website", "Buy Wesbite")
            ]),



        new builder.HeroCard(session)
            .title("Wordpress Website")
            .subtitle("Content managament Website")
            .text("Price is €549 once off")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1519211975560-4ca611f5a72a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ae34625b8db390fb2b784800d76d225&auto=format&fit=crop&w=1350&q=80')])
            .buttons([

                builder.CardAction.imBack(session, "buy Wordpress Website", "Buy Website")
            ]),


            new builder.HeroCard(session)
            .title("E-commerce Website")
            .subtitle("Sell your products online")
            .text("Price is €899 once off")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/19/desktop.JPG?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60f9c32ab84b0de2266d6afca2fabf4c&auto=format&fit=crop&w=1350&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy E-commerce Website", "Buy Website")
            ]),

            new builder.HeroCard(session)
            .title("Custom Website")
            .subtitle("Totally customized website to suit your needs")
            .text("Price is €1250")
            .images([builder.CardImage.create(session, 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9943985ab543c6dc5300988f49545e73&auto=format&fit=crop&w=1349&q=80')])
            .buttons([
                builder.CardAction.imBack(session, "buy Custom Website", "Buy Website")
            ])

    ]);



    session.send(msg).endDialog();



})

    
// Add dialog to handle 'Buy' button click
bot.dialog('buywebsitehomebtn', [
function (session, args, next) {

    var utterance = args.intent.matched[0];

    var color = /(one page|Wordpress|E-commerce|Custom)/i.exec(utterance);

    var cat = /\b(Business|Blogger|Entrepreneur|Start up)\b/i.exec(utterance);

    if (color) {
  
        var item = session.dialogData.item = { 

            product: "Website"  + color[0].toLowerCase() +  " Package",

            cat: cat ? cat[0].toLowerCase() : null,
            
            qty: 1
        };
        if (!item.size) {
           
            
            builder.Prompts.choice(session, "Please choose what matches you most?", "Business|Blogger|Entrepreneur|Start up");


        } else {
            
            next();
        }
    } else {

        
        session.send("I'm sorry... That product wasn't found.").endDialog();


    }   
},
function (session, results) {
    
    var item = session.dialogData.item;

    if (results.response) {


        item.size = results.response.entity.toLowerCase();
    }

 
    if (!session.userData.cart) {

        session.userData.cart = [];
    }
    session.userData.cart.push(item);

    // Send confirmation to users
    session.send("Your almost there!A '%(size)s %(product)s is a great choice!' Please fill out the questions below in relation to your Website", item) ,
  
session.send("Thank you for your interest in purchasing a website from us! Please answer these questions and we will be in touch");


                   builder.Prompts.time(session, "What date do you need your want your website for?");
               },
               function (session, results) {

                   session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);

                   builder.Prompts.text(session, "What is your email address");
                   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                   email = session.message.text;
                   if (re.test(email)) {
                       session.userData.email = email;


                       session.send("Thank you, " + session.userData.email + "email is ok");


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
           
           
                   session.send(`Website confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                  
                   session.endDialog();
               }

 


]).triggerAction({ matches: /(buy|add)\s.*Website/i });




// Main menu
var menuItems3= { 
    
    "Discover now": {
        item: "Discover"
    },
    "Domain Checker": {
        item: "DomainChecker"
    },

    
}



// Display the main menu and start a new request depending on user input.
bot.dialog("domainMenu", [
  function(session){
      builder.Prompts.choice(session, "Domain checker menu", menuItems3);
      
  },
  function(session, results){
      if(results.response){
          session.beginDialog(menuItems3[results.response.entity].item);
      }
  }
]).triggerAction({
    // The user can request this at any time.
    // Once triggered, it clears the stack and prompts the main menu again.
    matches: /^Domain Checker$/i,
    confirmPrompt: "This will cancel your request. Are you sure?"
  });




bot.dialog('DomainChecker', [
    
function (session) {
    builder.Prompts.choice(session, 'Lets see if your domain is available', CardNames5, {
        retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
    });
},
function (session, results) {

 
    var selectedCardName = results.response.entity;
    var card = createCard(selectedCardName, session);

  
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
}
])
var HeroCardNameD = 'Domain checker';
var CardNames5 = [HeroCardNameD,];

           function createCard(selectedCardName, session) {
              switch (selectedCardName) {
                case HeroCardNameD:
                return createHeroCard(session);
                default:
                return createHeroCard(session);
    }
}

     function createHeroCard(session) {
        return new builder.HeroCard(session)
          .title('Welcome to our Domain Checker')
        .subtitle('Lets see if your domain is available!')
        .text('Having a good domain is crucial to the success of your website! if your domain is not already taken, make sure your secure yours now!')
        .images([
            builder.CardImage.create(session, 'http://ubloger.com/wp-content/uploads/2017/01/jasa-backlink-pbn-1.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'http://plusninedesign.com/domain-checker/', 'Lets Go')
        ]); session.send(msg).endDialog()
    
    
        .triggerAction({
            confirmPrompt: "This will cancel your order. Are you sure?" 
    
    });
 
    } 




  // Display the main menu and start a new request depending on user input.
  bot.dialog("websiteMenu", [
      function(session){
          builder.Prompts.choice(session, "This is website menu:  ", websiteMenu);
      },
      function(session, results){
          if(results.response){
              session.beginDialog(websiteMenu[results.response.entity].item);
          }
      }
  ])
  .triggerAction({
 
      matches: /^website menu $/i,
      confirmPrompt: "This will cancel your request. Are you sure?"
  });



bot.on('error', function (e) {
console.log('And error ocurred', e);
});


 
  

//website functionality
bot.dialog('orderWebsite', [
      function(session){
          session.send("Lets build you a website!");
          session.beginDialog("addItem");
      },
      function (session, results) {
          if (results.response) {

              for(var i = 1; i < session.conversationData.orders.length; i++){
                  session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
              }
              session.send(`Your total is: $${session.conversationData.orders[0].Price}`);
  
            
              builder.Prompts.text(session, "What is your email address");
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              email = session.message.text;
              if (re.test(email)) {
                  session.userData.email = email;
                  session.send("Thank you, " + session.userData.name + "");
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
                  Price: 0
              }
              
            
        }; 


bot.dialog("addItem", [
      function(session, args){
          if(args && args.reprompt){
              session.send("is there anymore services you require?");
          }
          else{

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
                  session.conversationData.orders[0].Price += order.Price; 
                  var msg = `You ordered: ${order.Description} for a total of €${order.Price}.`;
                  session.send(msg);
                  session.conversationData.orders.push(order);
                  session.replaceDialog("addItem", { reprompt: true }); 
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






bot.dialog('buyButtonClick', [
    function (session, args, next) {

        var utterance = args.intent.matched[0];
        var color = /(silver|gold)/i.exec(utterance);
        var cat = /\b( Entrepreneur|Start Up|Blogger|Business)\b/i.exec(utterance);
        if (color) {
            
            var item = session.dialogData.item = { 
                product: "Logo"  + color[0].toLowerCase() +  " Package",
                size: size ? size[0].toLowerCase() : null,
            
                qty: 1
            };
            if (!item.size) {
           
                builder.Prompts.choice(session, "What matches you most?", "Business|Blogger|Start Up|Entrepreneur");
            } else {
                next();
            }
        } else {

            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {
        var item = session.dialogData.item;
        if (results.response) {
            item.size = results.response.entity.toLowerCase();
        }
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
                       var re = /^(([^@]+(\.[^@"]+)*)||(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
               
                       
                       session.send(`Logo confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Interest: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                       session.endDialog();
                   }
    
     


]).triggerAction({ matches: /(buy|add)\s.*logo/i });



var menuItems7 = { 
    
    "Book Consultation": {
        item: "ConsultationBooking2"
    },
    "Home": {
        item: "mainMenu"
    },

    
}

// Display the main menu and start a new request depending on user input.
bot.dialog("ConsultationBooking1", [
    function(session){
        builder.Prompts.choice(session, "Welcome to our Consultation booking Section: To exit just type book sonsultation again at any time\n\n ", menuItems7);
        
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems7[results.response.entity].item);
        }
    }
  ])
  .triggerAction({
    // The user can request this at any time.
    // Once triggered, it clears the stack and prompts the main menu again.
    matches: /^book consultation$/i,
    confirmPrompt: "This will cancel your request. Are you sure?"
  });



//Free Consultation


bot.dialog('ConsultationBooking2', [
    function(session){
   
        session.send("Thank you for your interest in gettin a consultation booked, please leave your details below and we will be in touch!");
        
                               builder.Prompts.time(session, "What date do you want to book in for ?");
                           },
                           function (session, results) {
        
                               session.dialogData.conDate = builder.EntityRecognizer.resolveTime([results.response]);
        
                               builder.Prompts.text(session, "What is your email address");
        
                               var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                              
                               email = session.message.text;
                               if (re.test(email)) {
        
                                   session.userData.email = email;
        
                                   session.send("Thank you, " + session.userData.email + "email is ok");
        
                               } else {
        
                                   session.send("Please type a valid email address. For example: hi@live.com");
                               }
                           
                           },
                           function (session, results) {
                               session.dialogData.Size = results.response;
                               builder.Prompts.text(session, "what is your full name??");
                           },
                           function (session, results) {
                               session.dialogData.conName = results.response;
                       
             
                               session.send(`Booking confirmed. We will contact you via email to discuss further! The details: <br/>Date/Time: ${session.dialogData.conDate} <br/> Email: ${session.dialogData.Size} <br/>name: ${session.dialogData.conName}`);
                               session.endDialog();
                           }

          
      ])
      
      .cancelAction(
        "cancelOrder", "Type 'Main Menu' to continue.", 
        {
            matches: /^book consultation$/i,
            confirmPrompt: "This will cancel your order. Are you sure?"
        }) ;



        bot.dialog('Discover', [
            
        function (session) {
            builder.Prompts.choice(session, 'What would you like to Discover?? type discover anytime to exit.', CardNames, {
                maxRetries: 3,
                retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
            });
        },
        function (session, results) {
              var selectedCardName = results.response.entity;
            var card = createCard(selectedCardName, session);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
        }
    ])



    
    var HeroCardName = "Domain Checker";
    var ThumbnailCardName = 'Portfolio';
    var ReceiptCardName = 'Receipt card';
    var AnimationCardName = "Animation card";
    var VideoCardName = "Videos";
    var AudioCardName = "Podcasts";
    var CardNames = [HeroCardName,ThumbnailCardName, VideoCardName, AudioCardName];
    
                 function createCard(selectedCardName, session) {
                    switch (selectedCardName) {
                        case HeroCardNameD:
                        return createHeroCard(session);
                    case ThumbnailCardName:
                         return createThumbnailCard(session);
                         case ReceiptCardName:
                       return createReceiptCard(session);
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
              .title('Welcome to our Domain Checker')
            .subtitle('Lets see if your domain is available!')
            .text('Having a good domain is crucial to the success of your website! if your domain is not already taken, make sure your secure yours now!')
            .images([
                builder.CardImage.create(session, 'http://ubloger.com/wp-content/uploads/2017/01/jasa-backlink-pbn-1.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'http://plusninedesign.com/domain-checker/', 'Lets Go')
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
            .image(builder.CardImage.create(session, 'https://www.reviewgeek.com/p/uploads/2018/01/x79baf4d0.jpg.pagespeed.gp+jp+jw+pj+ws+js+rj+rp+rw+ri+cp+md.ic.2nP2-cDo2x.jpg'))
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

    /*


References - https://docs.botframework.com/en-us/node/builder/chat-reference/modules/_botbuilder_d_.html


    */
   



    