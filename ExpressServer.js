const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
var cors = require('cors');

app.use(cors());


let resListInfo = [

	{
		username: 'Smith',
		starttime: '0900',
		startdate: '10-12-19',
		hours: 3
	},

];

let resData = [];

/*
GET API request. Sends the reservation list to the client.
*/
app.get('/reservations', (req, res) => 
{
	console.log("GET RESERVATION LIST REQUEST");
	resListInfo = getResList();
	//console.log(resListInfo);
	res.send(JSON.stringify(resListInfo));
});

/*
GET API request. Sends a specific user reservation to client. Also adds a user to the file.
*/
app.get('/user/:username', (req, res) =>
{
	console.log("GET USER REQUEST");
	let resListInfo = getResList();
	for(i = 0; i < resListInfo.length; i++)
	{
		if(resListInfo[i].username == req.params.username)
		{
			res.send(JSON.stringify(resListInfo[i]));
			break;
		}
		else if(i+1 == resListInfo.length)
		{
			addUser(req.params.username);
			res.send("No user found. User added.");
			break;
		}
		else if(resListInfo.length == 0)
		{
			addUser(req.params.username);
			res.send('No Data. List Created');
			break;
		}
	}

});


/*
POST API request. Updates a users information.
*/
app.post('/reservations/:username/new/startdate=:startdate/starttime=:starttime/hours=:hours', (req, res) => 
{
	/*
	console.log(req.params.username);
	console.log(req.params.startdate);
	console.log(req.params.starttime);
	console.log(req.params.hours);
	*/
	console.log("POST REQUEST");
	for(i = 0; i < resListInfo.length; i++)
	{
		if(resListInfo[i].username == req.params.username)
		{
			resListInfo[i].startdate = req.params.startdate;
			resListInfo[i].starttime = req.params.starttime;
			resListInfo[i].hours = req.params.hours;
			writeResList();						
		}
	}

	res.send('Done');
});


/*
Delete API request. Removes a user from the list.
*/
app.delete('/user/:username/delete', function (req, res) {

	for(i = 0; i < resListInfo.length; i++)
	{
		if(resListInfo[i].username == req.params.username)
		{
			console.log('DELETE REQUEST');
			resListInfo.splice(i,1);
			writeResList();

		}
	}
});

app.listen(port, () => console.log(`Skateboard Reservation app listening on port ${port}!`));

/*
Returns file data and stores it to resListInfo
*/
function getResList()
{
	if(fs.existsSync('reservations.json'))
	{
		resData = fs.readFileSync('reservations.json');

	}
	else
	{
		writeResList();
		resData = fs.readFileSync('reservations.json');
	}

	resListInfo = JSON.parse(resData);
	//console.log(`Reservation: ${JSON.stringify(resListInfo)}`);
	return resListInfo;

}

/*
Sorts then writes the list to file
*/
function writeResList()
{
	sortList();
	fs.writeFileSync('reservations.json', JSON.stringify(resListInfo, null, 4), err =>
	{
		if (err) throw err;
		console.log('Saved File');
	});
}

/*
Adds a user to list
*/
function addUser(userid)
{
	let user = {

		username: userid,
		startdate: 'none',
		starttime: '2400',
		hours: 0

	};

	resListInfo.push(user);
	writeResList();
}

/*
List sort via starttime
*/
function sortList()
{
	resListInfo.sort(function(a, b){
		return a.starttime-b.starttime;
	});
}