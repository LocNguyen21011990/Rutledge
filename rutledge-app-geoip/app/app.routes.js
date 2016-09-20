'use strict';

app.config(function($stateProvider, $urlRouterProvider, $transitionsProvider) {

    $transitionsProvider.onStart({
        to: function(state) {
            return state.requireAuthen === undefined ? true : false;
        }
    }, function($transition$, $state, userService) {
        if (userService.isLogin()) {
            var pageState = $transition$.to().name;
            var listPageAccess = userService.listAccessPage();
            if (listPageAccess.indexOf(pageState) == -1) {
                return $state.go('home');
            }
        } else {
            return $state.go('login');
        }

    });

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'login': {
                    templateUrl: '/app/components/login/login.html',
                    controller: 'loginCtrl'
                }
            },
            requireAuthen: false
        })
        .state('forgotpassword', {
            url: '/forgotpassword',
            views: {
                'login@': {
                    templateUrl: '/app/components/login/forgotpassword.html',
                    controller: 'forgotpasswordCtrl'
                }
            },
            requireAuthen: false
        })
        .state('changepassword', {
            url: '/changepassword',
            views: {
                'login@': {
                    templateUrl: '/app/components/login/changepassword.html',
                    controller: 'changepasswordCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home', {
            url: '/',
            views: {
                'header@': {
                    templateUrl: '/app/shared/common/header.html',
                    controller: 'HeaderController'
                },
                'leftmenu@': {
                    templateUrl: '/app/shared/common/leftmenu.html',
                    controller: 'leftMenuController'
                },
                'content@': {
                    templateUrl: '/app/shared/common/content.html',
                    controller: 'ContentController'
                },
                'footer@': {
                    templateUrl: '/app/shared/common/footer.html',
                    controller: 'FooterController'
                }
            },
            requireAuthen: false
        })
        .state('home.geoip', {
            url: 'geoip',
            views: {
                'content@': {
                    templateUrl: '/app/components/geoip/geoip.html',
                    controller: 'geoipCtrl'
                }
            }
        })
        .state('home.city', {
            url: 'location/city',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/city/form_city.html',
                    controller: 'locationCtrl'
                }
            }
        })
        .state('home.city.edit', {
            url: '/edit/:cityID',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/city/editCity.html',
                    controller: 'editCityCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.drill', {
            url: 'location/drill',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/drill/form_drill.html',
                    controller: 'drillCtrl'
                }
            }
        })
        .state('home.drill.edit', {
            url: '/edit/:drillID',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/drill/editDrill.html',
                    controller: 'editDrillCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.zone', {
            url: '/location/zone',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/zone/form_zone.html',
                    controller: 'zoneCtrl'
                }
            }
        })
        .state('home.zone.edit', {
            url: '/edit/:zoneID',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/zone/editZone.html',
                    controller: 'editZoneCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.room', {
            url: 'location/room',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/room/form-room.html',
                    controller: 'roomCtrl'
                }
            }
        })
        .state('home.room.edit', {
            url: '/edit/:roomID',
            views: {
                'content@': {
                    templateUrl: '/app/components/location/room/editRoom.html',
                    controller: 'editRoomCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.rule', {
            url: 'rule',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/rulemaster.html',
                    controller: 'rulemasterCtrl'
                }
            }
        })
        .state('home.rule.stayhour', {
            url: '/stayhour/:ttpID',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/stayhour.html',
                    controller: 'stayhourCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.rule.editstayhour', {
            url: '/stayhour/edit/:rulemasterID/:tablename',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/editStayHour.html',
                    controller: 'editStayHourCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.rule.timeaccess', {
            url: '/timeaccess/:ttpID',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/timeaccess.html',
                    controller: 'timeAccessCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.rule.edittimeaccess', {
            url: '/timeaccess/edit/:rulemasterID/:tablename',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/editTimeAccess.html',
                    controller: 'editTimeAccessCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.rule.detail', {
            url: '/detail/:rulemasterID/:tablename',
            views: {
                'content@': {
                    templateUrl: '/app/components/rule/detailrule.html',
                    controller: 'detailruleCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.zonedefinition', {
            url: 'zonedefinition',
            views: {
                'content@': {
                    templateUrl: '/app/components/zonedefinition/zonedefinition.html',
                    controller: 'zonedefinitionCtrl'
                }
            }
        })

    .state('home.zonemonitoring', {
        url: 'zonemonitoring',
        views: {
            'content@': {
                templateUrl: '/app/components/zonemonitoring/zonemonitoring.html',
                controller: 'zonemonitoringCtrl'
            }
        }
    })

    .state('home.zonemonitoring.isparam', {
        url: '/:cityID/:drillID/:zoneID',
        views: {
            'content@': {
                templateUrl: '/app/components/zonemonitoring/zonemonitoring.html',
                controller: 'zonemonitoringCtrl'
            }
        },
        requireAuthen: false
    })


    .state('home.notification', {
        url: 'notification',
        views: {
            'content@': {
                templateUrl: '/app/components/notification/notification.html',
                controller: 'notificationCtrl'
            }
        }

    })

    .state('home.history', {
            url: 'history',
            views: {
                'content@': {
                    templateUrl: '/app/components/history/history.html',
                    controller: 'historyCtrl'
                }
            }

        })
        .state('home.dashboard', {
            url: 'dashboard',
            views: {
                'content@': {
                    templateUrl: '/app/components/dashboard/dashboard.html',
                    controller: 'dashboardCtrl'
                }
            }
        })
        .state('home.dashboard.detail', {
            url: '/city/:cityID/:name',
            views: {
                'content@': {
                    templateUrl: '/app/components/dashboard/dashboard-detail.html',
                    controller: 'dashboard-detailCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.dashboard.drill', {
            url: '/drill/:drillID/:drillname',
            views: {
                'content@': {
                    templateUrl: '/app/components/dashboard/dashboard-drill.html',
                    controller: 'dashboard-detail-drillCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.users', {
            url: 'users',
            views: {
                'content@': {
                    templateUrl: '/app/components/users/users.html',
                    controller: 'userCtrl'
                }
            }
        })
        .state('home.users.edit', {
            url: '/edit/:userID',
            views: {
                'content@': {
                    templateUrl: '/app/components/users/editUser.html',
                    controller: 'editUserCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.usergroup', {
            url: 'usergroup',
            views: {
                'content@': {
                    templateUrl: '/app/components/usergroup/group.html',
                    controller: 'groupCtrl'
                }
            }
        })
        .state('home.usergroup.edit', {
            url: '/edit/:groupID',
            views: {
                'content@': {
                    templateUrl: '/app/components/usergroup/editGroup.html',
                    controller: 'editGroupCtrl'
                }
            },
            requireAuthen: false
        })
        .state('home.sitetree', {
            url: 'sitetree',
            views: {
                'content@': {
                    templateUrl: '/app/components/sitetree/sitetree.html',
                    controller: 'siteTreeCtrl'
                }
            }
        })
        .state('home.sitetree.edit', {
            url: '/edit/:pageID',
            views: {
                'content@': {
                    templateUrl: '/app/components/sitetree/editSitetree.html',
                    controller: 'editSiteTreeCtrl'
                }
            },
            requireAuthen: false
        })
});

app.controller('HeaderController', ['$translate', '$scope', '$http', function($translate, $scope, $http) {

    // $scope.languages = [{ key: 'en', name: 'English (US)', cflag: 'flag flag-us' }, { key: 'vi', name: 'Vietnam', cflag: 'flag flag-vn' }, { key: 'de', name: 'Deutsch', cflag: 'flag flag-de' }];
    $http.get('/app/languages.json').success(function(response) {
        $scope.languages = response;
    });
    $scope.defaultLanguage = 'English (US)';
    $scope.defaultClassLanguage = 'flag flag-us';
    $scope.languageKeySelected = 'en';

    $scope.isActive = function(langkey) {
        return langkey === $scope.languageKeySelected;
    }
    $scope.changeLanguage = function(lang) {
        $scope.defaultLanguage = lang.name;
        $scope.defaultClassLanguage = lang.cflag;
        $scope.languageKeySelected = lang.key;
        $translate.use(lang.key);
    };

}]);

app.controller('testCtrl',['$scope', function testCtrl($scope) {
    $scope.greeting = "Hello world";
}]);

app.controller('ContentController', function($scope) {

});

app.controller('FooterController', function($scope) {

});
