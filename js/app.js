(function () {
    'use strict';

    var urlPrefix = ' https://livedemo.xsolla.com/fe/test-task/shevchenko';

    var userListApp = angular.module('userListApp', ['ngRoute', 'ngResource']);

    userListApp.config([
        '$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
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

            $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            $httpProvider.defaults.headers.put = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
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
                var user = {
                    user_name: $scope.user.user_name,
                    email: $scope.user.email,
                    enabled: $scope.user.enabled
                };
                var data = prepareUrlParams(user);
                User.update({userId: userId}, data, function () {
                    $location.url('/home');
                });
            };
        }
    ]);

    userListApp.controller('UserCreateCtrl', [
        '$scope', '$location', '$routeParams', 'User',
        function ($scope, $location, $routeParams, User) {
            var userId = Date.now().toString();
            $scope.user = {
                user_id: userId
            };

            $scope.submit = function () {
                var user = $scope.user;
                var data = prepareUrlParams(user);
                User.create({}, data, function () {
                    $location.url('/home');
                });
            };
        }
    ]);

    userListApp.controller('UserRechargeCtrl', [
        '$scope', '$location', '$routeParams', 'Charge',
        function ($scope, $location, $routeParams, Charge) {
            var userId = $routeParams.userId;
            $scope.charge = {
                user_id: userId,
                amount: 0,
                comment: ''
            };

            $scope.submit = function () {
                var charge = {
                    amount: $scope.charge.amount,
                    comment: $scope.charge.comment
                };
                var data = prepareUrlParams(charge);
                Charge.create({userId: userId}, data, function () {
                    $location.url('/users/' + userId);
                });
            };
        }
    ]);

    userListApp.factory('User', [
        '$resource',
        function ($resource) {
            return $resource(urlPrefix + '/users/:userId', {}, {
                get: {method: 'GET', params: {userId: '@userId'}, isArray: false},
                update: {method: 'PUT', params: {userId: '@userId'}, isArray: false},
                create: {method: 'POST', params: {userId: '@userId'}, isArray: false},
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

    userListApp.factory('Charge', [
        '$resource',
        function ($resource) {
            return $resource(urlPrefix + '/users/:userId/recharge', {}, {
                create: {method: 'POST', params: {userId: '@userId'}, isArray: false}
            });
        }
    ]);

    var prepareUrlParams = function (paramObj) {
        var str = [];

        for (var p in paramObj) {
            if (paramObj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(paramObj[p]));
            }
        }

        return str.join("&");
    }
})();