(function () {
    'use strict';

    angular.module('userListApp').controller('UserCreateCtrl', [
        '$scope', '$location', '$routeParams', 'User',
        function ($scope, $location, $routeParams, User) {
            var userId = Date.now().toString();
            $scope.user = {
                user_id: userId
            };

            $scope.submit = function () {
                var user = $scope.user;
                User.create({}, user, function () {
                    $location.url('/home');
                });
            };
        }
    ]);
})();