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