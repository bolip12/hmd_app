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
import dateFilterFormat from '../../../component/dateFilterFormat.js';
import clearThousandFormat from '../../../component/clearThousandFormat.js';

class KelasKehadiranUpdateScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,

        pertemuan: '',
        materi: '',
        materi_realisasi: '',
        tanggal_kehadiran: new Date(),

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
          .from('kelas_kehadiran')
          .select('id, pertemuan, materi, materi_realisasi, tanggal_kehadiran')
          .eq('id', docId)
          .single()

    this.setState({
      pertemuan:data.pertemuan,
      tanggal_kehadiran:data.tanggal_kehadiran,
      materi:data.materi,
      materi_realisasi:data.materi_realisasi,
    });

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


      let docId = this.props.route.params.docId;
      let result = [];
      let tanggal_kehadiran = dateFilterFormat(this.state.tanggal_kehadiran);
      let materi = this.state.materi;
      let materi_realisasi = this.state.materi_realisasi;
      let pertemuan = this.state.pertemuan;


      result = await supabase
        .from('kelas_kehadiran')
        .update([{
                pertemuan: this.state.pertemuan,
                materi: materi,
                materi_realisasi: materi_realisasi,
                tanggal_kehadiran: tanggal_kehadiran,

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

      this.props.navigation.navigate('KelasKehadiranScreen');

  }


  render() {
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    let minDate = new Date();

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Update Kehadiran" />
          </Appbar.Header>

          <TextInput
            label="Pertemuan"
            value={thousandFormat(this.state.pertemuan)}
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

           <TextInput
            label="Materi Realisasi"
            value={this.state.materi_realisasi}
            onChangeText={text => this.setState({materi_realisasi:text})}
            style={{margin:10}}
          />

          <DateTimeInput
              title="Tanggal Kehadiran"
              value={new Date(this.state.tanggal_kehadiran)}
              mode="date"

              onChangeDate={(date) => this.setState({tanggal_kehadiran:date})}
            />
            <Divider style={{ backgroundColor: 'grey', marginHorizontal: 10 }}/>


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

export default KelasKehadiranUpdateScreen;
