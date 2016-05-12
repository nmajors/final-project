class LocationsController {
  constructor($state, UserService, LocationsService, $scope, $http, $q) {
    this._$http = $http;
    this._$state = $state;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this._$q = $q;

    this.demoMode = false;
    this.showWindow = true;
    this.adding = false;

    this.markers = [];
    // this.locations = [];

    this.newLocation = this._LocationsService.new();
    // this.editedLocation = this._locationsService.removeLocation();



    $scope.onClick = function(marker, eventName, model) {
      model.show = !model.show;
    };


    this.map = {
      center: {
        latitude: 32.7476539,
        longitude: -82.2650471
      },
      zoom: 8
    };


    this._UserService
      .isLoggedIn()
      .then((response) => {

        this.user = response;
        navigator.geolocation.getCurrentPosition((position) => {
          //add a marker to the user's current location.
          this.currentPosition = {
            id: position.timestamp.toString(),
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            options: {
              icon: '../assets/images/star.png'
            },
            title: "Your current Location",
            weather: {},
            image: ""
          };

          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          this._$http
            .get(`http://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
            .then((response) => {
              console.log(response);
              let weather = response.data;
              let iconCode = response.data.weather[0].icon;
              let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

              this.currentPosition.weather = weather;
              this.currentPosition.image = iconUrl;

              console.log(this.currentPosition);
            });
          //ng-if on ui-gmap-marker prevents marker add attempts before geolocation is complete
        });
        this._LocationsService.getLocations(this.user)
          .then((response) => {
            this.locations = response;
            this.showMarkers();
          });

      })
      .catch((error) => {
        this._$state.go("login");
      });

  }

  toggleAdding(){
    this.adding = !this.adding;
  }
  addLocation() {
    // this.adding = true;
    this._LocationsService
      .createLocation(this.newLocation)
      .then((response) => {
        this.locations = response;
        this.showMarkers();
      });
      this.toggleAdding();
  }

  deleteLocation(place) {
    this._LocationsService.removeLocation(place);
    this.showMarkers();
  }

  changeLocation(place) {
    place.editing = true;
  }

  saveLocation(place) {
    place.editing = false;
    this._LocationsService.editLocation(place);
  }


  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }

  toggleDemo() {
    this.demoMode = !this.demoMode;
    this.showMarkers();
  }

  // toggleList(){
  //   this.showList = !this.showList;
  // }


  getMarkerIcon(location) {

    let markerIcon = '../assets/images/';
    let locationWeatherCode = location.weather.weather[0].id;

    if (this.demoMode) {

      let demoCodes = [961, 531, 622, 771, 800, 804, 900, 902];
      locationWeatherCode = demoCodes[Math.floor(Math.random() * demoCodes.length)];
      console.log('demo mode ' + locationWeatherCode);
    }

    if (locationWeatherCode >= 200 && locationWeatherCode <= 232 || locationWeatherCode === 960 || locationWeatherCode === 961) {
      markerIcon += 'thunderstorm.png';

    } else if (locationWeatherCode >= 300 && locationWeatherCode <= 531) {
      markerIcon += 'rain.png';
    } else if (locationWeatherCode >= 600 && locationWeatherCode <= 622) {
      markerIcon += 'snowy.png';
    } else if (locationWeatherCode >= 700 && locationWeatherCode <= 771) {
      markerIcon += 'haze.png';
    } else if (locationWeatherCode >= 801 && locationWeatherCode <= 804) {
      markerIcon += 'cloudy.png';
    } else if (locationWeatherCode === 800) {
      markerIcon += 'sunny.png';
    } else if (locationWeatherCode === 781 || locationWeatherCode === 900) {
      markerIcon += 'tornado.png';
    } else if (locationWeatherCode === 901 || locationWeatherCode === 902) {
      markerIcon += 'hurricane.png';
    } else {
      markerIcon += 'default.png';
    }
    return markerIcon;

  }

  showMarkers() {
    this.markers = [];

    this.locations.forEach((location) => {


      let latitude = location.coords.lat;
      let longitude = location.coords.lng;
      this._$http
        .get(`http://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
        .then((response) => {
          let weather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

          location.weather = weather;
          location.image = iconUrl;

          this.marker = {
            id: location.$id,
            coords: {
              latitude: location.coords.lat,
              longitude: location.coords.lng
            },
            name: location.title,
            address: location.address,
            city: location.city,
            state: location.state,
            image: location.image,
            temp: location.weather.main.temp,
            condition: location.weather.weather[0].description,
            weather: location.weather,
            time: location.weather.dt * 1000,
            options: {
              icon: this.getMarkerIcon(location)
            }
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/tornado.png') {
            this.marker.options.animation = google.maps.Animation.BOUNCE;
            this.marker.image = 'http://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Tornado, seek shelter!";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/hurricane.png') {
            this.marker.options.animation = google.maps.Animation.BOUNCE;
            this.marker.image = 'http://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Hurricane";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/thunderstorm.png') {
            this.marker.image = 'http://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Thunderstorm";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/snowy.png') {
            this.marker.image = 'http://openweathermap.org/img/w/13d.png';
            this.marker.condition = "Snow";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/rain.png') {
            this.marker.image = 'http://openweathermap.org/img/w/09d.png';
            this.marker.condition = "Rain";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/haze.png') {
            this.marker.image = 'http://openweathermap.org/img/w/50d.png';
            this.marker.condition = "Haze";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/cloudy.png') {
            this.marker.image = 'http://openweathermap.org/img/w/04d.png';
            this.marker.condition = "Cloudy";
          }

          if (this.demoMode && this.marker.options.icon === '../assets/images/sunny.png') {
            this.marker.image = 'http://openweathermap.org/img/w/01d.png';
            this.marker.condition = "Clear Sky";
          }

          console.log(this.marker);
          this.markers.push(this.marker);

        })

    });

  }


}

export default LocationsController;
