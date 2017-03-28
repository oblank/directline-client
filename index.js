/**
 * Direct Line API v3
 * https://docs.botframework.com/en-us/restapi/directline3/
 */
const baseUrl = "https://directline.botframework.com/v3/directline";
var request = require('request');
var Q = require('q');
var leftpad = require('leftpad');
var debug = require('debug')('directline-client');

function DirectLineClient() {}

/**
 * Get token
 * @param  {[type]} secret [description]
 * @return {[type]}        [description]
 */
DirectLineClient.prototype.getToken = function(secret) {
    var defer = Q.defer();
    request({
        method: 'POST',
        uri: baseUrl + '/tokens/generate',
        headers: {
            'Authorization': 'Bearer ' + secret
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200) {
            return defer.resolve(JSON.parse(body).token);
        } else {
            return defer.reject({
                rc: 2,
                error: 'Wrong status code returned by directline api in getToken'
            });
        }
    });

    return defer.promise;
};

/**
 * Create a conversation
 * @param  {[type]} tokenOrSecret [description]
 * @return {[type]}       [description]
 */
DirectLineClient.prototype.createConversation = function(tokenOrSecret) {
    var defer = Q.defer();
    request({
        method: 'POST',
        uri: baseUrl + '/conversations',
        headers: {
            'Authorization': 'Bearer ' + tokenOrSecret,
            'Accept': 'application/json'
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200 || response.statusCode === 201) {
            console.log("createConversation response" + JSON.stringify(body));
            return defer.resolve(JSON.parse(body));
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline api in createConversation'
            });
        }
    });

    return defer.promise;
};

/**
 * Post a message for a conversation
 * @param  {[type]} tokenOrSecret          [description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} message        [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.postMessage = function(tokenOrSecret, conversationId, body) {
    var defer = Q.defer();
    request({
        method: 'POST',
        uri: baseUrl + '/conversations/' + conversationId + '/activities',
        headers: {
            'Authorization': 'Bearer ' + tokenOrSecret,
            'Content-Type': 'application/json'
        },
        json: true,
        body: body
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 204 || response.statusCode === 200) {
            return defer.resolve(body);
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline api in postMessage'
            });
        }
    });

    return defer.promise;
};

/**
 * upload file
 * @param  {[type]} tokenOrSecret          [description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} file           [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.postFileMessage = function(tokenOrSecret, conversationId, formData) {
    var defer = Q.defer();
    request({
        method: 'POST',
        uri: baseUrl + '/conversations/' + conversationId + '/upload',
        headers: {
            'Authorization': 'Bearer ' + tokenOrSecret,
            'Content-Type': 'multipart/form-data'
        },
        formData: formData
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 204 || response.statusCode === 200) {
            return defer.resolve();
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline api in postFileMessage'
            });
        }
    });

    return defer.promise;
};


/**
 * Get Messages for a conversation
 * @param  {[type]} tokenOrSecret          [description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} watermark      [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.getMessages = function(tokenOrSecret, conversationId, watermark) {
    var defer = Q.defer();
    var watermarkStr = watermark ? 'watermark=' + watermark : '';
    request({
        method: 'GET',
        uri: baseUrl + '/conversations/' + conversationId + '/activities/?' + watermarkStr,
        headers: {
            'Authorization': 'Bearer ' + tokenOrSecret,
            'Accept': 'application/json'
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200) {
            return defer.resolve(JSON.parse(body));
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code.'
            });
        }
    });

    return defer.promise;
};

/**
 * generate a token for a new conversation.
 * @param  {[type]} token          [description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} message        [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.generateConversationAndToken = function(secret) {
    var defer = Q.defer();
    request({
        method: 'POST',
        uri: baseUrl + '/tokens/generate',
        headers: {
            'Authorization': 'Bearer ' + secret
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200) {
            return defer.resolve(body);
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline in generateConversationAndToken.'
            });
        }
    });

    return defer.promise;
};

/**
 * Refresh a token
 * @param  {[type]} secret         [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.refreshToken = function(token) {
    var defer = Q.defer();

    request({
        method: 'POST',
        uri: baseUrl + '/tokens/refresh',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200) {
            // slice is to remove "" in the body for token
            return defer.resolve(body.slice(1, -1));
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline api in refreshToken'
            });
        }
    });

    return defer.promise;
};

/**
 * [resolveNextConversationMessageId description]
 * @param  {[type]} watermark [description]
 * @return {[type]}           [description]
 */
function resolveNextConversationMessageId(conversationId, watermark) {
    return conversationId + '|' + leftpad(watermark + 2, 18);
}

/**
 * [ask description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} token          [description]
 * @param  {[type]} content        [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.ask = function(token, conversationId, body) {
    var defer = Q.defer();
    var self = this;
    var data = {};
    self.getMessages(token, conversationId)
        .then(function(result) {
            data.watermark = parseInt(result.watermark) | 0;
            data.nextId = resolveNextConversationMessageId(conversationId, data.watermark);
            return self.postMessage(token, conversationId, body);
        })
        .then(function(result) {
            console.log('// ask post result:', result)

            function waitForResponse(callback) {
                setTimeout(function() {
                    self.getMessages(token, conversationId, data.watermark)
                        .then(function(result) {
                            console.log('// ask getMessage:', result);
                            var isDone = false;
                            result.activities.forEach(function(val, index) {
                                if (val.id === data.nextId) {
                                    isDone = true;
                                    return callback(null, val);
                                }
                            });

                            if (!isDone)
                                waitForResponse(callback);
                        }, function(err) {
                            return callback(err);
                        });
                }, 500);
            }

            waitForResponse(function(err, response) {
                if (err) return defer.reject(err);
                debug('get response %j', JSON.stringify(response));
                return defer.resolve(response);
            });

        })
        .fail(function(err) {
            defer.reject(err);
        });

    return defer.promise;
}


/**
 * [getReconnectStreamURL description]
 * @param  {[type]} conversationId [description]
 * @param  {[type]} tokenOrSecret  [description]
 * @param  {[type]} watermark      [description]
 * @return {[type]}                [description]
 */
DirectLineClient.prototype.getReconnectStreamURL = function(tokenOrSecret, conversationId, watermark) {
    var defer = Q.defer();

    var watermarkStr = watermark ? 'watermark=' + watermark : '';
    request({
        method: 'GET',
        uri: baseUrl + '/conversations/' + conversationId + '/?' + watermarkStr,
        headers: {
            'Authorization': 'Bearer ' + tokenOrSecret
        }
    }, function(err, response, body) {
        if (err) return defer.reject({
            rc: 1,
            error: err
        });
        if (response.statusCode === 200) {
            // slice is to remove "" in the body for token
            return defer.resolve(body.slice(1, -1));
        } else {
            return defer.reject({
                rc: 2,
                error: 'wrong status code returned by directline api in refreshToken'
            });
        }
    });

    return defer.promise;
}

exports = module.exports = new DirectLineClient();
