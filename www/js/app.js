// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('guiaVas', ['ionic','guiaVas.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('slidenav', {
    url: '/slidenav',
    abstract: true,
    templateUrl: 'slidenav.html'
  })
  .state('slidenav.florayfauna', {
    url: '/flora-y-fauna',
    //abstract: true,
    views: {
      'contenidoDelMenuPpal': {
        templateUrl: 'templates/flora-y-fauna.html',
        controller: 'calugasCtrl'
      }
    }
  })
  .state('slidenav.florayfauna.calugas', {
    url: '/calugas',
    views: {
      'fyf@slidenav.florayfauna': {
        templateUrl: 'templates/flora-y-fauna.calugas.html',
      }
    }
  })
  .state('slidenav.florayfauna.list', {
    url: '/list/:name',
    views: {
      'fyf@slidenav.florayfauna': {
        templateUrl: 'templates/flora-y-fauna.list.html',
        controller: 'listCtrl'
      }
    }
  })
  .state('slidenav.informaciongeneral', {
    url: '/informacion-general',
    views: {
      'contenidoDelMenuPpal': {
        templateUrl: 'templates/informacion-general.html'
        //,controller: ''
      }
    }
  })
  .state('slidenav.acercade', {
    url: '/acerca-de',
    views: {
      'contenidoDelMenuPpal': {
        templateUrl: 'templates/acerca-de.html'
        //,controller: ''
      }
    }
  })
  .state('slidenav.configuracion', {
    url: '/configuracion',
    views: {
      'contenidoDelMenuPpal': {
        templateUrl: 'templates/configuracion.html'
        //,controller: ''
      }
    }
  })
  .state('slidenav.mapa', {
    url: '/mapa',
    views: {
      'contenidoDelMenuPpal': {
        templateUrl: 'templates/mapa.html'
        //,controller: ''
      }
    }
  });
  //$urlRouterProvider.html5Mode(true);//no funciona, no sé por qué
  $urlRouterProvider.otherwise('/slidenav/flora-y-fauna/calugas');
});
