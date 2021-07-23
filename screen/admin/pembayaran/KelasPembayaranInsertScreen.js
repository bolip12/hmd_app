import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, TextInput, Portal, Modal, ActivityIndicator, Divider } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import PickerInput from '../../../component/pickerInput';
import DateTimeInput from '../../../component/dateTimeInput.js';
import thousandFormat from '../../../component/thousandFormat.js';
import clearThousandFormat from '../../../component/clearThousandFormat.js';

class KelasInsertScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        
        nominal: '',
        tanggal: new Date(),
        keterangan: '',
      };
  }

  async onSubmit() {    
      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:true }
          });

      let kelas_id = this.props.route.params.kelas_id;
      let peserta_id = this.props.route.params.peserta_id;
          
      let result = [];

      
      result = await supabase
        .from('kelas_pembayaran')
        .insert([{  
                kelas_id: kelas_id,
                peserta_id: peserta_id,
                tanggal: this.state.tanggal,
                nominal: clearThousandFormat(this.state.nominal),
                keterangan: this.state.keterangan,
              }]);

      //notif
      if(result.error) {
        showMessage({
              message: result.error.message,
              icon: 'warning',
              backgroundColor: 'red',
              color: Theme.colors.background,
            });

      } else {
        showMessage({
              message: 'Data berhasil disimpan',
              icon: 'success',
              type: 'success',
            }); 
      }

      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:false }
          });

      this.props.navigation.navigate('KelasPembayaranScreen');
          
    
  }


  render() {
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    let minDate = new Date();

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Insert Pembayaran" />
          </Appbar.Header>

          <DateTimeInput
              title="Tanggal Bayar"
              value={this.state.tanggal}
              mode="date"
              minDate={minDate}
              maxDate={maxDate}
              onChangeDate={(date) => this.setState({tanggal:date})}
            />
            <Divider style={{ backgroundColor: 'grey', marginHorizontal: 10 }}/>

          <TextInput
            label="Nominal"
            value={thousandFormat(this.state.nominal)}
            onChangeText={text => this.setState({nominal:text})}
            keyboardType="numeric"
            style={{margin:10}}
          />

          <TextInput
            label="Keterangan"
            value={this.state.keterangan}
            onChangeText={text => this.setState({keterangan:text})}
            style={{margin:10}}
          />

          <Button
              mode="contained"
              icon="check"
              onPress={() => this.onSubmit()}
              style={{margin:10}}
          >
            Simpan
          </Button>

        </PaperProvider>
      )
  }
}

export default KelasInsertScreen;
