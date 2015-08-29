(function () {
    'use strict';

    var urlPrefix = ' https://livedemo.xsolla.com/fe/test-task/shevchenko';

    var userListApp = angular.module('userListApp', ['ngRoute', 'ngResource']);

    userListApp.config([
        '$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'UserListCtrl'
                })
                .when('/users/:userId', {
                    templateUrl: 'templates/user-detail.html',
                    controller: 'UserDetailsCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);

    userListApp.controller('UserListCtrl', [
        '$scope', '$location', 'User',
        function ($scope, $location, User) {
            var search = $location.search();

            if (!search.limit || +search.limit < 0) {
                $location.search('limit', 10);
            }

            if (!search.offset || +search.offset < 0) {
                $location.search('offset', 0);
            }

            search = $location.search();

            $scope.limit = +search.limit;
            $scope.offset = +search.offset;

            var queryParams = {offset: $scope.offset, limit: $scope.limit};

            User.list('', queryParams, function (data) {
                $scope.users = data.data;

                $scope.canListBackward = queryParams.offset > 0;
                $scope.canListForward = queryParams.limit <= data.data.length;

                $scope.currentOffset = queryParams.offset;
                $scope.nextOffset = queryParams.offset + queryParams.limit;
                $scope.previousOffset = queryParams.offset - queryParams.limit;
            });
        }
    ]);

    userListApp.controller('UserDetailsCtrl', [
        '$scope',
        function ($scope) {

        }
    ]);

    userListApp.factory('User', [
        '$resource',
        function ($resource) {
            return $resource(urlPrefix + '/users/', {
                offset: 0,
                limit: 10
                /* http://localhost:8888/phones/phones.json?apiKey=someKeyThis */
            }, {
                // action: {method: <?>, params: <?>, isArray: <?>, ...}
                update: {method: 'PUT', params: {userId: '@userId'}, isArray: false},
                create: {method: 'POST', params: {userId: '@userId'}, isArray: false},
                list: {method: 'GET', params: {offset: '@offset', limit: '@limit'}, isArray: false},
            });
            //Phone.update(params, successcb, errorcb);
        }
    ]);

    /*userListApp.controller('ListCtrl', [
     '$scope', '$http',
     function ($scope, $http) {
     $http.get('http://livedemo.xsolla.com/fe/test-task/shevchenko/users?offset=0&limit=10').success(function (data) {
     $scope.users = data.data;
     }).error(function () {
     alert("Error loading users");
     });
     }]);*/
})();