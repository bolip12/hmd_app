import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { LogBox } from 'react-native';

import FlashMessage from "react-native-flash-message";

//template
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './config/Theme';

//navigation
import AuthNav from './navigation/AuthNav';
import AdminNav from './navigation/AdminNav';

//storeApp
import storeApp from './config/storeApp';
import Loading from './component/Loading.js';

LogBox.ignoreAllLogs();

class App extends React.Component {
	constructor(props) {
	  super(props);

	  //get redux variable
	  this.state = storeApp.getState();
	  storeApp.subscribe(()=>{
	    this.setState(storeApp.getState());
	  });

	  this.state = {
	    ...this.state,
	  };
	}

	render() {

		//sudah login
		if(this.state.isLogin == true) {

			//login anggota
			if(this.state.user_type == 'admin') {
				return (
						<PaperProvider theme={Theme}>
							<AdminNav />
							<Loading />
							<FlashMessage position="top" style={{marginTop:30}} />
						</PaperProvider>
					)
			}

			/*//login petugas
			} else {
				return (
						<PaperProvider theme={Theme}>
							<PetugasNav />
							<Loading />
							<FlashMessage position="top" style={{marginTop:30}} />
						</PaperProvider>
					)

			}*/

		//belum login
		} else {
			return (
				<PaperProvider theme={Theme}>
					<AuthNav />
					<Loading />
					<FlashMessage position="top" style={{marginTop:30}} />
				</PaperProvider>
			)
		}

	}
}

export default App;
