import React, { Component } from 'react';
import { View, ScrollView } from 'react-native'
import { Provider as PaperProvider, Appbar, IconButton, Headline, Divider, Text, TextInput, HelperText, Button, Portal, Dialog, Title, Subheading, Paragraph } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme.js';
import styleApp from '../../../config/styleApp.js';
import store from '../../../config/storeApp';

class PesertaUpdateScreen extends ValidationComponent {
  constructor(props) {
      super(props);

      this.state = store.getState();
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,

        nama: '',
        telepon: '',
        jurusan: '',
        universitas: '',
        alamat: '',

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
          .from('peserta')
          .select('id, nama, telepon, universitas, jurusan, alamat')
          .eq('id', docId)
          .single()

    this.setState({
      nama:data.nama,
      universitas:data.universitas,
      telepon:data.telepon,
      jurusan:data.jurusan,
      alamat:data.alamat,
    });

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }


  async onSubmit() {
    this.validate({
      nama: {required:true},
      telepon: {required:true, minlength:10},
      universitas: {required:true},
      jurusan: {required:true},

    });

    if(this.isFormValid()) {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

      let docId = this.props.route.params.docId;


      const nama = this.state.nama;
      const telepon = this.state.telepon;
      const jurusan = this.state.jurusan;
      const universitas = this.state.universitas;
      const alamat = this.state.alamat;


      let response = [];

       response = await supabase
        .from('peserta')
        .update([{
              nama: nama,
              telepon: telepon,
              jurusan: jurusan,
              universitas: universitas,
              alamat: alamat,
            }])
        .eq('id', docId);


      if(response.error) {
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
          type: 'success'
        });
      }

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });

      this.props.navigation.navigate('PesertaScreen');
    }
  } 


  render() {
    return (
      <PaperProvider theme={Theme}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Update Peserta"/>
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>

          <TextInput
            label="Nama"
            value={this.state.nama}
            onChangeText={text => this.setState({nama: text})}
            style={styleApp.TextInput}
            selectionColor={Theme.colors.accent}
          />
          {this.isFieldInError('nama') && this.getErrorsInField('nama').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <TextInput
            label="Telepon/WA"
            value={this.state.telepon}
            keyboardType={'numeric'}
            onChangeText={text => this.setState({telepon: text})}
            selectionColor={Theme.colors.accent}
            style={styleApp.TextInput}
          />
          {this.isFieldInError('telepon') && this.getErrorsInField('telepon').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <TextInput
            label="Universitas"
            value={this.state.universitas}
            onChangeText={text => this.setState({universitas: text})}
            style={styleApp.TextInput}
            selectionColor={Theme.colors.accent}
          />
          {this.isFieldInError('universitas') && this.getErrorsInField('universitas').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <TextInput
            label="Jurusan"
            value={this.state.jurusan}
            onChangeText={text => this.setState({jurusan: text})}
            style={styleApp.TextInput}
            selectionColor={Theme.colors.accent}
          />
          {this.isFieldInError('jurusan') && this.getErrorsInField('jurusan').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <TextInput
            label="Alamat"
            value={this.state.alamat}
            onChangeText={text => this.setState({alamat: text})}
            style={styleApp.TextInput}
            selectionColor={Theme.colors.accent}
          />
          {this.isFieldInError('nama') && this.getErrorsInField('nama').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

        </ScrollView>

          <Button
            mode="contained"
            icon="content-save-outline"
            onPress={() => this.onSubmit()}
            disabled={this.state.isLoading}
            style={styleApp.Button}
          >
            Simpan
          </Button>

      </PaperProvider>
    )
  }
}

export default PesertaUpdateScreen;
