# directline-client
Client for MS Botframework Direct Line REST API (supports v3.0)

The Direct Line API is a simple REST API for connecting directly to a single bot. This API is intended for developers writing their own client applications, web chat controls, or mobile apps that will talk to their bot.

https://docs.botframework.com/en-us/restapi/directline3/

Within the Direct Line API, you will find:
An authentication mechanism using standard secret/token patterns
The ability to send messages from your client to your bot via an HTTP POST message
The ability to receive messages by WebSocket stream, if you choose
The ability to receive messages by polling HTTP GET, if you choose
A stable schema, even if your bot changes its protocol version
Direct Line 1.1 and 3.0 are both available and supported.

## API

> Check out test/test.js for samples.

```
var client = require('directline-api');
// get a token
client.getToken(secret);

// create a conversation
client.createConversation(tokenOrSecret);

// post a message in a conversation
client.postMessage(token, conversationId, {
                text: 'YOUR_TEXT'
            });

// post a message with an userId, userId is your unique id for message sender.
client.ask(token, conversationId, {
                        text: 'YOUR_TEXT',
                        from: {
                            "id":'FROM_USERID',
                            "name": "FROM_USERNAME"
                            }
                    });

// post a file in a conversation
client.postFileMessage(tokenOrSecret, conversationId, formData);

// get messages in a conversation
client.getMessages(tokenOrSecret, conversationId, [watermark]);

// generate a new conversation and token
client.generateConversationAndToken(secret);

// refresh a token
client.refreshToken(token);

// request with a text and get response
// https://docs.botframework.com/en-us/restapi/directline3/#!/Conversations/Conversations_PostMessage
client.ask(token, conversationId, body);

// get a new StreamURL for reconnecting specific to conversationId
client.getReconnectStreamURL(tokenOrSecret, conversationId, watermark);

```

## Run Test
```
npm install
touch test/conf.json 
# ADD secret as 'DIRECT_LINE_SECRET'
# ADD token as 'DIRECT_LINE_TOKEN'
npm test
```