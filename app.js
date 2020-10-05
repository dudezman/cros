var resultContainer = document.getElementById('qr-reader-results');
var lastResult, countResults = 0;

function onScanSuccess(qrCodeMessage) {
  if (qrCodeMessage !== lastResult) {
    ++countResults;
    lastResult = qrCodeMessage;
    resultContainer.innerHTML += `<div>[${countResults}] - ${qrCodeMessage}</div>`;
  }
}

var html5QrcodeScanner = new Html5QrcodeScanner(
  "qr-reader", {
    fps: 10,
    qrbox: 250
  });
html5QrcodeScanner.render(onScanSuccess);

// Client ID and API key from the Developer Console
var CLIENT_ID = '';
var API_KEY = '';
var spreadsheetId = '';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var goOutButton = document.getElementById('goout');
var getInButton = document.getElementById('getin');
var mainUI = document.getElementById('main-ui');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    getInButton.onclick = handleGetIn;
    goOutButton.onclick = handleGoOut;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    mainUI.style.display = 'block';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    mainUI.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
function datetime(){
    var currentdate = new Date(); 
    var dt =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                return dt;
}
function handleGetIn(event){
    var data = lastResult.split(',');
    data.push('going in')
    data.push(datetime());
    console.log(data);
    listMajors(data);
}

function handleGoOut(event){
    var data = lastResult.split(',');
    data.push('going out')
    data.push(datetime());
    console.log(data);
    listMajors(data);
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('qr-reader-results');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(data) {

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range:'Sheet1!A1:E1',
        valueInputOption:"USER_ENTERED",
        values: [data]
     }).then((response) => {
       var result = response.result;
       console.log(`${result.updates.updatedCells} cells appended.`)
     });

}
