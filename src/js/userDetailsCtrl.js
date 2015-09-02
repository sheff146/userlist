(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserDetailsCtrl', ['$scope', '$routeParams', 'Transactions', 'User', UserDetailsCtrl]);

    function UserDetailsCtrl($scope, $routeParams, Transactions, User) {
        var userId = $routeParams.userId;

        User.get({userId: userId}, function (data) {
            $scope.user = data;
        });

        Transactions.query({userId: userId}, function (data) {
            $scope.transactions = data;
        });
    }
})();