// Creaci�n del m�dulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute']);

// Configuraci�n de las rutas
angularRoutingApp.config(function ($routeProvider) {

    $routeProvider
            .when('/', {
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .when('/acerca', {
                templateUrl: 'pages/acerca.html',
                controller: 'aboutController'
            })
            .when('/contacto', {
                templateUrl: 'pages/contacto.html',
                controller: 'contactController'
            })
            .otherwise({
                redirectTo: '/'
            });
});

angularRoutingApp.controller('mainController', function ($scope) {
    $scope.message = 'Hola, Mundo!';
});

angularRoutingApp.controller('aboutController', function ($scope) {
    $scope.message = 'Esta es la p�gina "Acerca de"';
});

angularRoutingApp.controller('contactController', function ($scope) {
    $scope.message = 'Esta es la p�gina de "Contacto", aqu� podemos poner un formulario';
});