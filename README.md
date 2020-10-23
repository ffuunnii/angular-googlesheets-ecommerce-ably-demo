# E-commerce Ably Demo with Angular

> E-commerce site with prices generated in realtime via Google sheets  

Simble web application that use Angular frontend to show products with option to buy them. Google sheet plays a role of the database. Thanks to [Ably](https://www.ably.io/) javascript library, Ably Reactor and Ably REST API calls it is possible to build realtime application with the stock within few hours.

# Setup

## Google sheet, google script and Ably Reactor:

&nbsp;  

| Product name | Product price | Product stock | Image |
|-|-|-|-|
| Chair | 25$ | 1 | chair.jpg |
| Console | 100$ | 3 | console.jpg |
| Headphones | 50$ | 14 | headphones.jpg |
| Shoes | 2$ | 0 | shoes.jpg |


&nbsp;  

&nbsp;1. Create empty google sheet and insert your stock data (example above)  
&nbsp;2. Click Tools > Script editor > Paste code from [googleScriptFunction.gs](/src/assets/googleScriptFunction.gs)  
&nbsp;3. Click Publish > Deploy as web app... >  
&nbsp;4. Copy Curent **web app URL** in format:&nbsp; `https://script.google.com/macros/s/id/exec`  
&nbsp;5. Choose Execute the app as:&nbsp; `Me (youremail@gmail.com)`   
&nbsp;6. Choose Who has access to the app:&nbsp; `Anyone, even anonymous`  
&nbsp;7. Click update  
&nbsp;8. Click Edit > Current project's triggers  
&nbsp;9. Click Add Trigger > In the form choose&nbsp;`onEdit, Head, From spreadsheet, On Edit` and click Save
&nbsp;10. Open [ably.io](https://www.ably.io/) and navigate to the dashboard, choose your application and open Reactor tab  
&nbsp;11. Click New Reactor Rule, Choose *Reactor Event*, Choose *Webhook*, Paste the google **web app URL** into URL, paste `Content-Type:application/json` into Headers, choose Message as Source, type in *purchase* as Channel Filter and click Create  

&nbsp;  

## Client environment setup:

&nbsp;1. Open [Google Console](https://console.developers.google.com/apis/credentials) and copy existing API key, or create new one with `+ CREATE CREDENTIALS`  
&nbsp;2. Paste the key into [environment.ts](/src/environments/environment.ts) file as `googleAPIkey`  
&nbsp;3. In the google sheet with your stock click File > Publish to the web  
&nbsp;4. Copy Google Sheet ID from URL of the sheet `https://docs.google.com/spreadsheets/d/**googleSheetID**`  
&nbsp;5. Paste the key into [environment.ts](/src/environments/environment.ts) file as `googleSheetID`  
&nbsp;6.  At [ably.io](https://www.ably.io/) navigate to the Dashboard, choose the application you want to use, or create new  
&nbsp;7. Open your application and choose API Keys tab, copy API key  
&nbsp;8. Paste the key into [environment.ts](/src/environments/environment.ts) file as `ablyAPIkey`  

&nbsp;  

## Run application:


&nbsp;1. `npm install`  
&nbsp;2. `ng serve --ssl true`  
&nbsp;3. Click Buy on a product, or change the values in the google sheet and enjoy realtime updates  

&nbsp;  

## Flow diagram:
&nbsp;  
# ![Flow diagramo](/src/assets/flowdiagram.png "Flow diagram")

## Example:
&nbsp;  
# ![Flow diagramo](/src/assets/example.gif "Example")

# Versions

| Date | 2020/10/23 |
| ------ | ------ |
| NodeJS | 14.14 |
| Angular | 10.1.6 |
| npm | 6.14.8 |
| Ably | 1.2.3 |

