(function () {
    'use strict';

    angular.module('userListApp').controller('UserListCtrl', [
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
            $scope.canListBackward = false;
            $scope.canListForward = false;

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
})();