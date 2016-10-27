var serviceApp = angular.module("serviceApp", []);

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var colorIndex = 0;

var persons = [
    {firstName:'hou', lastName:'BZ', age:'30', solary:'100', months:'15'},
    {firstName:'lou', lastName:'bz', age:'38', solary:'105', months:'13'},
    {firstName:'mou', lastName:'bz', age:'29', solary:'103', months:'10'},
    {firstName:'nou', lastName:'bz', age:'24', solary:'102', months:'13'},
    {firstName:'ho', lastName:'bz', age:'27', solary:'108', months:'12'},
    {firstName:'hu', lastName:'bz', age:'25', solary:'109', months:'11'},
    {firstName:'mu', lastName:'bz', age:'32', solary:'110', months:'14'},
    {firstName:'nu', lastName:'bz', age:'23', solary:'120', months:'10'},
    {firstName:'nob', lastName:'bz', age:'32', solary:'106', months:'12'},
    {firstName:'ni', lastName:'bz', age:'33', solary:'107', months:'13'}
];

//custom service
serviceApp.service("sigoService", function() {
    this.appendPrefix = function(text){
        return "*" + text;
    }
});

serviceApp.controller("serviceCtrl", function($scope, $location, $http, $timeout, $interval
    ,sigoService){
    //var absUrl = $location.absUrl();
    //$rootscope.localUrl = "abcd" + absUrl;
    
    // $http.get("L6.html").then(function(response){
    //     $scope.baiduData = response.data;
    // });
    
    $scope.title = 'AngularJS Service';
    $timeout(function(){
        $scope.title = sigoService.appendPrefix($scope.title);
        $scope.delayInfo = "I'm display after 500 millseconds.";
    }, 500);

    $interval(function(){
        $scope.delayInfoColor = colors[colorIndex % colors.length];
        colorIndex++;
        $scope.thetime = new Date().toLocaleTimeString();
    }, 1000)

    $scope.persons = persons;
});

//Custom filter
serviceApp.filter('sigoFilter', ['sigoService', function(sigoService){
    return function(x){ 
        return sigoService.appendPrefix(x); 
    };
}]);