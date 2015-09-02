(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserRechargeCtrl', ['$scope', '$location', '$routeParams', 'Charge', UserRechargeCtrl]);

    function UserRechargeCtrl($scope, $location, $routeParams, Charge) {
        var userId = $routeParams.userId;

        $scope.charge = {
            user_id: userId,
            amount: 0,
            comment: ''
        };

        $scope.submit = submit;

        function submit() {
            var charge = {
                amount: $scope.charge.amount,
                comment: $scope.charge.comment
            };

            Charge.create({userId: userId}, charge, function () {
                $location.url('/users/' + userId);
            });
        };
    };
})();