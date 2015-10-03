angular.module('report.controllers', [])

.controller('ReportCtrl', function($scope, Chats, $ionicPopup, $http, apiUrl) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

$scope.form = {};

// Validate and submit form
$scope.sendReport = function(form){
	// TODO: Validate fields
  if ((form['postcode'] == null) || (form['date'] == null) || (form['well_id']) == null || (form['wt_depth'] == null))
  {
    console.log("Fill out the form!");
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: "Please fill out all the fields"
    });
  }
  else
  {
    //Send POST Request
    var url = apiUrl + '/api/update'
    $http.post(url, {
      postcode:form['postcode'],
      date:form['date'],
      well_id:form['well_id'],
      wt_depth:form['wt_depth']
    })
    .then(function(response) {
     // Perform on request confirmation:
     var alertPopup = $ionicPopup.alert({
      title: 'Submitted',
      template: 'Thanks!'
    });
   }, function(response) {
    //Error
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: "Something went wrong... Try again later"
    });
  });


  }

}
})