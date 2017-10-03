import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
    company:string;
    RS: string;
    Var: string;

    constructor(public storage:Storage, public events:Events){
        this.company="Jenn Company"
        this.RS="JK Report suite"
        this.Var="JK Var"
        this.events.subscribe('menu:Company', data => {
            this.company=data
        });
        this.events.subscribe('menu:RS', data => {
            this.RS=data
        });
        this.events.subscribe('menu:Var', data => {
            this.Var=data
        });
    }
  
}