let fs = require('fs');

// const reservation = {
// 	name: 'Smith',
// 	time: '0900',
// 	num: 4
// };

let resList = [
	{
		name: 'Smith',
		time: '0900',
		num: 4
	},
	{
		name: 'Jones',
		time: '1200',
		num: 2
	}
]

let rimlandRes = {
	name: 'Rimland',
	time: '1400',
	num: '5'
}

resList.push(rimlandRes);

resList.splice(1, 1);

fs.writeFile('res1.json', JSON.stringify(resList), err =>
{
	if (err) throw err;
	console.log('Saved File');
});

fs.readFile('res1.json', (err, data) => {
	if (err) throw err;
	let resList = JSON.parse(data);

	resList[0].time = '1955';

	let resListInfo = JSON.stringify(resList);
	console.log(`Reservation: ${resListInfo}`);

});