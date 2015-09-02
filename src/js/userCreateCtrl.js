(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserCreateCtrl', ['$scope', '$location', 'User', UserCreateCtrl]);

    function UserCreateCtrl($scope, $location, User) {
        var userId = Date.now().toString();

        $scope.user = {
            user_id: userId
        };

        $scope.submit = submit;

        function submit() {
            var user = $scope.user;

            User.create({}, user, function () {
                $location.url('/home');
            });
        };
    }
})();