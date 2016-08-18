var login=angular.module('login',[]);

login.controller('LoginController', ['$scope','$http','$httpParamSerializer',function LoginController($scope,$http,$httpParamSerializer) {
  $scope.loginSubmit= function(){

        $http({
                    method: 'POST',
                    url: '/api/login',
                    data: {username:$scope.username,password:$scope.password}
                    //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    
                            })
      .then(function(res){    // server return status code 200
                window.location = "/" + $scope.username + "/index";
                $scope.login={status:"Login Success!"};
      
            },function(err) { // status code '401' stand for unauthorized
                $scope.login= err.status=='422'? {status:"Error Username or Password"}:{status:err.status+err.data};
                //$scope.login = {status:err.data || 'Request failed'};
                //$scope.login={status:"Error Username or Password"};
            }
        );
  }
}]);