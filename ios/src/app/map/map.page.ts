import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

	location_status=0;
	@ViewChild('map',  {static: false}) mapElement: ElementRef;

	map: any;
  	locationCoords: any;
  	autocomplete: { input: string; };
  	autocompleteItems: any[];
  	location: any;
  	placeid: any;
  	GoogleAutocomplete: any;
  	geocoder: any;
  	geoencoderOptions: NativeGeocoderOptions = {
    	useLocale: true,
    	maxResults: 5
	};

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		private androidPermissions: AndroidPermissions,
    	private locationAccuracy: LocationAccuracy,
    	private geolocation: Geolocation,
		private nativeGeocoder: NativeGeocoder,
		public zone: NgZone
	) {
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    	this.autocomplete = { input: '' };
		this.autocompleteItems = [];
		this.geocoder = new google.maps.Geocoder;

    	this.locationCoords = {
			address: "",
			state:"",
			city:"",
	      	pincode:"",
	      	latitude: "",
	      	longitude: "",
		}
	}

  	ngOnInit() {
		// this.loadMap()
		this.checkGPSPermission();
  	}

	checkGPSPermission() {
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  		result => {
    		if(result.hasPermission) {
      			this.askToTurnOnGPS();
    		}else{
      			this.requestGPSPermission();
    		}
  		},err => {
    		this.location_status = 0;  
  		});
	}

	requestGPSPermission() {
	    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
	      	if(canRequest) {
	        	console.log("4");
	      	} 
	      	else {
	        	this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
	              	this.askToTurnOnGPS();
	            },
	            error => {
					this.location_status = 0;  
	            });
	      	}
	    });
	}

	askToTurnOnGPS() {
	    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
			this.location_status = 1;
	        this.loadMap()
	    },error => {
	    	this.location_status = 0;  
	    });
 	}

 	loadMap() {
		//FIRST GET THE LOCATION FROM THE DEVICE.
	  	this.geolocation.getCurrentPosition().then((resp) => {
			let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
			let mapOptions = {
			  	center: latLng,
			  	zoom: 15,
			  	disableDefaultUI: true,
			  	mapTypeId: google.maps.MapTypeId.ROADMAP
			} 
	
			//LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
			this.getGeoencoder(resp.coords.latitude, resp.coords.longitude); 
			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 

			this.map.addListener('tilesloaded', () => {
			  	console.log('accuracy',this.map, this.map.center.lat());
			  	this.getGeoencoder(this.map.center.lat(), this.map.center.lng())
			  	this.locationCoords.latitude = this.map.center.lat()
			  	this.locationCoords.longitude = this.map.center.lng()
			}); 
	  	})
	  	.catch((error) => {
			console.log(JSON.stringify(error));
	  	});
	}

	getGeoencoder(latitude, longitude) {
	  	this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
		.then((result: NativeGeocoderResult[]) => {
		  	this.locationCoords.address = this.generateAddress(result[0]);
		  	this.locationCoords.state = result[0]['administrativeArea'];
		  	this.locationCoords.city = result[0]['subAdministrativeArea'];
		  	this.locationCoords.pincode = result[0]['postalCode'];
		})
		.catch((error: any) => {
		  	console.log(JSON.stringify(error));
		});
	}

	generateAddress(addressObj) {
	  	let obj = [];
	  	let address = "";
	  	for (let key in addressObj) {
			obj.push(addressObj[key]);
	  	}
	  	obj.reverse();
	  	for (let val in obj) {
			if (obj[val].length)
			  address += obj[val] + ', ';
	  	}
	  	return address.slice(0, -2);
	}

	UpdateSearchResults(){
		if (this.autocomplete.input == '') {
			this.autocompleteItems = [];
			return;
		}
	  	this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
	  	(predictions, status) => {
			this.autocompleteItems = [];
			this.zone.run(() => {
			  predictions.forEach((prediction) => {
					this.autocompleteItems.push(prediction);
			  });
			});
	  	});
	}

	//wE CALL THIS FROM EACH ITEM.
	SelectSearchResult(item) {
	  	this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
			if(status === 'OK' && results[0])
			{
				this.map.setCenter({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
				this.getGeoencoder(results[0].geometry.location.lat(), results[0].geometry.location.lng());
			}
		});
		this.ClearAutocomplete();
	}

	//lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
	ClearAutocomplete(){
	  this.autocompleteItems = []
	  this.autocomplete.input = ''
	}

	//FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
	async confirmAddress(){
		let navigationExtras: NavigationExtras = {
			state: {
			  	locationCoords: this.locationCoords
			}
		};
		this.router.navigate(['/address'],navigationExtras);
	}

}
