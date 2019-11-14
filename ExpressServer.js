const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let resListInfo= [

	{
		username: 'Smith',
		startdate: '10/12/19',
		starttime: '0900',
		hours: 4
	},

];

let resData = [];

/*
CORS Error workaround. We can set our server to allow origin control from any souce.
*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => 
{
	res.send("HomePage");
});

app.get('/reservations', (req, res) => 
{
	tempResList = getResList();
	//console.log(JSON.stringify(tempResList))
	res.send(JSON.stringify(tempResList));
});

app.get('/user/:username', (req, res) =>
{
	let tempResList = getResList();
	//console.log(JSON.stringify(tempResList))
	for(i = 0; i < tempResList.length; i++)
	{
		if(tempResList[i].username == req.params.username)
		{
			res.send(JSON.stringify(tempResList[i]));
			break;
		}
		else if(i+1 == tempResList.length)
		{
			addUser(req.params.username);
			res.send("No user found. User added.");
			break;
		}
		else if(tempResList.length == 0)
		{
			addUser(req.params.username);
		}
	}

});

app.post('/reservations/new', (req, res) => 
{
	res.send('');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


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
	//resListInfo = JSON.stringify(resListInfo);
	console.log(`Reservation: ${JSON.stringify(resListInfo)}`);
	return resListInfo;

}

function writeResList()
{
	fs.writeFile('reservations.json', JSON.stringify(resListInfo), err =>
	{
		if (err) throw err;
		console.log('Saved File');
	});
}

function addUser(userid)
{
	let user = {
	
		username: userid,
		startdate: 'none',
		starttime: 'none',
		hours: 0

	};

	resListInfo.push(user);

	writeResList();
}

