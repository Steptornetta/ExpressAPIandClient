let rowcounter = 0; // needed to keep track of how many rows are created in the Reservation List


/*
Gets the entire reservation list and formats into a HTML table.
*/
function getReservationList()
{
	let request = new XMLHttpRequest();

	request.open("GET", "http://127.0.0.1:3000/reservations", true);

	removeResList();	

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
				resuserrow.setAttribute("id", "reslistrow");
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

			rowcounter = data.length;
			
		}
	}

	request.send();
}


/*
Gets a individual reservation from our server response. Also allows the user's parameters to be changed or deleted.
*/
function getReservation()
{
	let username = document.querySelector("#username").value;

	let request = new XMLHttpRequest();

	request.open("GET", "http://127.0.0.1:3000/user/"+ username, true);

	removeResList();	

	request.onload = function()
	{

		if(request.status == 200)
		{
			console.log(this.response);

			// catch the case if a user is not stored. Automatically add the user.
			if (this.response == "No user found. User added.") 
			{
				rowcounter++;
				let errorrow = document.createElement("tr");
				let errormessage = document.createTextNode(this.response);
				errorrow.setAttribute("id", "errorrow");
				errorrow.appendChild(errormessage);
				document.querySelector("#welcometable").appendChild(errorrow);
			}

			else
			{
				let data = JSON.parse(this.response);

				let resuserrow = document.createElement("tr");
				resuserrow.setAttribute("id", "reuserrow");
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
				
				// create a HTML table that allows our user to update parameters of a user
				let updatetable = document.createElement("table");
				updatetable.setAttribute("id", "updatetable")
				updatetable.setAttribute("width", "100%")
				let updateheader = document.createElement("th");
				updateheader.style.backgroundColor = "Pink";
				let updateheaderinfo = document.createTextNode("Update Info");

				updateheader.appendChild(updateheaderinfo);

				let newrow = document.createElement("tr");

				let newstartdate = document.createElement("INPUT");
				newstartdate.setAttribute("type", "text");
				newstartdate.setAttribute("id", "startdate");
				newstartdate.value = data.startdate;

				let newstarttime = document.createElement("INPUT");
				newstarttime.setAttribute("type", "text");
				newstarttime.setAttribute("id", "starttime");

				newstarttime.value = data.starttime;

				let newhours = document.createElement("INPUT");
				newhours.setAttribute("type", "text");
				newhours.setAttribute("id", "hours");

				newhours.value = data.hours;

				let updatebutton = document.createElement("INPUT"); //creates our update button
				updatebutton.setAttribute("type", "button");
				updatebutton.value = "Update";
				updatebutton.onclick = updateUser;

				let deletebutton = document.createElement("INPUT"); // creates our delete button
				deletebutton.setAttribute("type", "button");
				deletebutton.value = "Delete";
				deletebutton.onclick = removeUser;

				newrow.appendChild(newstartdate);
				newrow.appendChild(newstarttime);
				newrow.appendChild(newhours);
				newrow.appendChild(updatebutton);
				newrow.appendChild(deletebutton);

				document.querySelector("#welcometable").appendChild(updatetable);
				document.querySelector("#updatetable").appendChild(updateheader);
				document.querySelector("#updatetable").appendChild(newrow);

				rowcounter = data.length;			

			}

		}
	}

	request.send();

}

/*
Updating parameters of a User and sending it to the server via URL
*/
function updateUser()
{	
	let username = document.querySelector("#username").value;
	let newstartdate = document.querySelector("#startdate").value;
	let teststartdate = '';
	let newstarttime = document.querySelector("#starttime").value;
	let newhours = document.querySelector("#hours").value;
	let x = 0;

	removeResList();

	/*
	This for loop handles the case if our user enters in a '/'. This causes routing issues so we essentially convert '/' -> '-'
	*/
	for(let i = 0; i < newstartdate.length; i++)
	{
		console.log(i)
		if(newstartdate.charAt(i) == '/')
		{

			teststartdate = teststartdate + newstartdate.substring(x, i) + '-';
			console.log(teststartdate);
			x = i+1;
		}
		if(i+1 == newstartdate.length && teststartdate != '')
		{
			teststartdate = teststartdate + newstartdate.substring(i-1, newstartdate.length);
			newstartdate = teststartdate;
		}
	}

	let request = new XMLHttpRequest();

	request.open("POST", "http://127.0.0.1:3000/reservations/" + username +
	 "/new/startdate=" + newstartdate + "/starttime=" + newstarttime +
	  "/hours=" + newhours);

	request.onload = function()
	{
		console.log(request.status);
		if(request.status == 200)
		{
		}
	}

	request.send();
}

/*
Delete method. Sending the username of the user to the server via URL 
*/
function removeUser()
{
	let username = document.querySelector("#username").value;

	removeResList();

	let request = new XMLHttpRequest();

	request.open("DELETE", "http://127.0.0.1:3000/user/"+ username + "/delete", true);

	request.onload = function()
	{
		console.log(request.status);
		if(request.status == 200)
		{
		}
	}

	request.send();

}

/*
Reformating the HTML elements if a edit has been submitted.
*/
function removeResList()
{
	for(i = 0; i < rowcounter; i++)
	{
		console.log("Counter " + rowcounter);
		let tempcheckrow = document.querySelector("#reslistrow");
		if(tempcheckrow == null)
		{
			break;
		}
		console.log(i)
		tempcheckrow.remove();
	}	

	let checkupdatetable = document.querySelector("#updatetable");
	if(checkupdatetable != null)
	{
		checkupdatetable.remove();
	}
		
	let checkwelcomerow = document.querySelector("#reuserrow");	
	if(checkwelcomerow!= null)
	{
		checkwelcomerow.remove();
	}
		
	let checkerrorrow = document.querySelector("#errorrow");
	if(checkerrorrow != null)
	{
		checkerrorrow.remove();
	}	
}
