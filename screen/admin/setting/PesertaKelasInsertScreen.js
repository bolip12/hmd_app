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

class PesertaKelasInsertScreen extends ValidationComponent {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        
        pesertaList: [],

        pesertaId: '',
        peserta: '',

        
      };
  }

  componentDidMount() {
    this.fetchDataPeserta();
  }

  async fetchDataPeserta() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });
    let { data, error } = await supabase
          .from('peserta')
          .select('id, nama')

    let pesertaList = [];
    data.map(doc => {
      pesertaList.push({
        value: doc.id,
        label: doc.nama,
      });
    });

    //result
    this.setState({pesertaList:pesertaList});

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }



  async onSubmit() {    
    this.validate({
      peserta: {required:true},

    });

    if(this.isFormValid()) {
      store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
      });

      let pelatihan_id = this.props.route.params.pelatihan_id;
      let kelas_id = this.props.route.params.kelas_id;
      let pesertaId = this.state.pesertaId;
     
      let { data } = await supabase
          .from('kelas_peserta')
          .select('id, peserta_id')
          .eq('kelas_id', kelas_id)
          .eq('peserta_id', pesertaId);

      if(data != '') {
        showMessage({
          message: 'Peserta sudah terdaftar',
          icon: 'warning',
          backgroundColor: 'red',
          color: Theme.colors.background,
        });
      } else {

        let {data:insert_kelas, error} = await supabase
        .from('kelas_peserta')
        .insert([{ 
                kelas_id: kelas_id,
                peserta_id: this.state.pesertaId,
                pelatihan_id: pelatihan_id,
              }]);
      
        //notif
        if(error) {
          showMessage({
                message: error.message,
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

      }

      store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
      });

      this.props.navigation.navigate('PesertaKelasScreen');
          
    }
  }


  render() {
    
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Insert Peserta" />
          </Appbar.Header>

          <PickerInput
            title="Peserta"
            options={this.state.pesertaList}
            value={this.state.pesertaId}
            label={this.state.peserta}
            onChangePickerValue={value => this.setState({pesertaId: value})}
            onChangePickerLabel={label => this.setState({peserta: label})}
          />
          <Divider/>
          {this.isFieldInError('peserta') && this.getErrorsInField('peserta').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          
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

export default PesertaKelasInsertScreen;
