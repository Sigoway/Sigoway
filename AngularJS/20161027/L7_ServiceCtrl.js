var serviceApp = angular.module("serviceApp", []);

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var colorIndex = 0;

//custom service
serviceApp.service("sigoService", function() {
    this.appendPrefix = function(text){
        return "*" + text;
    }
});

serviceApp.controller("serviceCtrl", function($scope, $location, $http, $timeout, $interval
    ,sigoService){
    var absUrl = $location.absUrl();
    $scope.localUrl = absUrl;
    
    $http.get("../view/L6.html").then(function(response){
        $scope.responseData = response.data;
    });
    
    $scope.title = 'AngularJS Service';
    $timeout(function(){
        $scope.title = sigoService.appendPrefix($scope.title);
        $scope.delayInfo = "I'm display after 500 millseconds.";
    }, 500);

    $interval(function(){
        $scope.delayInfoColor = colors[colorIndex % colors.length];
        colorIndex++;
        $scope.thetime = new Date().toLocaleTimeString();
    }, 1000);

    //get remote data about two implement
    //implement one
    $http.get("../resource/person.json").success(function(response){
        $scope.persons1 = response.persons; 
        $scope.successData = response.persons; //correct
        //$scope.successData = response.data.persons; //error
    });
    //implement two
    $http.get("../resource/person.json").then(function(response){
        $scope.persons2 = response.data.persons;
        $scope.thenData = response.data.persons; //correct
        //$scope.thenData = response.persons; //error
    });
});

//Custom filter
serviceApp.filter('sigoFilter', ['sigoService', function(sigoService){
    return function(x){ 
        return sigoService.appendPrefix(x); 
    };
}]);