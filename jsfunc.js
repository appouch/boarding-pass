var myAccount = "1";
var myPassword = "1";
var enterTimes = 0;

var xhr = new XMLHttpRequest();
//var url = "http://172.22.41.63/Pigeon/MA/00_Demo/R0.2/BoardingPass/Server/index.php";   
var url = "http://api.Pass2.kuopo.twbbs.org/index.php";
var passengerName = "";

// set dynamic CSS style of some elements
function setContentSize()
{
    var headerWidth = document.getElementById("header").offsetWidth;
    var headerHeight = document.getElementById("header").offsetHeight;

    var sheet = document.createElement('style');
    var width = (screen.width / screen.width) * 100;
    var height = ((screen.height - headerHeight)/screen.height) * 100;
    sheet.innerHTML = "#content {width: " + width + "%; height:" + height + "%; margin: 5px auto 5px auto; background: #3BB9FF; overflow: hidden; font-size:12px;}";            
    document.head.appendChild(sheet);
}

// remove CSS class
function removeClass(id)
{
    document.getElementById(id).className = "";
}

// get query string from url
function queryString(name) 
{
	var AllVars = window.location.search.substring(1);
	var Vars = AllVars.split("&");
	for (i = 0; i < Vars.length; i++)
	{
		var Var = Vars[i].split("=");
		if (Var[0] == name) 
            return decodeURI(Var[1]);
	}
	return "";
}

// -------------------------------------
// query server side for passenger's info
// -------------------------------------

function queryServer()
{   
    var qs = '?passengerName=' + passengerName;
    
    if(xhr)
    {
        xhr.open("GET", url+qs, true);
//        xhr.send();
        xhr.onreadystatechange = queryServerHandler;
        xhr.send();
    }
    else
    {
        alert("no xhr took place at all");
    }
}

function queryServerHandler(evtXHR)
{
    if (xhr.readyState == 4)
    {
        if (xhr.status == 200)
        {
            var response = xhr.responseText;
            console.log(response);
            response = JSON.parse(response);
            parseServerResp(response);
        }
        else
        {
            alert("xhr Errors Occured " + xhr.readyState + " and the status is " + xhr.status);
        }
    }
    else
    {
        //console.log("currently the application is at" + xhr.readyState);
    }
} 

// parse response from server side
function parseServerResp(response)
{
    if (!response['error'] || response['name'] != passengerName)
    {
        document.getElementById("labelName").innerHTML = response['name'];
        document.getElementById("labelDate").innerHTML = response['date'];
        document.getElementById("labelFlight").innerHTML = response['flight'];
        document.getElementById("labelSeat").innerHTML = response['seat'];
        document.getElementById("labelBoardingGate").innerHTML = response['gate'];
        document.getElementById("labelBoardingTime").innerHTML = response['boardingTime'];

        if ((document.getElementById("labelName").innerHTML != response['name']) && (document.getElementById("labelName").innerHTML != ""))
        {
            document.getElementById("labelName").className = "emphasis";
            setTimeout('removeClass("labelName")', 5000);
        }

        if ((document.getElementById("labelDate").innerHTML != response['date']) && (document.getElementById("labelDate").innerHTML != ""))
        {
            document.getElementById("labelDate").className = "emphasis";
            setTimeout('removeClass("labelDate")', 5000);
        }
        
        if ((document.getElementById("labelFlight").innerHTML != response['flight']) && (document.getElementById("labelFlight").innerHTML != ""))
        {
            document.getElementById("labelFlight").className = "emphasis";
            setTimeout('removeClass("labelFlight")', 5000);
        }

        if ((document.getElementById("labelSeat").innerHTML != response['seat']) && (document.getElementById("labelSeat").innerHTML != ""))
        {
            document.getElementById("labelSeat").className = "emphasis";
            setTimeout('removeClass("labelSeat")', 5000);
        }        

        if ((document.getElementById("labelBoardingGate").innerHTML != response['gate']) && (document.getElementById("labelBoardingGate").innerHTML != ""))
        {
            document.getElementById("labelBoardingGate").className = "emphasis";
            setTimeout('removeClass("labelBoardingGate")', 5000);
        }

        if ((document.getElementById("labelBoardingTime").innerHTML != response['boardingTime']) && (document.getElementById("labelBoardingTime").innerHTML != ""))
        {
            document.getElementById("labelBoardingTime").className = "emphasis";
            setTimeout('removeClass("labelBoardingTime")', 5000);
        }
        
        genQRcode(240, 240, encodeURI(JSON.stringify(response)));
    }
    else
    {
        alert(response['error'] + " - [" + response['name'] + "]");
    }
}

// generate qrcode 
function genQRcode(width, height, content)
{    
    var qrcodeImg = 'http://chart.apis.google.com/chart?cht=qr&chl=' + content + '&chs=' + width + 'x' + height;
    document.getElementById('qrcode').innerHTML = '<img src="' + qrcodeImg + '" />';
}

// -------------------------------------
// msghub callback handler
// -------------------------------------
function messaging_cb(channel, msg)
{
    enterTimes += 1;
    document.getElementById("message").innerHTML = "enter messaging_cb ("+ enterTimes +") <br />" + msg;
    queryServer();
}


// -------------------------------------
// main
// -------------------------------------
function onloadBody()
{
    passengerName = queryString("passengerName");
    
    setContentSize();
    queryServer();
    
    //subscribe('demo_pass', messaging_cb);
    //document.getElementById("message").innerHTML = "sub ch demo_pass successfully!";
    
    /*
    ret = pigeon.subscribeChannel('demo_pass', "messaging_cb");
    if (ret.search("200") == -1)
        alert("subscribeChannel Error: " + ret);
    else
        document.getElementById("message").innerHTML = "sub ch demo_pass successfully!";
        */
}
