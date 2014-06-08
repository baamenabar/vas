angular.module('guiaVas.controllers', [])

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

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
			name:'bird',
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

})

.controller('slideContentCtrl', function($scope, species) {
	$scope.species = species;
})

.controller('listCtrl', function($scope, $stateParams, $filter) {
	//$filter //https://docs.angularjs.org/api/ng/filter/filter
	$scope.category = $filter('filter')($scope.categories,{name:$stateParams.name},true)[0];
	$scope.categorySpecies = $filter('filter')($scope.species,{group:$stateParams.name},true);
})

.controller('calugasCtrl', function($scope) {
	
});