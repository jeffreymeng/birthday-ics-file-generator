import {createEvents, DateArray} from "ics";
import {writeFileSync} from 'fs';

// this script very much follows the Pareto principle
// it was written with 20% of the effort to achieve 80% of the result, but has some issues
// namely, duplicates are not handled well

const birthdays: {
	title: string;
	start: DateArray;
	end: DateArray;
	recurrenceRule: string;
}[] = ( // this string should be tab-seperated name, year, pronouns, email, and birthday
		// (the easy way to do this is to just select the rows from the spreadsheet and copy it)
`Example	2027	he/him	example@uci.edu	4/10/2005
Example2	2027	he/him	example@uci.edu	12/21/2002`
	)
	.split("\n")
	.map(row => row.split("\t"))
	.map(row => ({name: row[0], birthday: new Date(row[4])}))
	.map(({name, birthday}) => ({
		name, 
		birthday: [new Date().getFullYear(), birthday.getMonth() + 1, birthday.getDate()] as DateArray
	}))
	.map(({name, birthday}) => ({
		title: `${name}'s Birthday`,
	    start: birthday,
	    end: [birthday[0], birthday[1], birthday[2] + 1],
	    recurrenceRule: `FREQ=YEARLY;BYMONTH=${birthday[1]};BYMONTHDAY=${birthday[2]};COUNT=4`
	}));
const {error, value} = createEvents(birthdays);
if (error) {
	console.log(error);
} else if (value) {
	writeFileSync("birthdays.ics", value);
}
