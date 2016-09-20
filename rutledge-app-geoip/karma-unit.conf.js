// Karma configuration
// Generated on Wed May 25 2016 10:09:18 GMT+0700 (ICT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'assets/js/libs/jquery.min.js',
            'assets/js/libs/jquery-ui.min.js',
            'assets/js/angular/angular.js',
            'assets/js/angular/angular-mocks.js',
            'assets/js/angular/angular-translate.js',
            'assets/js/angular/angular-translate-loader-static-files.js',
            'assets/js/angular/angular-ui-notification.min.js',
            'assets/js/angular/angular-animate.js',
            'assets/js/angular/angular-ui-router.min.js',
            'assets/js/bootstrap/bootstrap.min.js',
            // 'assets/js/libs/Chart.min.js',
            'assets/js/plugin/select2/select2.min.js',
            'assets/js/libs/jquery.dataTables.min.js',
            'assets/js/bootstrap/bootstrap-multiselect.js',
            // 'assets/js/app.min.js',
            'app/app.module.js',
            'app/app.service.js',
            'app/app.routes.js',
            'assets/js/angular/jcs-auto-validate.js',
            'assets/js/angular/angular-datatables.min.js',
            // 'assets/js/angular/angular-chart.min.js',
            // 'assets/js/angular/angular-chart.js',
            // 'assets/js/angular/chartjs-directive.js',
            'assets/js/angular/angularjs-dropdown-multiselect.min.js',
            'assets/js/angular/angular-md5.js',
            'assets/js/bootstrap/bootstrap-timepicker.js',
            'assets/js/angular/ui-bootstrap-tpls-1.3.2.min.js',
            'assets/js/ngupload/ng-file-upload.min.js',
            'assets/js/ngupload/ng-file-upload-shim.js',
            'assets/js/libs/socket.io-1.2.0.js',
            'assets/js/libs/notification.js',

            'app/components/geoip/geoipCtrl.js',
            'app/components/location/city/cityCtrl.js',
            'app/components/location/zone/zoneCtrl.js',
            'app/components/location/drill/drillCtrl.js',
            'app/components/location/room/roomCtrl.js',
            'app/components/rule/stayhourCtrl.js',
            'app/components/rule/timeAccessCtrl.js',
            'app/components/location/city/editCityCtrl.js',
            'app/components/location/drill/editDrillCtrl.js',
            'app/components/location/zone/editZoneCtrl.js',
            'app/components/location/room/editRoomCtrl.js',
            'app/components/rule/rulemasterCtrl.js',
            'app/components/rule/detailruleCtrl.js',
            'app/components/rule/editruleCtrl.js',
            'app/components/zonedefinition/zonedefinitionCtrl.js',
            'app/components/zonemonitoring/zonemonitoringCtrl.js',
            'app/components/notification/notificationCtrl.js',
            'app/components/history/historyCtrl.js',
            'app/components/dashboard/dashboardCtrl.js',
            'app/components/dashboard/dashboard-detailCtrl.js',
            'app/components/dashboard/dashboard-detail-drillCtrl.js',
            'app/components/login/loginCtrl.js',
            'app/components/login/forgotpasswordCtrl.js',
            'app/components/login/changepasswordCtrl.js',

            'app/shared/common/leftMenuController.js',
            'app/components/users/userCtrl.js',
            'app/components/usergroup/groupCtrl.js',
            'app/components/sitetree/siteTreeCtrl.js',
            'app/components/sitetree/editSiteTreeCtrl.js',






            'test/unit/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
