import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarSelectPage } from '../pages/var-select/var-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { TabsPage } from '../pages/tabs/tabs';

@Injectable()
export class PageKeeperService {
	shownPages: any

	constructor(public events:Events){
	    this.shownPages={}
	    this.shownPages['Company Selection']=true
	    this.shownPages['Add/Update Company']=true

	    this.events.subscribe('showPage:RSList', data => {
	      this.shownPages['Report Suite Selection']=data
	    });
	    this.events.subscribe('showPage:varList', data => {
	      this.shownPages['Variables']=data
	    });
	    this.events.subscribe('showPage:varData', data => {
	      this.shownPages['Variable Details']=data
	    });
    }

}