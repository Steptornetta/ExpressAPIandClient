function getReservationList()
{
	let request = new XMLHttpRequest();

	request.open("GET", "http://127.0.0.1:3000/reservations", true);

	request.onload = function()
	{
		console.log(request.status);
		if(request.status == 200)
		{
			console.log(this.response);
			let data = JSON.parse(this.response);
			//let newdata = JSON.stringify(data[0].username);
			//console.log("CAT " + newdata);
			for(i = 0; i < data.length; i++)
			{
				let resuserrow = document.createElement("tr");
				let resusername = document.createTextNode(data[i].username);

				let resstartdate = document.createElement("td");
				let resstartdateinfo = document.createTextNode(data[i].startdate);

				let resstarttime = document.createElement("td");
				let resstarttimeinfo = document.createTextNode(data[i].starttime);

				let reshours = document.createElement("td");
				let reshoursinfo = document.createTextNode(data[i].hours);

				resuserrow.appendChild(resusername);
				resstartdate.appendChild(resstartdateinfo);
				resstarttime.appendChild(resstarttimeinfo);
				reshours.appendChild(reshoursinfo);

				resuserrow.appendChild(resusername);
				resuserrow.appendChild(resstartdate);
				resuserrow.appendChild(resstarttime);
				resuserrow.appendChild(reshours);

				document.querySelector("#reservationtable").appendChild(resuserrow);

			}
			
		}
	}

	request.send();
}

function getReservation()
{
	let username = document.querySelector("#username").value;

	let request = new XMLHttpRequest();

	request.open("GET", "http://127.0.0.1:3000/user/"+ username, true);
	

	request.onload = function()
	{

		if(request.status == 200)
		{
			console.log(this.response);
			if (this.response == "No user found. User added.") 
			{
				let errorrow = document.createElement("tr");
				let errormessage = document.createTextNode(this.response);
				errorrow.appendChild(errormessage);
				document.querySelector("#welcometable").appendChild(errorrow);
			}

			else
			{
				let data = JSON.parse(this.response);

				let resuserrow = document.createElement("tr");
				let resusername = document.createTextNode(data.username);

				let resstartdate = document.createElement("td");
				let resstartdateinfo = document.createTextNode(data.startdate);

				let resstarttime = document.createElement("td");
				let resstarttimeinfo = document.createTextNode(data.starttime);

				let reshours = document.createElement("td");
				let reshoursinfo = document.createTextNode(data.hours);

				resuserrow.appendChild(resusername);
				resstartdate.appendChild(resstartdateinfo);
				resstarttime.appendChild(resstarttimeinfo);
				reshours.appendChild(reshoursinfo);

				resuserrow.appendChild(resusername);
				resuserrow.appendChild(resstartdate);
				resuserrow.appendChild(resstarttime);
				resuserrow.appendChild(reshours);

				document.querySelector("#welcometable").appendChild(resuserrow);
			}			
		}
	}

	request.send();



}