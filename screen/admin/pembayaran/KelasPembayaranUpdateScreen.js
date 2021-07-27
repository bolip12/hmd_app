import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, TextInput, Portal, Modal, ActivityIndicator, Divider, HelperText } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import PickerInput from '../../../component/pickerInput';
import DateTimeInput from '../../../component/dateTimeInput.js';
import thousandFormat from '../../../component/thousandFormat.js';
import clearThousandFormat from '../../../component/clearThousandFormat.js';
import dateFilterFormat from '../../../component/dateFilterFormat.js';

class KelasPembayaranUpdateScreen extends ValidationComponent {

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

  componentDidMount() {
    this.fetchData();

  }

  async fetchData() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let docId = this.props.route.params.docId;

    let { data, error } = await supabase
          .from('kelas_pembayaran')
          .select('id, tanggal, nominal, keterangan')        
          .eq('id', docId)
          .single()

    this.setState({
      tanggal:data.tanggal, 
      nominal:data.nominal, 
      keterangan:data.keterangan,
    });

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  async onSubmit() {    

    this.validate({
      nominal: {required:true, numeric:true},
      tanggal: {required:true},
      keterangan: {required:true},

    });

    if(this.isFormValid()) {
      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:true }
          });

      let docId = this.props.route.params.docId;
      let result = [];

      let tanggal = dateFilterFormat(this.state.tanggal);
      let nominal = clearThousandFormat(this.state.nominal);

      result = await supabase
        .from('kelas_pembayaran')
        .update([{  
                tanggal: tanggal,
                nominal: nominal,
                keterangan: this.state.keterangan,

              }])
        .eq('id', docId);


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
  }


  render() {
    /*let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    let minDate = new Date();*/

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Insert Pembayaran" />
          </Appbar.Header>

          <DateTimeInput
              title="Tanggal Bayar"
              value={new Date(this.state.tanggal)}
              mode="date"
              /*minDate={minDate}
              maxDate={maxDate}*/
              onChangeDate={(date) => this.setState({tanggal:date})}
            />
            <Divider style={{ backgroundColor: 'grey', marginHorizontal: 10 }}/>

          <TextInput
            label="Nominal"
            value={thousandFormat(this.state.nominal)}
            onChangeText={text => this.setState({nominal:text})}
            keyboardType={"numeric"}
            style={{margin:10}}
          />
          {this.isFieldInError('nominal') && this.getErrorsInField('nominal').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

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

export default KelasPembayaranUpdateScreen;
