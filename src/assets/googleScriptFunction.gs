var numRows = 5; // Header row + number of products
var numCols = 4; // Product name, Product price, Product stock, Image (name of jpeg file available in src/assests folder)
var httpHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": "Basic your_base64encoded_ably_API_key"
};
var httpOptions = {
  "method": "POST",
  "contentType": "application/json",
  "headers": httpHeaders
};
var stockUpdateChannel = "stockUpdate";
var stockUpdateSubchannel = "stockUpdate";
var cellUpdateSubchannel = "cellUpdate";


function onEdit(e){
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var vals = sheet.getRange(1, 1, numRows, numCols).getValues();
  var url = "https://rest.ably.io/channels/" + stockUpdateChannel + "/messages";
  var postData = { "name": cellUpdateSubchannel, "data": { "vals": vals } };
  httpOptions.payload = JSON.stringify(postData);
  UrlFetchApp.fetch(url, httpOptions);
}

function doGet(e) {
 var sheet = SpreadsheetApp.getActive().getActiveSheet();
 var vals = sheet.getRange(1, 1, numRows, numCols).getValues();
 return ContentService.createTextOutput(JSON.stringify(vals)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var data = json.messages[0].data;
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var temp = JSON.parse(data);
  var stockValue = sheet.getRange(temp.row, temp.col).getValue();
  if (stockValue >= 1) {
    stockValue = stockValue - 1;
  }
  sheet.getRange(temp.row, temp.col).setValue(stockValue);
  var url = "https://rest.ably.io/channels/" + stockUpdateChannel + "/messages";
  var postData = { "name": stockUpdateSubchannel, "data": { "row": temp.row, "col": temp.col, "stock": stockValue } };
  httpOptions.payload = JSON.stringify(postData);
  UrlFetchApp.fetch(url, httpOptions);
  return;
}
