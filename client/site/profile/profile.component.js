angular.module('profile').component('profile',{
    templateUrl:'/templates/client/site/profile/profile.template.html',
    controller:['$http',function ProfileController($http){

        $http.get('/api/:username/history').then(function(res){
            this.pools=res.data;
        });




    }]
});