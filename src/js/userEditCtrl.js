(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserEditCtrl', ['$scope', '$location', '$routeParams', 'User', UserEditCtrl]);

    function UserEditCtrl($scope, $location, $routeParams, User) {
        var userId = $routeParams.userId;

        User.get({userId: userId}, function (data) {
            $scope.user = data;
        });

        $scope.submit = submit;

        function submit() {
            var user = {
                user_name: $scope.user.user_name,
                email: $scope.user.email,
                enabled: $scope.user.enabled
            };

            User.update({userId: userId}, user, successCb, errorCb);

            function successCb(data, responseHeaders) {
                if (data && data.code) {
                    errorCb(null, data.code + ': ' + data.message);
                    return;
                }

                $location.url('/users/' + userId);
            };

            function errorCb(httpResponse, message) {
                if (httpResponse && !message) {
                    message = 'Network error';
                }

                alert(message);
            };
        };
    }
})();