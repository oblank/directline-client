var test = require('ava');
var directLineAPI = require('../');
var conf = require('./conf.json');
var fs = require('fs');
var shortid = require('shortid');

test.cb('DirectLineAPI#getToken', t => {
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        })
});

test.cb('DirectLineAPI#createConversation', t => {
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            return directLineAPI.createConversation(token);
        })
        .then(function(result) {
            // { conversationId: 'LL9c5ahYCN0',
            // token: 'RYS3s-tS0PE.cwA.tKM.E7LJGgSZ9sQSW3sYKyC2xfkzIWNH-v6ehCNrEAH3UV8' }
            t.pass();
            t.end();
        })
        .fail(function(err) {
            console.log('createConversation>>', err);
            t.fail();
            t.end();
        })
});

test.cb('DirectLineAPI#postMessage', t => {
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            return directLineAPI.createConversation(token);
        })
        .then(function(result) {
            return directLineAPI.postMessage(result.token, result.conversationId, {
                text: 'message'
            });
        })
        .then(function(result) {
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        });
});


test.skip.cb('DirectLineAPI#getMessages', t => {
    directLineAPI.getMessages(conf.DIRECT_LINE_TOKEN, 'BOqaXkXeNTL', 0)
        .then(function(result) {
            // {
            // "activities": [
            //     {
            //     "type": "message",
            //     "id": "LL9c5ahYCN0|000000000000000009",
            //     "timestamp": "2016-12-06T10:15:00.1748607Z",
            //     "channelId": "directline",
            //     "from": {
            //         "id": "rich3cards",
            //         "name": "RichCards"
            //     },
            //     "conversation": {
            //         "id": "LL9c5ahYCN0"
            //     },
            //     "text": "The 'Current Weather' button on the card above can be pressed at any time regardless of where the user is in the conversation with the bot. The bot can even show the weather after the conversation has ended.",
            //     "replyToId": "LL9c5ahYCN0|000000000000000006"
            //     },
            //     {
            //     "type": "message",
            //     "id": "LL9c5ahYCN0|000000000000000010",
            //     "timestamp": "2016-12-06T10:14:59.8185224Z",
            //     "channelId": "directline",
            //     "from": {
            //         "id": "rich3cards",
            //         "name": "RichCards"
            //     },
            //     "conversation": {
            //         "id": "LL9c5ahYCN0"
            //     },
            //     "text": "What demo would you like to run?\n   1. prompts\n   2. picture\n   3. cards\n   4. list\n   5. carousel\n   6. receipt\n   7. actions\n   8. (quit)",
            //     "replyToId": "LL9c5ahYCN0|000000000000000006"
            //     }
            // ],
            // "watermark": "10"
            // }
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        })
});

test.cb('DirectLineAPI#generateConversationAndToken', t => {
    directLineAPI.generateConversationAndToken(conf.DIRECT_LINE_SECRET)
        .then(function(result) {
            // snoZV1MiBEA.dAA.MgBGAFAAcQB5AEIAZABaAGMANwBBAA.8pwJs_Df0QE.2LhLaujkxCY.xkcPpjgnK3iPmqiMmo7g6KSNsI4FiD-SXzFzrkUWXiw
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        })
});

test.skip.cb('DirectLineAPI#refreshToken', t => {
    directLineAPI.refreshToken(conf.DIRECT_LINE_TOKEN)
        .then(function(result) {
            // snoZV1MiBEA.dAA.MgBGAFAAcQB5AEIAZABaAGMANwBBAA.8pwJs_Df0QE.2LhLaujkxCY.xkcPpjgnK3iPmqiMmo7g6KSNsI4FiD-SXzFzrkUWXiw
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        })
});

test.cb('DirectLineAPI#postFileMessage', t => {
    // https://www.npmjs.com/package/request#multipartform-data-multipart-form-uploads
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            return directLineAPI.createConversation(token);
        })
        .then(function(result) {
            // console.log('postFileMessage>> ' + JSON.stringify(result));
            return directLineAPI.postFileMessage(result.token, result.conversationId, {
                my_file: fs.createReadStream(__dirname + '/open_source.png'),
            })
        })
        .then(function(result) {
            t.pass();
            t.end();
        })
        .fail(function(err) {
            t.fail();
            t.end();
        });
});

test.cb('DirectLineAPI#ask', t => {
    // check out form data format
    // https://www.npmjs.com/package/request#multipartform-data-multipart-form-uploads
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            return directLineAPI.createConversation(token);
        })
        .then(function(result) {
            console.log('ask>> ' + JSON.stringify(result));
            return directLineAPI.ask(result.token, result.conversationId, "sss");
        })
        .then(function(result) {
            console.log(result);
            t.pass();
            t.end();
        })
        .fail(function(err) {
            console.log(err);
            t.fail();
            t.end();
        });
});

test.only.cb('DirectLineAPI#dialog', t => {
    // check out form data format
    // https://www.npmjs.com/package/request#multipartform-data-multipart-form-uploads
    var data = {};
    var fromUser = {
        id: shortid.generate(),
        name: "Tester"
    };
    directLineAPI.getToken(conf.DIRECT_LINE_SECRET)
        .then(function(token) {
            console.log("got token " + token);
            return directLineAPI.createConversation(token);
        })
        .then(function(result) {
            console.log('created conversation ' + JSON.stringify(result));
            data.token = result.token;
            data.conversationId = result.conversationId;
            return directLineAPI.ask(result.token, result.conversationId, { text: 'bar', from: fromUser });
        })
        .then(function(result) {
            console.log('dialog-1', JSON.stringify(result));
            console.log('dialog-1:data', JSON.stringify(data))
            return directLineAPI.ask(data.token, data.conversationId, { text: 'foo', from: fromUser });
        })
        .then(function(result) {
            console.log('dialog-2', JSON.stringify(result));
            t.pass();
            t.end();
        })
        .fail(function(err) {
            console.log(err);
            t.fail();
            t.end();
        });
});