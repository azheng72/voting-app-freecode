
angular.module('pool')
    .component('pool',{
        templateUrl:'/templates/client/site/pool/pool.template.html',
        controller:function PoolController($http,$rootScope,$scope){
            

            this.options=[
                {name:""},
                {name:""}
            ];
    
            this.addOption=function(){
                this.options.push({name:""});
            }
    
            this.delete=function(index){
                this.options.splice(index,1);
            }
    
            this.submit=function(){
                $scope.error="";
                $scope.url="";
                $scope.word="";
                if(inputcheck()){
                    $http.post('/api/addpool/',
                               {poolname:this.pool.poolname,options: this.options}
                                )
                    .then(
                        function(res){   //status code==200
                            $scope.word="Your new pool was created: "
                            $scope.url=res.data.url;
                        },
                        function(err){
                            if(err.status=='401') {
                                window.location = "/login";
                            }
                            else{
                                $scope.error="Pool name already existed, Please change another name.";
                            }
                        }
                    );
                }
                
            }
            
            var self=this;
            function inputcheck(){
                if(!self.pool || !self.pool.poolname) {
                    $scope.error="Input error, please input Poolname.";
                    return false;
                }
                if(self.options.length<2){
                    $scope.error="Please enter more than two options.";
                    return false;
                }
                for(var i=0;i<self.options.length;i++){
                    if(!self.options[i].name) {
                        $scope.error="Input error, please delete empty opion name.";
                        return false;
                    }
                }
                return true;
            }
    
        }
    })
