'use strict';

angular.module('users', [])

//load the users into the user list
.controller('UserListCtrl', ['$http', '$scope', '$location', function($http, $scope, $location){
  $http.get('/api/users')
    .success(function(data){
      $scope.users = data;
    });

  $scope.create = function(){
    $location.path('/users/new');
  };

  $scope.navigateTo = function(id){
    // $location.path('/users/632');
    $location.path('/users/' + id);
  };
}])

.controller('UserCreateCtrl', ['$http', '$scope', '$location', function($http, $scope, $location){
  // create a new user function
  $scope.submit = function(){
    $http.post('/api/users', $scope.user)
      .success(function(data){
        $location.path('/users/'+data._id);
      });
  };

  // some variables for the gender selection
  $scope.genders = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" }
  ];
}])

.controller('UserCtrl', ['$http', '$scope', '$location', '$routeParams', '$window', function($http, $scope, $location, $params, $window){

  // get the user details, but also get followers, who the user is following and the list of other users avilable to follow
  $http.get('/api/users/' + $params.id)
    .success(function(data){
      $scope.user = data.user;
      $scope.followings = [];
      $scope.followers = [];

      // populate followings and followers from results, based on relationship direction
      var len = data.results.rels.length;
      var followers = [], followings = [];
      for(var i = 0; i< len ; i++){
        // var item = data.results.nodes[i];
        // item.created = data.results.rels[i].data.created;
        data.results.nodes[i].relId = data.results.rels[i]._id;
        if(data.results.rels[i]._direction === 'out') $scope.followings.push(data.results.nodes[i]);
        if(data.results.rels[i]._direction === 'in') $scope.followers.push(data.results.nodes[i]);
      }

      // create an array of users who cannot be followed (e.g. already being followed)
      var usedUsers = [];
      usedUsers.push($scope.user);
      for(var i=0;i < $scope.followings.length; i++){
        usedUsers.push($scope.followings[i]);
      }

      // this is very inefficient considering we have already called this for the user list
      // in a real app you would create a service and access the cached list here
      // just keeping it simple
      $http.get('/api/users')
        .success(function(data){
          $scope.others = data;
          // filter the list of available followers to remove existing users
          // var len = $scope.others.length;
          var len = usedUsers.length;
          for(var i=0; i< len; i++){
            for(var j=0;j<$scope.others.length;j++){
              if($scope.others[j]._id === usedUsers[i]._id){
                $scope.others.splice(j,1);
              }
            }
          }
        });
    });

  // user is not editable at the start
  $scope.editable = false;
  // some variables for the gender selection
  $scope.genders = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" }
  ];

  // make the user editable but create backup in case needed (edit cancelled)
  var backup;
  $scope.edit = function(){
    backup = angular.copy($scope.user);
    $scope.editable = true;
  };

  // make the user no longer editable and reset in case changes were made
  $scope.cancelEdit = function(){
    $scope.user = backup;
    $scope.editable = false;
  };

  // check whether the user is editable (Edit button must be pressed)
  $scope.editCheck = function(){
    return $scope.editable;
  }

  // update the user
  $scope.update = function(){
    $http.put('/api/users/' + $params.id, $scope.user)
      .success(function(){
        $scope.editable = false;
        $window.location.href = $location.path();
      });
  };

  // delete the user
  $scope.remove = function(){
    $http.delete('/api/users/' + $params.id)
      .success(function(){
        // hack to refresh as I dont have a service with user list
        $window.location.href = '/';
      });
  };

  // Used to display a list of available people to follow or text saying there is no more people to follow
  $scope.othersExist = function(){
    if($scope.others  && $scope.others.length >= 1) return true;
    else return false;
  };

  // Used to display list of people following or else text to say nobody is following
  $scope.followersExist = function(){
    if($scope.followers  && $scope.followers.length >= 1) return true;
    else return false;
  };

  $scope.follow = function(id){
    $http.post('/api/users/' + id + '/follow', $scope.otherUser)
      .success(function(data){
        $scope.otherUser = JSON.parse($scope.otherUser);
        $scope.otherUser.relId = data._id;

        //Update the following list
        $scope.followings.push($scope.otherUser);

        // remove the user from the available list
        for(var i =0; i< $scope.others.length; i ++){
          if($scope.others[i]._id === $scope.otherUser._id){
            $scope.others.splice(i,1);
            break;
          }
        }
      });
  };

  $scope.unfollow = function(id, other){
    $http.post('/api/users/' + id + '/unfollow', {relId: other.relId})
      .success(function(){
        //remove from the following list
        $scope.followings.splice($scope.followings.indexOf(other), 1);
        // add back into the available list
        $scope.others.push(other);
      });
  };

  $scope.show = function(id){
    // $location.path('/users/632');
    $location.path('/users/' + id);
  };
}])

.filter('moment', function() {
  return function(dateString) {
    return moment(dateString).fromNow();
  };
});
