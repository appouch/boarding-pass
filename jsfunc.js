document.write('<script type="text/javascript" src="cordova-2.5.0.js"></script>');
document.write('<script type="text/javascript" src="pigeon-0.4.js"></script>');

var g_account = "1";
var g_password = "1";

var g_name = null;
var pigeonEnable = true;

var enterTimes = 0;
var subChannel = false;	// true to indicate subchannel ok

var CODE = 
{
	GATE: 1,
	TIME: 2,
	DATE: 4,
	FLIGHT: 8,
	SEAT: 16,
	QRCODE: 32,
	END: 64
};

var currentStatus = 0;	// current get kv status

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

// get query string from url
function queryString(key) 
{
	var AllVars = window.location.search.substring(1);
	var Vars = AllVars.split("&");

	for (i = 0; i < Vars.length; i++)
	{
		var Var = Vars[i].split("=");
		if (Var[0] == key)
            return decodeURI(Var[1]);
	}
	return "";
}

function removeClass(id)
{
    document.getElementById(id).className = "";
}


// ------------------------------
// get key value
// ------------------------------

function getKeyValue()
{    
    if (pigeonEnable)
    {
		if (!(currentStatus & CODE.GATE))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"BoardingGate");
		else if (!(currentStatus & CODE.TIME))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"BoardingTime");
		else if (!(currentStatus & CODE.DATE))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"Date");
		else if (!(currentStatus & CODE.FLIGHT))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"Flight");
		else if (!(currentStatus & CODE.SEAT))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"Seat");		
		else if (!(currentStatus & CODE.QRCODE))
			pigeon.getKeyValue(parseRespFromServer, getkv_error_cb, g_account, g_password, g_name+"QRcode");
    }

    else 
    {
		var resp = {"mValues":
					{
						"Account":"1",
						"Status":"Success",
						"Value":"no25",
						"Key":"MaryBoardingGate",
						"Action":"removeKeyValue" 
					}
				};
				
        if (!(currentStatus & CODE.GATE))
		{
			resp["mValues"]["Key"] = g_name+"BoardingGate";
			resp["mValues"]["Value"] = "no22";
            //parseRespFromServer("no22");
		}
        else if (!(currentStatus & CODE.TIME))
		{
			resp["mValues"]["Key"] = g_name+"BoardingTime";
			resp["mValues"]["Value"] = "12:40";
            //parseRespFromServer("12:40");
		}
        else if (!(currentStatus & CODE.DATE))
		{
			resp["mValues"]["Key"] = g_name+"Date";
			resp["mValues"]["Value"] = "04/16/13";
            //parseRespFromServer("09/29/12");
		}
        else if (!(currentStatus & CODE.FLIGHT))
		{
			resp["mValues"]["Key"] = g_name+"Flight";
			resp["mValues"]["Value"] = "GH7812";
			//parseRespFromServer("GH7812");
		}
        else if (!(currentStatus & CODE.SEAT))
		{
			resp["mValues"]["Key"] = g_name+"Seat";
			resp["mValues"]["Value"] = "E 24";
            //parseRespFromServer("E 24");
		}
        else if (!(currentStatus & CODE.QRCODE))
		{
			resp["mValues"]["Key"] = g_name+"QRcode";
			resp["mValues"]["Value"] = "http://Pass4.pigeonaws.tk/Pigeon/cpspStorage/QRcode.png";
            //parseRespFromServer("http://172.22.41.63/Pigeon/cpspStorage/QRcode.png");
		}
        else
        {
            alert("invalid key");
			getkv_error_cb("failed getting kv");
        }
		parseRespFromServer(resp);
    }
}

function parseRespFromServer(ret)
{
	if (pigeonEnable)
		ret = eval('(' + ret + ')');
	var key = ret["mValues"]["Key"];
	var value = ret["mValues"]["Value"];
	
	switch (key)
	{
		case g_name+"BoardingGate":
			currentStatus += CODE.GATE;
			if ((document.getElementById("label_boardingGate").innerHTML != value) && (document.getElementById("label_boardingGate").innerHTML != ""))
			{
				document.getElementById("label_boardingGate").className = "emphasis";
				setTimeout('removeClass("label_boardingGate")', 5000);
			}
			document.getElementById("label_boardingGate").innerHTML = value;
			break;
		case g_name+"BoardingTime":
			currentStatus += CODE.TIME;
			if ((document.getElementById("label_boardingTime").innerHTML != value) && (document.getElementById("label_boardingTime").innerHTML != ""))
			{
				document.getElementById("label_boardingTime").className = "emphasis";
				setTimeout('removeClass("label_boardingTime")', 5000);
			}			
			document.getElementById("label_boardingTime").innerHTML = value;
			break;
		case g_name+"Date":
			currentStatus += CODE.DATE;
			if ((document.getElementById("label_date").innerHTML != value) && (document.getElementById("label_date").innerHTML != ""))
			{
				document.getElementById("label_date").className = "emphasis";
				setTimeout('removeClass("label_date")', 5000);
			}			
			document.getElementById("label_date").innerHTML = value;
			break;
		case g_name+"Flight":
			currentStatus += CODE.FLIGHT;
			if ((document.getElementById("label_flight").innerHTML != value) && (document.getElementById("label_flight").innerHTML != ""))
			{
				document.getElementById("label_flight").className = "emphasis";
				setTimeout('removeClass("label_flight")', 5000);
			}				
			document.getElementById("label_flight").innerHTML = value;
			break;
		case g_name+"Seat":
			currentStatus += CODE.SEAT;
			if ((document.getElementById("label_seat").innerHTML != value) && (document.getElementById("label_seat").innerHTML != ""))
			{
				document.getElementById("label_seat").className = "emphasis";
				setTimeout('removeClass("label_seat")', 5000);
			}				
			document.getElementById("label_seat").innerHTML = value;
			break;
		case g_name+"QRcode":
			currentStatus += CODE.QRCODE;
			document.getElementById("div_qrcode").innerHTML = "<img src='"+value+"' />";
			break;
		default:
			alert("invalid key in server resp " + key);
			break
	}
	if (!(currentStatus == (CODE.END - 1)))
		setTimeout("getKeyValue();", 100);
	else if (!subChannel)
		pigeon.subscribeChannel(messaging_success_cb, messaging_error_cb, "demo_pass", messaging_cb);
}


function getkv_error_cb(ret)
{
	alert(ret);
}

// ------------------------------
// msghub
// ------------------------------

function messaging_cb(channel, msg)
{
    enterTimes += 1;
    document.getElementById("message").innerHTML = "enter messaging_cb ("+ enterTimes +") <br />";
	
	currentStatus = 0;
	getKeyValue();
}

function messaging_success_cb(ret)
{
	subChannel = true;
}

function messaging_error_cb(ret)
{
	alert(ret);
}

function onloadBody()
{   
    setContentSize();
	g_name = queryString("name");
	document.getElementById("label_name").innerHTML = g_name;
	
	if (pigeonEnable)
		document.addEventListener("deviceready", onDeviceReady, false);
	else
		getKeyValue();
}

function onDeviceReady()
{
    getKeyValue();
}
