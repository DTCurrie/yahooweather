var weather = angular.module("weather", [])
    .controller('MainController', ['$http', '$scope',
        function ($http, $scope) {
            $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22mclean%2Cva%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
                .then(function (response) {
                    $scope.weather = response.data.query.results.channel;
                    $scope.weather.img = "";

                    if ( /"/.test( $scope.weather.item.description ) ){
                        $scope.weather.img = $scope.weather.item.description.match( /"(.*?)"/ )[1];
                    } else {
                        $scope.weather.img = "NOT FOUND";
                    }
                });
        }]);
