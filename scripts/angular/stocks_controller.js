angular.module('stockExchange').controller('StocksController', ['$scope', '$http', 'Stock',

    function($scope, $http, Stock) {

        getWallet = function () {
            $http.get('http://127.0.0.1:3000/wallet')
                .then(function (response) {
                    $scope.wallet = [];
                    response.data.forEach(function(data) {
                        var boughtStock = new Stock({name: data.name, code: data.symbol, price: data.price, qte: data.qte, current_price: data.price});
                        $scope.wallet.push(boughtStock);
                    });
                }, function (error) {
                    console.log(error);
                });
        };

        $scope.getStocks = function () {

            if ($scope.toolbar !== '') {
                $http.get('http://127.0.0.1:3000/stocks?toolbar=' + $scope.toolbar)
                    .then(function(response) {
                        $scope.stocks = [];
                        if (response.data.quote.constructor === Array) {
                                response.data.quote.forEach(function(data) {
                                    var newStock = new Stock({name: data.Name, code: data.Symbol, price: data.Open});
                                    $scope.stocks.push(newStock);
                                }
                            );
                        } else {
                            var quote = response.data.quote;
                            var newStock = new Stock({name: quote.Name, code: quote.Symbol, price: quote.Open});
                            $scope.stocks.push(newStock);
                        }
                    }, function (error) {
                        console.log(error);
                    });
            }
        };

        $scope.doPurchase = function(stock) {
            stock.earn_price = stock.current_price;
            $http.post('http://127.0.0.1:3000/stocks', stock);
            location.reload();
        };

        $scope.getDetails = function(stock) {
            $scope.stockDetails = stock;
        };

        $scope.getStocks = function() {

            if ($scope.toolbar !== '') {
                $http.get('http://127.0.0.1:3000/stocks?toolbar=' + $scope.toolbar).then(function (response) {
                        $scope.stocks = [];
                        if (response.data.quote.constructor === Array) {
                            response.data.quote.forEach(function(data) {
                                    var newStock = new Stock({name: data.Name, code: data.Symbol, price: data.Open});
                                    $scope.stocks.push(newStock);
                                }
                            );
                        } else {
                            var quote = response.data.quote;
                            var newStock = new Stock({name: quote.Name, code: quote.Symbol, price: quote.Open});
                            $scope.stocks.push(newStock);
                        }
                    }, function (error) {
                        console.log(error);
                    }
                );
            }

        };

        // init my wallet from DB
        getWallet();

    }]);