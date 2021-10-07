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
  selectedDate$ = of(new Date("Tue Jul 13 2021"))
  currentFormattedDate: Observable<any>;
  shiftsMock$: Observable<any> = of(shiftsMock);
  shiftsMock2$: Observable<any> = of(shiftsMock2);
  startOfWeekDate$: Observable<any> = new Observable<any>();
  weeklyData$: Observable<any> = new Observable<any>()
  weekOverview$: Observable<any> = new Observable<any>();
  constructor(private matDialog: MatDialog) {
    this.currentFormattedDate = of(this.processCurrentDate());
    // console.log("current date, processed through dateFns: ", this.currentFormattedDate)
    this.selectedDate$.subscribe(x => (console.log('selectedDate: ', x)))

  }

  ngOnInit(): void {
    // console.log(this.getRelativeTimeFormattedString(shiftsMock[0].timeOut))
    if(this.currentFormattedDate == null){}else{
      this.startOfWeekDate$ = this.getStartOfWeek();
      this.weeklyData$ = this.processShiftData(this.shiftsMock2$)
      this.weekOverview$ = this.initWeek();
    }

  }

  getStartOfWeek(): Observable<any>{
    return this.currentFormattedDate.pipe(
      map(formattedDate => {
        // console.log(formattedDate)
        let startOfWeek: any;
        if(formattedDate.currentDayOfWeek == 0){
          startOfWeek = formattedDate.currentDate;
        }else{
          startOfWeek = dateFns.previousSunday(formattedDate.currentDate)
        }
        console.log('start of week: ',startOfWeek)
        return startOfWeek;
      })
    )
  }

  initWeek(): Observable<any> {
    return this.startOfWeekDate$.pipe(
      map((sunday) => {
        let week = [
          {
            day: 'sunday',
            date: sunday,
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(sunday, 'MM-dd-yyyy')
          },          {
            day: 'monday',
            date: dateFns.addDays(sunday, 1),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 1), 'MM-dd-yyyy')
          },          {
            day: 'tuesday',
            date: dateFns.addDays(sunday, 2),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 2), 'MM-dd-yyyy')
          },          {
            day: 'wednesday',
            date: dateFns.addDays(sunday, 3),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 3), 'MM-dd-yyyy')
          },          {
            day: 'thursday',
            date: dateFns.addDays(sunday, 4),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 4), 'MM-dd-yyyy')
          },          {
            day: 'friday',
            date: dateFns.addDays(sunday, 5),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 5), 'MM-dd-yyyy')
          },          {
            day: 'saturday',
            date: dateFns.addDays(sunday, 6),
            totalHours: 0,
            dateFormatted: dateFns.lightFormat(dateFns.addDays(sunday, 6), 'MM-dd-yyyy')
          },

        ]
        console.log('weekInit: ', week)
        return week;
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
          console.log('datefns lightformat()',dateFns.lightFormat(date, 'MM-dd-yyyy'))
          weekDatesKeyFormat.push(dateFns.lightFormat(date, 'MM-dd-yyyy'));
        })
        console.log(weekDatesKeyFormat)
        return shiftData.pipe(
          map((shiftsObject: any) => {
            let shiftsInInterval: any[] = [];
            weekDatesKeyFormat.forEach((dateKey) => {
              // let shiftCopy = JSON.stringify(shiftsObject.dateKey);
              if(shiftsObject[dateKey] !== undefined){
                shiftsInInterval = [...shiftsInInterval ,shiftsObject[dateKey]]
              }

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


