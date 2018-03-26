angular.module('stockExchange').service('Stock', [function() {
    return function (data) {
      this.name = data.name;
      this.code = data.code;
      this.qte = data.qte;
      this.price = data.price;
      this.current_price = data.current_price;
  };
}]);
