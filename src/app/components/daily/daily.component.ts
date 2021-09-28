import {Component, Inject, OnInit} from '@angular/core';
import * as dateFns from 'date-fns';
import {Observable, of} from "rxjs";
import {MatDialog, MatDialogClose, MatDialogConfig, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {shiftsMock} from "../../data.mock";
@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
  currentFormattedDate: Observable<any>;
  shiftsMock$: Observable<any> = of(shiftsMock);

  constructor(private matDialog: MatDialog) {
    this.currentFormattedDate = of(this.processCurrentDate());
    console.log("current date, processed through dateFns: ", this.currentFormattedDate)
  }

  ngOnInit(): void {
    let timeMock = dateFns.differenceInMinutes(shiftsMock[0].timeOut, shiftsMock[0].timeIn);
    let td = shiftsMock[0].timeIn
    let ft = dateFns.getHours(td)

    console.log("timeMock test", timeMock, dateFns.formatRelative(td, td))
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
    let mdc = new MatDialogConfig()
    mdc.width = '250px';
    mdc.height = '400px';
    mdc.data = this.currentFormattedDate;
    this.matDialog.open(AddToCurrentDayDialog, mdc)
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


