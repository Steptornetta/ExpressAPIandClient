const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
var cors = require('cors');

app.use(cors());

let resListInfo = [];
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
PUT API request. Updates a users information.
*/
app.put('/reservations/:username/new/startdate=:startdate/starttime=:starttime/hours=:hours', (req, res) => 
{
	/*
	console.log(req.params.username);
	console.log(req.params.startdate);
	console.log(req.params.starttime);
	console.log(req.params.hours);
	*/
	resListInfo = getResList();

	console.log("PUT REQUEST");
	for(i = 0; i < resListInfo.length; i++)
	{
		if(resListInfo[i].username == req.params.username)
		{
			resListInfo[i].startdate = req.params.startdate;
			resListInfo[i].starttime = req.params.starttime;
			resListInfo[i].hours = req.params.hours;
			writeResList();	
			res.send('Done');
			break;

		}
	}
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
		// I used Smith as a placeholder first entry if a new file needs to be created. 
		let mydate = new Date();
		mydate = mydate.getFullYear() + "-" + mydate.getMonth() + "-" + mydate.getDay();
		resListInfo = [

			{
				username: 'Smith',
				startdate: mydate,
				starttime: '0700',
				hours: 3
			},

		];		
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
	sortList(); //Definitely a hard choice to decide where/when to sort. This option probably puts alot of strain on the server, but works fine for this case.
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
	let newdate = new Date();
	newdate = newdate.getFullYear() + "-" + newdate.getMonth() + "-" + newdate.getDay();
	let user = {

		username: userid,
		startdate: newdate,
		starttime: "2400",
		hours: 0

	};

	resListInfo.push(user);
	writeResList();
}

/*
List sort via starttime && startdate. It took me a while to figure out a good way to do this because I was storing dates as "12-12-12" and sorting dates is challenging because it
	is not just a number compare. I settled with splicing each component into a variable and created two new Date objects. I then added them to a array and leveraged the comparability
	of the two objects via a sort. Finally, if the dates are equal, we do a much more simple sort via time. Objects are sorted in ascending order.
*/
function sortList()
{

	resListInfo.sort(function(a,b)
	{
		let testdatea = a.startdate;
		let ayear = '';
		let amonth = '';
		let aday = '';

		let testdateb = b.startdate;
		let byear = '';
		let bmonth = '';
		let bday = '';

		ayear = a.startdate.split("-", 1);
		testdatea = testdatea.replace(ayear+ "-", "");

		amonth = testdatea.split("-", 1);
		testdatea = testdatea.replace(amonth+ "-", "");

		aday = testdatea;

		testdatea = new Date(ayear, amonth, aday);

		//console.log(testdatea);
		//console.log("A: YEAR " + ayear + "MONTH " + amonth + "DAY " + aday)

		byear = b.startdate.split("-", 1);
		testdateb = testdateb.replace(byear+ "-", "");

		bmonth = testdateb.split("-", 1);
		testdateb = testdateb.replace(bmonth+ "-", "");

		bday = testdateb;

		testdateb = new Date(byear, bmonth, bday);

		//console.log(testdateb)
		//console.log("B: YEAR " + byear + "MONTH " + bmonth + "DAY " + bday)

		let datearray = [testdatea, testdateb]
		let datecompare = 0;

		datearray.sort(function(a,b)
		{
			datecompare = b-a
			return b-a
		});

		if(datecompare < 0 )
		{
			return 1;	
		}
		if(datecompare > 0)
		{
			return -1;
		}
		else //need to account for time if the two dates are equal
		{
			if(a.starttime - b.starttime < 0)
			{
				return -1;
			}
			if(a.starttime - b.starttime > 0)
			{
				return 1;
			}
			else
			{
				return 0;
			}

		}
	});
}