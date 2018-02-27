/**
 * Created by eGuber on 13.4.2016..
 */
var app = angular.module('int-revApp', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/home', {
    templateUrl: 'home.tpl.html',
    controller: 'homeCtrl'
  }).when('/blog_articles', {
    templateUrl: 'blog_articles.tpl.html',
    controller: 'blogArticlesCtrl',
    controllerAs: 'bactrl'
  }).when('/blog_article/:blogArticleId', {
    templateUrl: 'blog_article.tpl.html',
    controller: 'blogArticleCtrl',
    controllerAs: 'barticlectrl'
  }).when('/blog_categories', {
    templateUrl: 'shop_groups.tpl.html',
    controller: 'shopGroupsCtrl',
    controllerAs: 'sgctrl'
  }).when('/blog_category/:shopGroupId', {
    templateUrl: 'shop_group.tpl.html',
    controller: 'shopGroupCtrl',
    controllerAs: 'sgroupctrl'
  }).otherwise({
    redirectTo : '/home'
  })
}]);

