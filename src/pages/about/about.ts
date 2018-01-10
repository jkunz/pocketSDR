import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  question1:any;
  question2:any;
  question3:any;
  question4:any;
  question5:any;
  DTMenabled:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  selectItem(q){
    if(typeof _satellite=="undefined"){
      this.DTMenabled=false
    }else{
      this.DTMenabled=true
    }

    let collapse=false
    if(this[q]===true){
      collapse=true
    }
    this.question1=false;
    this.question2=false;
    this.question3=false;
    this.question4=false;
    this.question5=false;
    
    if(collapse==false){
      this[q]=true
    }
  }

  showPicTutorial(){
    var modalPage = this.modalCtrl.create('ModalPage'); modalPage.present();
    if(this.DTMenabled===true){
      if(!_satellite.data.customVars["tutorial mode"]){
        _satellite.data.customVars["tutorial mode"]="Manually Opened"
      }
      _satellite.data.customVars["tutorial"]="Company Select: API Key"
      _satellite.track("tutorial");    
    }    
  }

  ionViewDidEnter() {
    if(typeof _satellite!="undefined"){
      _satellite.data.customVars["page name"]="About"
      _satellite.track("page view");
    }
  }

}
