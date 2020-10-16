import { Component, OnInit } from '@angular/core';
import { env } from 'process';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface googleSheetAPIresponse {
  range:          string;
  majorDimension: string;
  values:         Array<string[]>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecommerce-ably-demo';
  public headerRow: Array<string>;
  public sheetData: Array<string[]>;

  constructor(private http: HttpClient) { }



  // implement OnInit's `ngOnInit` method
  ngOnInit() {
    const url: string = `https://sheets.googleapis.com/v4/spreadsheets/${environment.googleSheetID}/values/Sheet1!A1:D5?key=${environment.googleAPIkey}`;

    this.http.get(url)
      .subscribe(

      (googleAPIresponse: googleSheetAPIresponse) => {
        // check error
        this.sheetData = googleAPIresponse.values;
        this.headerRow = this.sheetData.shift();
        console.log(this.headerRow, this.sheetData);
      },
      error => console.log(error)
    );

  }

}
