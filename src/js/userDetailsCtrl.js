(function () {
    'use strict';

    angular.module('userListApp').controller('UserDetailsCtrl', [
        '$scope', '$location', '$routeParams', 'Transactions',
        function ($scope, $location, $routeParams, Transactions) {
            var userId = $routeParams.userId;
            Transactions.query({userId: userId}, function (data) {
                $scope.transactions = data;
            });
        }
    ]);
})();