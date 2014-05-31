angular.module('guiaVas.controllers', [])

.controller('ContentController',function ($scope, $ionicSideMenuDelegate){
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
});