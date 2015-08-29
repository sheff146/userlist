(function () {
    'use strict';

    var userListApp = angular.module('userListApp', []);

    userListApp.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('http://livedemo.xsolla.com/fe/test-task/shevchenko/users?offset=0&limit=10').success(function (data) {
            $scope.users = data.data;
        }).error(function () {
            alert("Error loading users");
        });
    }]);
})();