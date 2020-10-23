import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Realtime } from 'ably';

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
  private rtChannelPurchase: any;
  private rtChannelStockUpdate: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const url: string = `https://sheets.googleapis.com/v4/spreadsheets/${environment.googleSheetID}/values/Sheet1!A1:D${environment.numRows}?key=${environment.googleAPIkey}`;

    this.http.get(url)
      .subscribe(
        (googleAPIresponse: googleSheetAPIresponse) => {
          if (!googleAPIresponse.values) return;
          this.sheetData = googleAPIresponse.values;
          this.headerRow = this.sheetData.shift();
          console.log(this.headerRow, this.sheetData);
        },
        error => console.log(error)
    );

    var ably = new Realtime(environment.ablyAPIkey);
    // channel for sending the information that user wants to buy a product
    this.rtChannelPurchase = ably.channels.get('purchase');
    // channel for receiving the information from the stock sheet about available stock and cell updates
    this.rtChannelStockUpdate = ably.channels.get('stockUpdate');

    this.rtChannelStockUpdate.subscribe('cellUpdate', (message: { data: any; }) => {
      let sheetData = message.data.vals;
      for (let i = 0; i < sheetData.length; i++) {
        sheetData[i] = sheetData[i].map(String);
      }
      this.sheetData = sheetData;
      this.headerRow = this.sheetData.shift();
    });

    this.rtChannelStockUpdate.subscribe('stockUpdate', (message: { data: any; }) => {
      // conversion from google sheets (starts with 1) indexing to javascript indexing (starts with 0) and another -1 because data from google sheets still includes header row
      const row = message.data.row - 2;
      // conversion from google sheets (starts with 1) indexing to javascript indexing (starts with 0)
      const col = message.data.col - 1;
      const stock = message.data.stock.toString();
      this.sheetData[row][col] = stock;
    });

  }

  onButtonClick(index: number) {
    const stockIndex : number = this.headerRow.indexOf('Product stock');
    if (stockIndex === -1) return;
    // conversion from javascript indexing (starts with 0) to google sheets (starts with 1) indexing
    const col : number = stockIndex + 1;
    // conversion from javascript indexing (starts with 0) to google sheets (starts with 1) indexing and another +1 because data in google sheets includes header row
    const row : number = index + 2;
    this.rtChannelPurchase.publish('purchase', { row: row , col: col } );
  }

}
