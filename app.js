var app = angular.module('app',['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl : "route/dashboard.html",
        controller: "dashCtrl",
        activetab: 'dashboard'
    })
    
    .when("/year/:yearNo", {
      templateUrl : "route/year.html",
      controller:'matchCtrl',
      activetab: 'year'
    })
    .otherwise({
        redirectTo: '/'
    });
    
  }]);

app.controller('mainController',['$scope','$location',function($scope,$location){
    $scope.a = 1213123123123123123123123123123123123123123123123;
    $scope.isActive = function(route) {
        return route === $location.path();
    }
}])

//services 
app.factory('teamService', function($http) {
    var teamService = {
      team: function() {
        var promise = $http.get('jsonData/team.json').then(function (response) {
            return response.data;
        });
        return promise;
      },
      season: function() {
        var promise = $http.get('jsonData/season.json').then(function (response) {
            return response.data;
        });
        return promise;
      },
      players: function() {
        var promise = $http.get('jsonData/player.json').then(function (response) {
            return response.data;
        });
        return promise;
      },
      match: function() {
        var promise = $http.get('jsonData/match.json').then(function (response) {
            return response.data;
        });
        return promise;
      }
    };
    return teamService;
  });

app.controller('matchCtrl',['$scope','$routeParams','teamService',function($scope,$routeParams,teamService){
    var year = $routeParams.yearNo ;
        $scope.year = year;
    $scope.init = function(){
        
        var oneYear;
        console.log(year,"year");
        $scope.yearWiseTeamStat = [];
        teamService.season().then(function(data){
            var oneSeason = _.filter(data,function(oS){
                var seasonYr = oS.Season_Year.toString().slice(-2);
                return seasonYr === year;
            })
            
            var orangecap = parseInt(oneSeason[0].Orange_Cap_Id) - 1;
            var purplecap = parseInt(oneSeason[0].Purple_Cap_Id) - 1;
            var manoftheseries = parseInt(oneSeason[0].Man_of_the_Series_Id) - 1;
            teamService.players().then(function(data){
                $scope.Orange_Cap = data[orangecap];
                $scope.Purple_Cap = data[purplecap];
                $scope.Man_of_the_Series = data[manoftheseries];
            })
        })

        teamService.team().then(function(data){
            _.each(data,function(team){
                team.no_result = 0;
                if(year == 12 || year == 13){
                    team.total = 16;
                }else {
                    team.total = 14;
                }
            })
            $scope.iplTeams = data;
        teamService.match().then(function(data){
            var oneYear =  _.filter(data, function(num){
                return num.Match_Date.slice(-2) === year;
            })
            _.each(oneYear,function(one){
                console.log(one,"one")
                if(one.Match_Winner_Id !=''){
                    var i = parseInt(one.Match_Winner_Id)-1; 
                if(i<0  || i == NaN){
                    return;
                }
                if($scope.iplTeams[i].won === undefined ){
                    $scope.iplTeams[i].won = 1;
                }else {
                    $scope.iplTeams[i].won = Number($scope.iplTeams[i].won) + 1;
                }
                
            }else if(one.Match_Winner_Id ==''){
                console.log(one,"not won",one.Opponent_Team_Id-1,one.Team_Name_Id-1);
                a= parseInt(one.Opponent_Team_Id)-1;
                b= parseInt(one.Team_Name_Id)-1;
                if($scope.iplTeams[a].no_result === undefined){
                    $scope.iplTeams[a].no_result = 1;
                }else {
                    $scope.iplTeams[a].no_result = Number($scope.iplTeams[a].no_result) + 1;
                }
                if($scope.iplTeams[b].no_result === undefined){
                    $scope.iplTeams[b].no_result = 1;
                }else {
                    $scope.iplTeams[b].no_result = Number($scope.iplTeams[b].no_result) + 1;  
                }
            }
            })
            $scope.yearWiseTeamStat = $scope.iplTeams;
            
            
            console.log($scope.yearWiseTeamStat,"fete")
        });
        });
    }
    $scope.init();
}])

