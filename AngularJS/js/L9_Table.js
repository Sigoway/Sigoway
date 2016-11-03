///<reference path="./typings/tsd.d.ts" />
var app = angular.module("tableApp", []);
app.controller("tableCtrl",function($scope, $http){
    $http.get("../resource/person.json").success(function(response){
        $scope.persons = response.persons;
    });
});