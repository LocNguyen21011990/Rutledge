'use strict';



var app = angular.module('CloudApp', ['datatables', 'ui.router', 'jcs-autoValidate', 'ngAnimate', 'ui.bootstrap', 'ui-notification', 'ngFileUpload', 'pascalprecht.translate', 'angular-md5']);

app.factory('ConfigService', [function() {
    return {


        host: 'http://172.16.0.109:9002',
        host_socketio: 'http://172.16.0.72:9003'


    };
}]);



app.config(['$translateProvider', function($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: '/app/i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
}]);


app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q,$state,$window) {
        if($window.localStorage.token != undefined){
            $httpProvider.defaults.headers.common['x-access-token'] = $window.localStorage.token;
        }
        return {
            'response': function (response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function (rejection) {
                console.log(rejection);
                if(rejection.status === 403) {
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    });
}]);
