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

class PelatihanMateriInsertScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        
        materi: '',
        pertemuan: '',
        
      };
  }

  async onSubmit() {    
      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:true }
          });

      let pelatihan_id = this.props.route.params.pelatihan_id;
      let result = [];

      
      result = await supabase
        .from('pelatihan_materi')
        .insert([{  
                pelatihan_id: pelatihan_id,
                pertemuan: this.state.pertemuan,
                materi: this.state.materi,
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

      this.props.navigation.navigate('PelatihanMateriScreen');
          
    
  }


  render() {

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Insert Anggota" />
          </Appbar.Header>

          <TextInput
            label="Pertemuan"
            value={this.state.pertemuan}
            onChangeText={text => this.setState({pertemuan:text})}
            keyboardType="numeric"
            style={{margin:10}}
          />

           <TextInput
            label="Materi"
            value={this.state.materi}
            onChangeText={text => this.setState({materi:text})}
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

export default PelatihanMateriInsertScreen;
