angular.module('guiaVas.controllers', [])

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
})

.controller('listCtrl', function($scope, $stateParams, $filter) {
	$scope.category = $filter('filter')($scope.categories,{name:$stateParams.name},true)[0];
})

.controller('calugasCtrl', function($scope) {
	$scope.categories = [
	{
		name:'plant',
		label:'Plantas',
		image:'img/plant.svg'
	},
	{
		name:'artropoda',
		label:'Artrópodos',
		image:'img/ant.svg'
	},
	{
		name:'ave',
		label:'Aves',
		image:'img/quail.svg'
	},
	{
		name:'mamifera',
		label:'Mamíferos',
		image:'img/fox.svg'
	},
	{
		name:'reptilia',
		label:'Reptiles',
		image:'img/lizard.svg'
	},
	{
		name:'fungi',
		label:'Hongos',
		image:'img/mushroom.svg'
	},
	{
		name:'lichen',
		label:'Líquenes',
		image:'img/lichen.svg'
	},
	{
		name:'other',
		label:'Otros',
		image:'img/snail.svg'
	}
	];
});