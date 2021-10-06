import {Component, Inject, OnInit} from '@angular/core';
import * as dateFns from 'date-fns';

import {Observable, of} from "rxjs";
import {MatDialog, MatDialogClose, MatDialogConfig, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {shiftsMock, shiftsMock2} from "../../data.mock";
import {concatMap, map} from "rxjs/operators";
@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
  currentFormattedDate: Observable<any>;
  shiftsMock$: Observable<any> = of(shiftsMock);
  shiftsMock2$: Observable<any> = of(shiftsMock2);
  startOfWeekDate$: Observable<any> = new Observable<any>();

  weeklyData$: Observable<any> = new Observable<any>()

  constructor(private matDialog: MatDialog) {
    this.currentFormattedDate = of(this.processCurrentDate());
    // console.log("current date, processed through dateFns: ", this.currentFormattedDate)
  }

  ngOnInit(): void {
    // console.log(this.getRelativeTimeFormattedString(shiftsMock[0].timeOut))
    if(this.currentFormattedDate == null){}else{
      this.startOfWeekDate$ = this.getStartOfWeek();
      this.weeklyData$ = this.processShiftData(this.shiftsMock2$)
    }

  }

  getStartOfWeek(): Observable<any>{
    return this.currentFormattedDate.pipe(
      map(formattedDate => {
        console.log(formattedDate)
        let startOfWeek: any;
        if(formattedDate.currentDayOfWeek == 0){
          startOfWeek = formattedDate.currentDate;
        }else{
          startOfWeek = dateFns.previousSunday(formattedDate.currentDate)
        }
        console.log(startOfWeek)
        return startOfWeek;
      })
    )
  }

  processShiftData(shiftData: Observable<any>){
    return this.startOfWeekDate$.pipe(
      concatMap((sunday) => {
        console.log(sunday)
        let weekDates: Date[] = dateFns.eachDayOfInterval({start: sunday, end: dateFns.addDays(sunday, 6)});
        let weekDatesKeyFormat: string[] = [];
        weekDates.forEach((date) => {
          let month = dateFns.getMonth(date)
          let day = dateFns.getDate(date)
          let year = dateFns.getYear(date)
          console.log(month)
          weekDatesKeyFormat.push(dateFns.lightFormat(date, 'MM-dd-yyyy'));
        })
        console.log(weekDatesKeyFormat)
        return shiftData.pipe(
          map((shiftsObject: any) => {
            let shiftsInInterval: any[] = [];
            weekDatesKeyFormat.forEach((dateKey) => {
              shiftsInInterval = [...shiftsInInterval ,shiftsObject.dateKey]
            })
            console.log(shiftsInInterval)
            return shiftsInInterval;
          })
        )
      })
    )
  }

  processCurrentDate(){
    let currentDate = new Date('July 13, 2021 00:00:0000');
    let currentMonth = dateFns.getMonth(currentDate);
    let currentDayOfWeek = dateFns.getDay(currentDate);
    let currentHour = dateFns.getHours(currentDate);
    let currentMinutes = dateFns.getMinutes(currentDate);
    let dateOfMonth = dateFns.getDate(currentDate);
    let currentYear = dateFns.getYear(currentDate);
    return {
      currentDate,
      currentMonth,
      currentDayOfWeek,
      currentHour,
      currentMinutes,
      dateOfMonth,
      currentYear
    }
  }

  addToDay(){
    let mdc = new MatDialogConfig()
    mdc.width = '250px';
    mdc.height = '400px';
    mdc.data = this.currentFormattedDate;
    this.matDialog.open(AddToCurrentDayDialog, mdc)
  }

  getRelativeTimeFormattedString(dateInstance: Date){
    let hours = dateFns.getHours(dateInstance);
    let minutes = dateFns.getMinutes(dateInstance);
    if(hours > 12){
      return `${hours - 12}:${minutes}pm`
    }else{
      if(hours == 0){
        return `${12}:${minutes}am`
      }else{
        return `${hours}:${minutes}am`
      }
    }
  }

  getTotalHoursForDay(){

  }

}

@Component({
  selector: 'addToCurrDayDialog',
  templateUrl: './addToCurrDayDialog.component.html',
  styleUrls: ['./daily.component.scss']
})
export class AddToCurrentDayDialog implements OnInit {
  currentFormattedDate: Observable<any>
  paycodes = ['OT', 'N']
  constructor(private dialogRef: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentFormattedDate = this.data;
  }
  ngOnInit() {

  }
}


