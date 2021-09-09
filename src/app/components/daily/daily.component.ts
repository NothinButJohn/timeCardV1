import { Component, OnInit } from '@angular/core';
import * as dateFns from 'date-fns';
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
  currentFormattedDate: Observable<any>;
  constructor() {
    this.currentFormattedDate = of(this.processCurrentDate());
    console.log("current date, processed through dateFns: ", this.currentFormattedDate)
  }

  ngOnInit(): void {
  }

  processCurrentDate(){
    let currentDate = new Date();
    let currentMonth = dateFns.getMonth(currentDate);
    let currentDayOfWeek = dateFns.getDay(currentDate);
    let currentHour = dateFns.getHours(currentDate);
    let currentMinutes = dateFns.getMinutes(currentDate);
    let dateOfMonth = dateFns.getDate(currentDate);
    let currentYear = dateFns.getYear(currentDate);
    return {
      currentMonth,
      currentDayOfWeek,
      currentHour,
      currentMinutes,
      dateOfMonth,
      currentYear
    }
  }

  addToDay(){

  }
}



