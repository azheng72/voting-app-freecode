angular.module('voteApp')
.controller('VoteAppController',['$scope','$http',
    function($scope,$http){
        $http.post('/api/basicinfo',
                    {})
        .then(function(res){
            $scope.username=res.data.username;
        });
        
        
        
    }
]);