(function () {
    'use strict';

    var urlPrefix = ' https://livedemo.xsolla.com/fe/test-task/shevchenko';

    var userListApp = angular.module('userListApp', ['ngRoute', 'ngResource']);

    userListApp.config([
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
                .when('/createuser', {
                    templateUrl: 'templates/user-edit.html',
                    controller: 'UserCreateCtrl'
                })
                .otherwise({
                    redirectTo: '/home'
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

            $scope.deleteUser = function (userId) {
                if (!confirm('Are you sure?')) {
                    return;
                }

                User.delete({userId: userId});
            };
        }
    ]);

    userListApp.controller('UserDetailsCtrl', [
        '$scope', '$location', '$routeParams', 'Transactions',
        function ($scope, $location, $routeParams, Transactions) {
            var userId = $routeParams.userId;
            Transactions.query({userId: userId}, function (data) {
                $scope.transactions = data;
            });
        }
    ]);

    userListApp.controller('UserEditCtrl', [
        '$scope', '$location', '$routeParams', 'User',
        function ($scope, $location, $routeParams, User) {
            var userId = $routeParams.userId;
            User.get({userId: userId}, function (data) {
                $scope.user = data;
            });

            $scope.submit = function () {
                var user = $scope.user;
                User.update({userId: userId}, user);
            };
        }
    ]);

    userListApp.controller('UserCreateCtrl', [
        '$scope', '$location', '$routeParams', 'User',
        function ($scope, $location, $routeParams, User) {
            var userId = Date.now();
            $scope.user = {
                user_id: userId
            };

            $scope.submit = function () {
                var user = $scope.user;
                User.create({}, user);
            };
        }
    ]);

    userListApp.factory('User', [
        '$resource',
        function ($resource) {
            return $resource(urlPrefix + '/users/:userId', {
                offset: 0,
                limit: 10
            }, {
                get: {method: 'GET', params: {userId: '@userId'}, isArray: false},
                update: {method: 'PUT', params: {userId: '@userId'}, isArray: false},
                create: {method: 'POST', params: {userId: '@userId'}, isArray: false},
                delete: {method: 'DELETE', params: {userId: '@userId'}, isArray: false},
                list: {method: 'GET', params: {offset: '@offset', limit: '@limit'}, isArray: false}
            });
        }
    ]);

    userListApp.factory('Transactions', [
        '$resource',
        function ($resource) {
            var regex = /\.\d{1,3}Z$/;
            var timeFromFilter = (new Date(0)).toISOString().replace(regex, 'Z');
            var timeToFilter = (new Date()).toISOString().replace(regex, 'Z');

            return $resource(urlPrefix + '/users/:userId/transactions?datetime_from=:timefrom&datetime_to=:timeto', {
                timefrom: timeFromFilter,
                timeto: timeToFilter
            });
        }
    ]);
})();