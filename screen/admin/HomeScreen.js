import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, DataTable, Avatar, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import supabase from '../../config/supabase';
import Theme from '../../config/Theme';
import store from '../../config/storeApp';

class HomeScreen extends Component {

  constructor(props) {
      super(props);
      
      //redux variable
      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        /*labels: [],
        datalist: [0],*/
       
      }
  }

  componentDidMount() {
    this.getData();
     
  }

  componentWillUnmount() {
    
  }

  async getData() {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });
      

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  onLogout() {
      //update redux
      store.dispatch({
          type: 'LOGIN',
          payload: { isLogin:false, user_type:'', nim:'', petugas_id:'' }
      });
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Content title="Home" />
            <Appbar.Action icon="power" onPress={() => this.onLogout()} />
          </Appbar.Header>

        </PaperProvider>
      )
  }
}

export default HomeScreen;