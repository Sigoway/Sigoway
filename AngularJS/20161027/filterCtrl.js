var filterApp = angular.module('filterApp',[]);
filterApp.controller('filterCtrl', function($scope){
    $scope.persons = [
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
    $scope.firstPerson = $scope.persons[0];
});