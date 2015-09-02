(function () {
    var urlPrefix = ' https://livedemo.xsolla.com/fe/test-task/shevchenko';

    angular
        .module('userListApp')
        .factory('User', ['$resource', User]);

    angular
        .module('userListApp')
        .factory('Transactions', ['$resource', Transactions]);

    angular
        .module('userListApp')
        .factory('Charge', ['$resource', Charge]);

    function User($resource) {
        return $resource(urlPrefix + '/users/:userId', {}, {
            get: {method: 'GET', params: {userId: '@userId'}, isArray: false},
            update: {method: 'PUT', params: {userId: '@userId'}, isArray: false},
            create: {method: 'POST', params: {userId: '@userId'}, isArray: false},
            list: {method: 'GET', params: {offset: '@offset', limit: '@limit'}, isArray: false}
        });
    };

    function Transactions($resource) {
        var regex = /\.\d{1,3}Z$/;
        var timeFromFilter = (new Date(0)).toISOString().replace(regex, 'Z');
        var timeToFilter = (new Date()).toISOString().replace(regex, 'Z');

        return $resource(urlPrefix + '/users/:userId/transactions?datetime_from=:timefrom&datetime_to=:timeto', {
            timefrom: timeFromFilter,
            timeto: timeToFilter
        });
    };

    function Charge($resource) {
        return $resource(urlPrefix + '/users/:userId/recharge', {}, {
            create: {method: 'POST', params: {userId: '@userId'}, isArray: false}
        });
    }
})();