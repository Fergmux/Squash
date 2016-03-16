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
        
      
    
      
        
    .state('badSquash.find', {
      url: '/page5',
      views: {
        'side-menu21': {
          templateUrl: 'templates/find.html',
          controller: 'findCtrl'
        }
      }
    })
        
      
    
      
        
    .state('badSquash.rankings', {
      url: '/page6',
      views: {
        'side-menu21': {
          templateUrl: 'templates/rankings.html',
          controller: 'rankingsCtrl'
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
        
      
    
      
        
    .state('badSquash.customMatch', {
      url: '/page10',
      views: {
        'side-menu21': {
          templateUrl: 'templates/customMatch.html',
          controller: 'customMatchCtrl'
        }
      }
    })
        
    .state('badSquash.playerProfiles', {
      url: '/page11',
      views: {
        'side-menu21': {
          templateUrl: 'templates/playerProfiles.html',
          controller: 'playerProfilesCtrl'
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


    .state('badSquash.matchData', {
      url: '/page13',
      views: {
        'side-menu21': {
          templateUrl: 'templates/matchData.html',
          controller: 'matchDataCtrl'
        }
      },
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/side-menu21/page1');

});