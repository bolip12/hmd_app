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
        
        pelatihanList: [],

        pelatihanId: '',
        pelatihan: '',
        nama: '',
        biaya: '',
        tanggal_mulai: new Date(),
        
      };
  }

  componentDidMount() {
    this.fetchDataPelatihan();

  }

  async fetchDataPelatihan() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });
    let { data, error } = await supabase
          .from('pelatihan')
          .select('id, nama')

    let pelatihanList = [];
    data.map(doc => {
      pelatihanList.push({
        value: doc.id,
        label: doc.nama,
      });
    });

    //result
    this.setState({pelatihanList:pelatihanList});

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  async onSubmit() {    
      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:true }
          });

          let currTime = new Date();
          let result = [];

      
      result = await supabase
        .from('kelas')
        .insert([{  
                pelatihan_id: this.state.pelatihanId,
                nama: this.state.nama,
                tanggal_mulai: this.state.tanggal_mulai,
                biaya: clearThousandFormat(this.state.biaya),
                status: 'true',
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

      this.props.navigation.navigate('KelasScreen');
          
    
  }


  render() {
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    let minDate = new Date();

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Insert Anggota" />
          </Appbar.Header>

          <PickerInput
            title="Pelatihan"
            options={this.state.pelatihanList}
            value={this.state.pelatihanId}
            label={this.state.pelatihan}
            onChangePickerValue={value => this.setState({pelatihanId: value})}
            onChangePickerLabel={label => this.setState({pelatihan: label})}
          />
          <Divider/>

          <TextInput
            label="Nama"
            value={this.state.nama}
            onChangeText={text => this.setState({nama:text})}
            style={{margin:10}}
          />

          <DateTimeInput
              title="Tanggal Kirim"
              value={this.state.tanggal_mulai}
              mode="date"
              minDate={minDate}
              maxDate={maxDate}
              onChangeDate={(date) => this.setState({tanggal_mulai:date})}
            />
            <Divider style={{ backgroundColor: 'grey', marginHorizontal: 10 }}/>

          <TextInput
            label="Biaya"
            value={thousandFormat(this.state.biaya)}
            onChangeText={text => this.setState({biaya:text})}
            keyboardType="numeric"
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
