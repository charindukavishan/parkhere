import { Component, OnInit } from '@angular/core';
import { RegserviceService } from '../../servers/regservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ownerprofile',
  templateUrl: './ownerprofile.component.html',
  styleUrls: ['./ownerprofile.component.scss']
})
export class OwnerprofileComponent implements OnInit {


  constructor(public service:RegserviceService,public route:ActivatedRoute) { }
  private kepers ;
  private keepers=[];
  res;
  class;
  id;
  userDetails;
    userId='';
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];});
      console.log(this.id)
      this.service.getowner(this.id).subscribe(
        res => {
          this.userDetails = res;
          this.userId=this.userDetails._id;
          this.service.setid(this.userDetails._id);
          // console.log(this.userId);
          // console.log(this.userDetails)
        },
        err => { 
          console.log(err);
          
        });


    this.service.getkeepers(this.id).subscribe(response => {this.kepers=response;
      this.res=this.kepers.length;
      for (let i = 0; i < this.kepers.length; i++) {
        
        if(this.kepers[i].state=="close"){
          this.class="btn btn-danger btn-round";
        }
          else{
          this.class="btn btn-warning btn-round"
        }
        this.keepers[i] = {
          id:this.kepers[i]._id,
          name: this.kepers[i].name,
          class: this.class,
          isactivate: this.kepers[i].isactivate,
          state:this.kepers[i].state
          // time:response[i].state,
        };
      }
    });
  }


}