app.controller('dashCtrl',['$scope','teamService',function($scope,teamService){
    // $scope.s =2342432423;
    // $scope.dataSource =  '{ "chart": { "caption": "Matches",'+
    // ' "captionFontBold": "0", "captionFontSize": "20", "xAxisName": "Teams",'+
    // ' "xAxisNameFontSize": "15", "xAxisNameFontBold": "0", "yAxisName": "Total No. of Matches",'+
    // ' "yAxisNameFontSize": "15", "yAxisNameFontBold": "0", "paletteColors": "#539FB6",'+
    // ' "plotFillAlpha": "80", "usePlotGradientColor": "0", "numberPrefix": "", "bgcolor": "#22252A",'+
    // ' "bgalpha": "95", "canvasbgalpha": "0", "basefontcolor": "#F7F3E7", "showAlternateHGridColor": "0",'+
    // ' "divlinealpha": "50", "divlinedashed": "0", "toolTipBgColor": "#000", "toolTipPadding": "10",'+
    // ' "toolTipBorderRadius": "5", "toolTipBorderThickness": "2", "toolTipBgAlpha": "62",'+
    // ' "toolTipBorderColor": "#BBB", "rotateyaxisname": "1", "canvasbordercolor": "#ffffff",'+
    // ' "canvasborderthickness": ".3", "canvasborderalpha": "100", "showValues": "0", "plotSpacePercent": "12" },'+
    // ' "data": [{ "label": "Jan", "value": "420000" }, { "label": "Feb", "value": "810000" , "sdfsdf": "810000"},'+
    // ' { "label": "Mar", "value": "720000" }, { "label": "Apr", "value": "550000" }, '+
    // '{ "label": "May", "value": "910000" }, { "label": "Jun", "value": "510000" },'+
    // ' { "label": "Jul", "value": "680000" }, { "label": "Aug", "value": "620000" }, '+
    // '{ "label": "Sep", "value": "610000" }, { "label": "Oct", "value": "490000" },'+
    // ' { "label": "Nov", "value": "900000" }, { "label": "Dec", "value": "730000" }]}';

    teamService.team().then(function(data){
        // if (data.hasOwnProperty('Team_Name')) {
        //     data['Team_Name'] = data['label'];
        //     delete data['Team_Name'];
        // }

        $scope.teams = data;
        teamService.match().then(function(data){
            _.each(data,function(onematch){
                if(onematch.Match_Winner_Id !=''){
                    var i = parseInt(onematch.Match_Winner_Id)-1;
                    if(i<0  || i == NaN){
                        return;
                    }
                    if($scope.teams[i].value === undefined ){
                        $scope.teams[i].value = 1;
                        $scope.teams[i].label = $scope.teams[i].Team_Name;
                    }else {
                        $scope.teams[i].value = Number($scope.teams[i].value) + 1;
                    }
                }
            })
            console.log($scope.teams,"$scope.teams")
        })
    })
}])


// app.controller('dashCtrl', function($scope) {
//     $scope.s=322332;
//   $scope.dataSource =  '{ "chart": { "caption": "Box Office Earnings - 2015", "captionFontBold": "0", "captionFontSize": "20", "xAxisName": "Month", "xAxisNameFontSize": "15", "xAxisNameFontBold": "0", "yAxisName": "Earnings (In USD)", "yAxisNameFontSize": "15", "yAxisNameFontBold": "0", "paletteColors": "#539FB6", "plotFillAlpha": "80", "usePlotGradientColor": "0", "numberPrefix": "$", "bgcolor": "#22252A", "bgalpha": "95", "canvasbgalpha": "0", "basefontcolor": "#F7F3E7", "showAlternateHGridColor": "0", "divlinealpha": "50", "divlinedashed": "0", "toolTipBgColor": "#000", "toolTipPadding": "10", "toolTipBorderRadius": "5", "toolTipBorderThickness": "2", "toolTipBgAlpha": "62", "toolTipBorderColor": "#BBB", "rotateyaxisname": "1", "canvasbordercolor": "#ffffff", "canvasborderthickness": ".3", "canvasborderalpha": "100", "showValues": "0", "plotSpacePercent": "12" }, "data": [{ "label": "Jan", "value": "420000" }, { "label": "Feb", "value": "810000" }, { "label": "Mar", "value": "720000" }, { "label": "Apr", "value": "550000" }, { "label": "May", "value": "910000" }, { "label": "Jun", "value": "510000" }, { "label": "Jul", "value": "680000" }, { "label": "Aug", "value": "620000" }, { "label": "Sep", "value": "610000" }, { "label": "Oct", "value": "490000" }, { "label": "Nov", "value": "900000" }, { "label": "Dec", "value": "730000" }]}';
// });

// app.controller("mainCtrl",['$scope',function($scope){
//     $scope.o ={name:"deeoalk"}
//     $scope.a1 = "parentController";
// }])
// app.controller("childCtrl",['$scope',function($scope){
//     $scope.a2 = "inherited controller";
// }])
// app.directive('myDirective',function(){
//     return{
//         template:'Derived from Main Controller<br>{{o.name}}<br><input type="text" ng-model="o.name"><br>{{a1}}<br>'+
//         '<input type="text" ng-model="a1"><br>'+
//         'Derived from child Controller<br>{{a2}}<br><input type="text" ng-model="a2"><br>'+
//         'my Directive <br>{{baya}}{{child}}<br><input type="text" ng-model="baya"><br><hr><son></son>',
//         controller:function($scope){
//             $scope.baya = "paul direcetive"
//         },
//         // link:function(scope,iele,iattr,ictrl){
//         //     scope.baya = ictrl.dire;
//         // }
//     }
// })
// app.directive('son',function(){
//     return {
//         template:'<hr>Derasdasdasdasdasdasdsadaived from Main Controller<br>{{o.name}}<br><input type="text" ng-model="o.name"><br>{{a1}}<br>'+
//         '<input type="text" ng-model="a1"><br>'+
//         'Derived from child Controller<br>{{a2}}<br><input type="text" ng-model="a2"><br>'+
//         'my Directive <br>{{baya}}<br><input type="text" ng-model="baya"><br><hr>{{child}}',
//         link:function(scope,iele,iattra){
//             scope.child="hey im child directive";
//         }
//     }
// });
// app.factory('Holder', function() {
//     return {
//       value: 0
//     };
//   });

// app.controller('ChildCtrl',["$scope","Holder", function($scope, Holder) {
//     $scope.holder = Holder;
//     $scope.increment = function() {
//       $scope.holder.value++;
//     };
//   }]);
  
//   app.controller('ChildCtrl2',["$scope","Holder", function($scope, Holder) {
//     $scope.holder = Holder;
//     $scope.increment = function() {
//       $scope.holder.value++;
//     };
//   }]);