(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserDetailsCtrl', ['$scope', '$routeParams', 'Transactions', UserDetailsCtrl]);

    function UserDetailsCtrl($scope, $routeParams, Transactions) {
        var userId = $routeParams.userId;

        Transactions.query({userId: userId}, function (data) {
            $scope.transactions = data;
        });
    }
})();