$('#submitUrl').click(function() {
  alert('submit');
});


var ResultPageCtrl = function($scope) {
  $scope.hitUrl = 'http://google.com';
  $scope.rets = [
    {
      hitUrl: 'http://google.com',
      result: true
    },
    {
      hitUrl: 'http://google.com',
      result: false
    }
  ];
}