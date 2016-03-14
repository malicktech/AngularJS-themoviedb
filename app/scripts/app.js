'use strict';

/**
 * @ngdoc overview
 * @name themoviedbApp
 * @description
 * # themoviedbApp
 *
 * Main module of the application.
 */
var app = angular.module('themoviedbApp', [
    // Dépendances Angular du "module"
    'ngRoute',
    // Dépedance autres modules
    'lub-tmdb-api'
]);


/** REGISTER Value & Constant CONFIG
================================================================= 
Register a value service with the $injector
*/
app.value('lubTmdbApiKey', '968cca12b1a8492036b1e1e05af57e3f');

/** ROUTE CONFIG
================================================================= */
app.config(function($routeProvider) {
    $routeProvider
        .when('/config', {
            templateUrl: 'views/config.html'
        }).when('/collection', {
            templateUrl: 'views/collection.html'
        }).when('/people', {
            templateUrl: 'views/people.html'
        }).when('/list', {
            templateUrl: 'views/list.html'
        }).when('/companies', {
            templateUrl: 'views/companies.html'
        }).when('/genres', {
            templateUrl: 'views/genre.html'
        }).when('/keywords', {
            templateUrl: 'views/keywords.html'
        }).when('/change', {
            templateUrl: 'views/change.html'
        }).otherwise({
            redirectTo: '/config'
        });
});


/** NAV CONTROLLLER
================================================================= */
app.controller('NavController', function($scope, $location) {

    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
});

/** SEARCH CONTROLLLER
================================================================= */
app.controller('SearchCtrl', function($scope, lubTmdbApi) {

    var suc = function(results) {
        $scope.searchResult = angular.toJson(results, true);
    };
    var err = function(results) {
        $scope.searchResult = results;
    };
    $scope.exec = function(type, method, query) {
        lubTmdbApi[type][method]({
            query: query
        }).then(suc, err);
    }

    $scope.movieInfos = function() {
        var rename = {
            alternativeTitles: 'alternative_titles',
            similarMovies: 'similar_movies',
            nowPlaying: 'now_playing',
            topRated: 'top_rated'
        }
        var needsNoIdentifier = ['latest', 'upcoming', 'nowPlaying', 'popular', 'topRated'];
        var action, append_to_response = [];
        angular.forEach($scope.movie, function(value, key) {
            if (value && !action) {
                action = key;
            } else if (value && action) {
                if (rename[key]) {
                    append_to_response.push(rename[key]);
                } else {
                    append_to_response.push(key);
                }
            }
        });
        if (!action) {
            action = 'movie';
        }
        if (needsNoIdentifier.indexOf(action) >= 0) {
            lubTmdbApi.movie[action]({
                params: {
                    append_to_response: append_to_response.join(',')
                }
            }).then(suc, err);
        } else {
            lubTmdbApi.movie[action]({
                query: $scope.identifier,
                params: {
                    append_to_response: append_to_response.join(',')
                }
            }).then(suc, err);
        }
    }
});
