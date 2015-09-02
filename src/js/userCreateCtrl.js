(function () {
    'use strict';

    angular
        .module('userListApp')
        .controller('UserCreateCtrl', ['$scope', '$location', 'User', UserCreateCtrl]);

    function UserCreateCtrl($scope, $location, User) {
        var userId = Date.now().toString();

        $scope.user = {
            user_id: userId,
            enabled: true
        };

        $scope.submit = submit;

        function submit() {
            var user = $scope.user;

            User.create({}, user, successCb, errorCb);

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