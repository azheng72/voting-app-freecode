
angular.module('voteApp').
config(['$locationProvider','$routeProvider',
    function config($locationProvider,$routeProvider){
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/profile',{
                template:'<profile></profile>'
            }).
            when('/pool',{
                template:'<pool></pool>'
            }). 
            otherwise('/pool');
    }
]);