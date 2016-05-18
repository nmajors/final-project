class LocationsController {
  constructor($state, UserService, LocationsService, $scope, $http, $q, $timeout) {
    this._$http = $http;
    this._$state = $state;
    this._$timeout = $timeout;
    this._LocationsService = LocationsService;
    this._UserService = UserService;
    this._$q = $q;

    this.demoMode = false;

    this.adding = false;
    this.showList = false;
    this.hasCurrentPosition = false;


    this.states = this._LocationsService.statesList();
    this.newLocation = this._LocationsService.new();

    $scope.onClick = function(marker, eventName, model) {
      model.show = !model.show;
      console.log(model);
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


  toggleAdding() {

    if (this.adding) {

      this.isFading = true;

      this._$timeout(() => {
        this.adding = false;
        this.isFading = false;

      }, 900);

    } else {
      this.adding = true;
    }

  }
  addLocation() {
    this.hasCurrentPosition = false;
    this._LocationsService
      .createLocation(this.newLocation)
      .then((response) => {
        this.locations = response;
        this.showMarkers();
      });
    this.toggleAdding();
  }

  toggleDelete(place) {
    place.deleting = !place.deleting;
  }
  deleteLocation(place) {
    this._LocationsService.removeLocation(place);
    this.showMarkers();
  }


  changeLocation(place) {
    place.editing = !place.editing;
  }

  saveLocation(place) {
    place.editing = false;
    this._LocationsService.editLocation(place);
    this.showMarkers();
  }


  logout() {
    this._UserService.logout();
    this._$state.go("login");
  }

  toggleDemo() {
    //switch to view map when demo mode is toggled
    this.showList = false;

    this.demoMode = !this.demoMode;
    this.showMarkers();

  }

  toggleList() {
    if (this.showList) {

      this.isFading = true;
      //allows slideOutLeft time to slide out before showList/ng-show sets to false
      this._$timeout(() => {
        this.showList = false;
        this.isFading = false;

      }, 900);
      this.showMarkers();
    } else {
      this.showList = true;

    }
  }



  getMarkerIcon(location, index) {
    let markerIcon = './assets/images/';
    let locationWeatherCode = location.weather.weather[0].id;

    if (this.demoMode) {
      let demoCodes = [961, 531, 622, 771, 800, 804, 900, 902];
      locationWeatherCode = demoCodes[Math.floor(Math.random() * demoCodes.length)];
      if (index === 0) {
        locationWeatherCode = 900;
      }
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
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      //add a marker to the user's current location.
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      if (position.coords.longitude) {
        this.hasCurrentPosition = true;
      }
      this._$http
        .get(`https://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
        .then((response) => {
          console.log(response);
          let currentWeather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

          this.marker = {
            id: position.timestamp.toString(),
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            options: {
              icon: './assets/images/star.png'
            },

            name: "Your Weather",
            cityState: currentWeather.name,
            city: "",
            state: currentWeather.name,
            image: iconUrl,
            // weather: currentWeather,
            condition: currentWeather.weather[0].description,
            temp: currentWeather.main.temp,
            current: true

          };

          this.markers.push(this.marker);

        });
      //ng-if on ui-gmap-marker prevents marker add attempts before geolocation is complete
    })

    this.locations.forEach((location) => {


      let latitude = location.coords.lat;
      let longitude = location.coords.lng;
      this._$http
        .get(`https://whispering-everglades-16419.herokuapp.com/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`)
        .then((response) => {
          let weather = response.data;
          let iconCode = response.data.weather[0].icon;
          let iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

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
            city: `${location.city},`,
            state: location.state,
            cityState: `${location.city}, ${location.state}`,
            image: location.image,
            temp: location.weather.main.temp,
            condition: location.weather.weather[0].description,
            weather: location.weather,
            time: location.weather.dt * 1000,
            options: {
              icon: this.getMarkerIcon(location, this.markers.length)
            }
          }



          if (this.demoMode && this.marker.options.icon === './assets/images/tornado.png') {
            this.marker.options.animation = google.maps.Animation.BOUNCE;
            this.marker.image = 'https://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Tornado!";
          }


          if (this.demoMode && this.marker.options.icon === './assets/images/hurricane.png') {
            this.marker.options.animation = google.maps.Animation.BOUNCE;
            this.marker.image = 'https://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Hurricane";
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/thunderstorm.png') {
            this.marker.image = 'https://openweathermap.org/img/w/11d.png';
            this.marker.condition = "Thunderstorm";
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/snowy.png') {
            this.marker.image = 'https://openweathermap.org/img/w/13d.png';
            this.marker.condition = "Snow";
            this.marker.temp = 30;
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/rain.png') {
            this.marker.image = 'https://openweathermap.org/img/w/09d.png';
            this.marker.condition = "Rain";
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/haze.png') {
            this.marker.image = 'https://openweathermap.org/img/w/50d.png';
            this.marker.condition = "Haze";
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/cloudy.png') {
            this.marker.image = 'https://openweathermap.org/img/w/04d.png';
            this.marker.condition = "Cloudy";
          }

          if (this.demoMode && this.marker.options.icon === './assets/images/sunny.png') {
            this.marker.image = 'https://openweathermap.org/img/w/01d.png';
            this.marker.condition = "Clear Sky";
          }

          this.markers.push(this.marker);
        })
    });
  }


}

export default LocationsController;
