/// <reference path="./typings/tsd.d.ts" />

var selectApp = angular.module("selectApp", []);
selectApp.controller("selectCtrl", function($scope){
    $scope.names=["bobs", "aloy", "chirs", "haloon"];
    $scope.sites=[
        {site:"tabao",url:"http://www.taobao.com"},
        {site:"baidu",url:"http://www.baidu.com"},
        {site:"xiaomi",url:"http://wwww.xiaomi.com"}
    ];
    $scope.sitesObj={
        taobao:"http://www.taobao.com",
        baidu:"http://www.baidu.com",
        xiaomi:"http://www.xiaomi.com"
    };
    $scope.cars={
        car01:{name:"bench", color:"white", salePrice:"100"},
        car02:{name:"bmw", color:"black", salePrice:"150"},
        car03:{name:"lotis", color:"silver", salePrice:"110"}
    }
});