import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { RegserviceService } from '../../servers/regservice.service';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-keeperreg',
  templateUrl: './keeperreg.component.html',
  styleUrls: ['./keeperreg.component.scss']
})
declare var google: any;
export class KeeperregComponent implements OnInit {

  constructor(public service:RegserviceService,public router:Router,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }
  reg={
    firstName:'',
    lastName : '',
    email:'',
    address:'',
    city:'',
    country:'',
    zip: '',
    nic:'',
    password:'',
    confirmPassword:'',
    lat:'',
    lng:'',
    role:'keeper',
  }
iserror:boolean=false;
  res='';
  serverErrorMessages='';
  lat: number = null;
  lng: number = null;
  zoom: number = 4;
  origin = { lat: this.lat, lng: this.lng };
  destination = { lat: null, lng: null };
  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef: ElementRef;


  ngOnInit() {
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: [],
          componentRestrictions: { country: "LK" }
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.destination.lat = place.geometry.location.lat();
          this.destination.lng = place.geometry.location.lng();
          console.log(this.destination);
          this.reg.lat= this.destination.lat;
          this.reg.lng= this.destination.lng;
        // console.log(this.reg.lat)
        });
      });
    });
  }
register(){

  const token =this.service.getToken();
  const tokenPayload = decode(token);
  this.service.regkeeper(this.reg,tokenPayload._id)
            .subscribe(
                (response)=>{if(response){
                 this.res=response['status'];
                 console.log(response)
                  if(!this.res){
                    this.serverErrorMessages='Your email is already exists'
                  }else{console.log(response)
                    this.serverErrorMessages="Registration Succsesfull";
                    this.router.navigateByUrl('/user-profile/myparks');
                  }
                }
                
                }
                ,
                (error)=>{console.log(error);this.iserror=true;
                {if(error) this.serverErrorMessages='Your email is already exists';}}
              );
}


public closeAlert() {
  this.iserror=false;
}
}
