import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import Theme from '../config/Theme.js';
import dateFormat from './dateFormat.js';
import timeFormat from './timeFormat.js';

class dateTimeInput extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	display: false,
	    };

	}
	componentDidMount() {
		/*let minDate = new Date();
		minDate.setDate(minDate.getDate() - 60);

		this.setState({minDate:minDate});*/
	}

	onSelect(date) {
		this.setState({display:false});
		if(date) {
			this.props.onChangeDate(date);
		}
	}

	render() {
		//timeZoneOffsetInMinutes={420}
		let valueSelected = this.props.mode == 'date' ? dateFormat(this.props.value) : timeFormat(this.props.value);
		let styleProps = typeof this.props.style != 'undefined' ? this.props.style : '';

		let minDate = new Date();
		minDate.setDate(minDate.getDate() - 365);
		if(typeof this.props.minDate != 'undefined') {
			minDate = this.props.minDate
		}

		let maxDate = new Date();
		if(typeof this.props.maxDate != 'undefined') {
			maxDate = this.props.maxDate
		}

		return (
			<View>
				<HelperText style={{marginTop:5, marginBottom:-20, marginLeft:10, color:Theme.colors.primary}}>{this.props.title}</HelperText>
				<List.Item
				    title={valueSelected}
				    right={() => <List.Icon icon="calendar" />}
				    onPress={() => this.setState({display:true})}
				    style={[styles.list, styleProps]}
				/>

				{this.state.display && (
		        <DateTimePicker
							value={this.props.value}
							mode={this.props.mode}
							display="calendar"
							is24Hour={true}
							onChange={(event,date) => this.onSelect(date)}
		        />
		        )}
	        </View>
		);
	}
}

const styles = StyleSheet.create({
  list: {
   	marginHorizontal:5,
		height:50,
		marginBottom:5
  },
})



export default dateTimeInput;