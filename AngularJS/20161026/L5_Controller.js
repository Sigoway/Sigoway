var app = angular.module("testApp", []);
app.controller("inputCtrl", function($scope, $rootScope){
    $scope.text = null;
    $rootScope.email = "houbz@lzt.com.cn";
    $rootScope.displayEmailInfo = function(){
        return "Init email:" + $rootScope.email + " Input email:" + $scope.text;
    }
    $rootScope.persons = [
        {name:'jake', age:'20'},
        {name:'jues', age:'24'},
        {name:'marry', age:'23'},
        {name:'amy', age:'22'},
        {name:'lacus', age:'21'}
    ];
});