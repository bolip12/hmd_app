import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const dateFilterFormat = (value) => {
	let result = '';
	if(value) {
		let date = new Date(value);

	    //date
	    const dateFormat = '0'+date.getDate();
	    const dateNum = dateFormat.substr(-2);

	    //month
	    const monthFormat = '0'+(date.getMonth()+1);
	    const monthNum = monthFormat.substr(-2);

	    //year
	    const yearNum = date.getFullYear();

	    result = yearNum+'-'+monthNum+'-'+dateNum;
	}
    return result;
}

export default dateFilterFormat;

