(function () {
    'use strict';

    angular.module('userListApp', ['ngRoute', 'ngResource']).config([
        '$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'templates/home.html',
                    controller: 'UserListCtrl'
                })
                .when('/users/:userId', {
                    templateUrl: 'templates/user-detail.html',
                    controller: 'UserDetailsCtrl'
                })
                .when('/users/:userId/edit', {
                    templateUrl: 'templates/user-edit.html',
                    controller: 'UserEditCtrl'
                })
                .when('/users/:userId/recharge', {
                    templateUrl: 'templates/user-recharge.html',
                    controller: 'UserRechargeCtrl'
                })
                .when('/createuser', {
                    templateUrl: 'templates/user-edit.html',
                    controller: 'UserCreateCtrl'
                })
                .otherwise({
                    redirectTo: '/home'
                });
        }
    ]);
})();