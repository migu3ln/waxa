"use strict";

angular.module('app.inbox').factory('InboxConfig', function($http, APP_CONFIG){
    console.log(APP_CONFIG);
    return $http.get(APP_CONFIG.apiRootUrl +api_url+  '/inbox.json');
})