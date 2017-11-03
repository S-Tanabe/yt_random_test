
let app = angular.module('App', []);

// app.controller('AppController', ['$scope', '$http', function($scope, $http){
app.controller('AppController', function($scope, $http){

  $scope.doSearch = function() {
  	console.log($scope.searchText);
    let $uri = 'https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=' + $scope.searchText + '&key=AIzaSyCYHRkSlnNLtoPl9oxegYUanr_Wsn2tRN0';

    $http({
      method : 'GET',
      url : $uri
    }).success(function(data, status, headers, config) {
      let result = data.items[0];
      let playlist = [];
      for (let i = 1; i < data.items.length; i++) {
      	playlist.push(data.items[i].id.videoId);
      }
      result.playlist = playlist;
      let results = [data.items[0]];
      $scope.results = results;
      console.log(status);
      console.log(data);
    }).error(function(data, status, headers, config) {
      console.log(status);
    });
  };

  $scope.nextVideo = function() {
  	alert('hogehoge');
  }
});

app.directive('youtube', function($window){

  var _link = function(scope, element, attr){

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    $window.onYouTubeIframeAPIReady = function() {

      player = new YT.Player(element.children()[0], {
        height: scope.height,
        width: scope.width,
        playlist: scope.playlist,
        videoId: scope.youtubeId,
        playerVars: {
          rel: 1,
          autoplay: 1
        },
        events: {
          'onStateChange': function(event){
            if (event.data == YT.PlayerState.ENDED){
              scope.nextVideo();
              // alert('finished!!');
            }
          }
        }
      });
    }
  
  };

  return {
    link: _link,
    scope: {
      width: "@",
      height: "@",
      youtubeId: "@"
    },
    restrict: 'E',
    template: '<div></div>'
  };

});
