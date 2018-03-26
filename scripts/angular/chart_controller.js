angular.module('stockExchange').controller('LineCtrl', ['$scope', '$http', function ($scope, $http) {

    $http.get('http://127.0.0.1:3000/wallet-graph')
        .then(function (response) {

            var labels = [];
            var data = [];

            response.data.forEach(function (value) {
                labels.push(value.date);
                data.push(value.value);
            });

            $scope.labels = labels;
            $scope.series = ['Wallet'];
            $scope.data = [data];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            };
            $scope.colours = [{
                fillColor: 'rgba(78, 180, 189, 0.2)',
                strokeColor: 'rgba(78, 180, 189, 1)',
                pointColor: 'rgba(78, 180, 189, 1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(78, 180, 189,0.8)'
            }];

        }, function (error) {
            console.log(error);
        });
}]);