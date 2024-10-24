var token = "7493229587:AAESypO_AJif5aP30uBfDC-s7Iud119xM7s";
var SheetID = "1sQwtqeVDatV8IkFXrExRi6wAM82l7ZIu84ZwxmOm1Js";


function doPost(e) {
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);
 
    if(updates.message.text != "/kendala"){
      switch(updates.message.text){
        case "/survei":
          var text = "SURVEI";
          break;
        case "/done":
          var text = "DONE INSTALL";
          break;
        case "/ps":
          var text = "PS";
          break;
        case "/pengajuan":
          var text = "PINDAH GDOCS JT";
          break;
        case "/undist":
          var text = "";
          break;
      }
      sendText(updates.message.chat.id,checkOrderByStatus(text)); 
    } else {
      sendText(updates.message.chat.id,checkOrderKendala())
    }
}

function getData(){
  var rangeName = 'SC-ONE!A2:Y';
  // Ensure that the Sheets API is enabled and you're using the correct method
  var sheet = SpreadsheetApp.openById(SheetID);
  var range = sheet.getRange(rangeName);
  var rows = range.getValues();
  return rows;
}

function getDataMonth(dataMonth){
  var date = new Date(dataMonth);
  var month = date.getMonth()+1;
  return month.toString();
}

function createRowData(data){
  return "Nama: " + data[7] + "\n" +
          "SC: " + data[0] + "\n" + 
          "Segmen: " + data[6] + "\n" + 
          "Alamat: " + data[8] + "\n" + 
          "ODP: " + data[12] + "\n" +  
          "Status: " + data[22] + "\n" +
          "Memo: " + data[24] + "\n" +
          "Tanggal: " + data[20] + "\n\n";
}

var orders = "";

function checkOrderByStatus(status){
  var data = getData();

  /* use this to get order by specific date
  var date = Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy");
  */
  var month = new Date().getMonth()+1;

  for(row=0;row<data.length;row++){
    var dataMonth = getDataMonth(data[row][20]);

    if(data[row][22]==status && dataMonth==month.toString()){
      if(data[row][17]=='SUG' || data[row][17]=='TKA' || data[row][17]=='MAL'){
        orders = orders + "" + createRowData(data[row]);
      }     
    }
  }
  if(orders == "") return "Order tidak ditemukan"
  return orders;
}

function checkOrderKendala(){
  var data = getData();

  /* use this to get order by specific date
  var date = Utilities.formatDate(new Date(), "GMT+8", "dd/MM/yyyy");
  */
  var month = new Date().getMonth()+1;

  for(row=0;row<data.length;row++){
    var dataMonth = getDataMonth(data[row][20]);

    if(data[row][22]=="KENDALA TEKNIK" || data[row][22]=="KENDALA PELANGGAN" && dataMonth==month.toString()){
      if(data[row][17]=='SUG' || data[row][17]=='TKA' || data[row][17]=='MAL'){
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