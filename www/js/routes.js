angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
    .state('badSquash', {
      url: '/side-menu21',
      abstract:true,
      templateUrl: 'templates/badSquash.html'
    })
      
    
      
        
    .state('badSquash.login', {
      url: '/page1',
      views: {
        'side-menu21': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
    })
        
      
    
      
        
    .state('signup', {
      url: '/page2',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
        
      
    
      
        
    .state('badSquash.myProfile', {
      url: '/page3',
      views: {
        'side-menu21': {
          templateUrl: 'templates/myProfile.html',
          controller: 'myProfileCtrl'
        }
      }
    })
        
      
    
      
        
    .state('badSquash.rankings', {
      url: '/page5',
      views: {
        'side-menu21': {
          templateUrl: 'templates/rankings.html',
          controller: 'rankingsCtrl'
        }
      }
    })
        
      
    
      
        
    .state('badSquash.squashLevels', {
      url: '/page6',
      views: {
        'side-menu21': {
          templateUrl: 'templates/squashLevels.html',
          controller: 'squashLevelsCtrl'
        }
      },
      // resolve: {
      //   filts: function(FiltService) {
      //     return FiltService.getFilts()
      //   }
      // }
    })
        
      
    
      
        
    .state('badSquash.teams', {
      url: '/page9',
      views: {
        'side-menu21': {
          templateUrl: 'templates/teams.html',
          controller: 'teamsCtrl'
        }
      }
    })
        
      
    
      
        
    .state('badSquash.players', {
      url: '/page10',
      views: {
        'side-menu21': {
          templateUrl: 'templates/players.html',
          controller: 'playersCtrl'
        }
      }
    })
        
      
    
      
        
    .state('badSquash.settings', {
      url: '/page12',
      views: {
        'side-menu21': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })



    .state('badSquash.filters', {
      url: '/page13',
      views: {
        'side-menu21': {
          templateUrl: 'templates/filters.html',
          controller: 'filtersCtrl'
        }
      },
      // resolve: {
      //   filts: function(FiltService, filters) {
      //     FiltService.setFilts(filters)
      //   }
      // }
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/side-menu21/page1');

});