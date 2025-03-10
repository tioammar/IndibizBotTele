var token = "7493229587:AAESypO_AJif5aP30uBfDC-s7Iud119xM7s";
var SheetID = "1npsb3Zp0Ov1f_1QwmN0Sgnn3T4G6E1cdMjkYB12Fa5U";


function doPost(e) {
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);
 
    if(updates.message.text != "/ps"){
      switch(updates.message.text){
        case "/survei":
          var text = "MIE - SEND SURVEY";
          break;
        case "/pi":
          var text = "PROVISIONING ISSUED";
          break;
        case "/kendala":
          var text = "INVALID SURVEY";
          break;
      }
      sendText(updates.message.chat.id,checkOrderByStatus(text)); 
    } else {
      sendText(updates.message.chat.id,checkOrderPS())
    }
}

function getData(){
  var rangeName = 'SULBAGSEL!A2:Y';
  // Ensure that the Sheets API is enabled and you're using the correct method
  var sheet = SpreadsheetApp.openById(SheetID);
  var range = sheet.getRange(rangeName);
  var rows = range.getValues();
  return rows;
}

function getDataYear(data){
  var date = new Date(data);
  var year = date.getFullYear();
  return year;
}

function getDataMonth(data){
  var date = new Date(data);
  var month = date.getMonth()+1;
  return month;
}

function createRowData(data){
  return "Nama: " + data[8] + "\n" +
          "SC: " + data[1] + "\n" + 
          "Umur: " + data[3] + " Hari \n" + 
          "Alamat: " + data[10] + "\n" + 
          "ODP: " + data[9] + "\n" +  
          "Status: " + data[12] + "\n" +  
          "Memo TIF: " + data[13] + "\n" +
          "Memo Teknisi: " + data[15] + "\n" + "\n\n";
}

var orders = "";

function checkOrderByStatus(status){
  var data = getData();

  /* use this to get order by specific date
  var date = Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy");
  */
  var year = new Date().getFullYear();

  for(row=0;row<data.length;row++){
    var dataYear = getDataYear(data[row][2]);
    if(data[row][7]=='GOWA'){
      if(data[row][12]==status && dataYear==year){
        orders = orders + "" + createRowData(data[row]);
      }     
    }
  }
  if(orders == "") return "Order tidak ditemukan"
  return orders;
}

function checkOrderPS(){
  var data = getData();

  /* use this to get order by specific date
  var date = Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy");
  */
  var month = new Date().getMonth()+1;

  for(row=0;row<data.length;row++){
    var dataMonth = getDataMonth(data[row][2]);
    if(data[row][7]=='GOWA'){
      if(data[row][12]=="COMPLETED" && dataMonth==month){
        orders = orders + "" + createRowData(data[row]);
      }     
    }
  }
  if(orders == "") return "Order tidak ditemukan"
  return orders;
}

function sendText(chatid,text,replymarkup){
var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatid),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(replymarkup)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}