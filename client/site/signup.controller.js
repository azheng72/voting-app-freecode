var signup=angular.module('signup',[]);

signup.controller('SignupController', ['$scope','$http',function LoginController($scope,$http) {
  $scope.signupSubmit= function(){

      $http.post(
          '/api/signup',
          {username:$scope.username,password:$scope.password}
                )
        .then(function(res){      // server return status code 200
                window.location = "/" + $scope.username + "/index";
                $scope.signup={status:"Signup Success!"};
      
            },function(err) {    // server return status code not 200
                $scope.signup= err.status=='422'? {status:"Username already existed"}:{status:err.status+err.data};
            }
        );
  }
}]);
