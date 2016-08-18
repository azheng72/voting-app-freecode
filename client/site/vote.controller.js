
var vote=angular.module('vote',['ngCookies','chart.js']);

vote.controller('VoteController', ['$scope','$http','$cookies',function LoginController($scope,$http,$cookies) {
    var names=[];
    var votes=[];
    
    var pool=$cookies.get('pool');
    pool=pool.replace('j:',''); //delete the 'j:'
    pool=JSON.parse(pool);
    
    //$scope.pool=pool;
    $scope.chartOptions={
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };
    if(Object.keys(pool).includes('error')==false){
            
            var options=pool.options;
            
            options.forEach(function(val,idx){
                names.push(val.name);
                votes.push(val.vote);
                $scope.labels = names.slice();
                $scope.data = votes.slice();
            });
            

    }

    $scope.change=function(){
        var newvotes=votes.slice();
        newvotes[names.indexOf($scope.select.name[0])]++;
        $scope.data=newvotes;
    };
    
    $scope.submit=function(){
        
        if($scope.select){
            $http.post('/api/vote',
                {poolname:pool.poolname,updateOption:{name:$scope.select.name[0],vote:$scope.data[names.indexOf($scope.select.name[0])]}}
            )
            .then(
                function(res){
                    $scope.update="update success";
                    location.reload();
                },
                function(err){
                    $scope.update="error";
                }
            );
        }
        else{
            $scope.update="Please Vote";
        }  
    }
    
    
}]);
