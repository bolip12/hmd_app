import React, { Component } from 'react';
import { View, ScrollView } from 'react-native'
import { Provider as PaperProvider, Appbar, IconButton, Headline, Divider, Text, TextInput, HelperText, Button, Portal, Dialog, Title, Subheading, Paragraph, List} from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import styleApp from '../../../config/styleApp.js';
import store from '../../../config/storeApp';


class PesertaInsertScreen extends ValidationComponent {
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

        email: '',
        password: '',
        passwordHide: true,
        passwordIcon: 'eye',

        registerSuccess: false,
      };


  }


  passwordDisplay() {
    let passwordIcon = this.state.passwordIcon == 'eye' ? 'eye-off-outline' : 'eye';
    this.setState({passwordIcon: passwordIcon});
    this.setState({passwordHide: !this.state.passwordHide});
  }

  passwordConfirmDisplay() {
    let passwordConfirmIcon = this.state.passwordConfirmIcon == 'eye' ? 'eye-off-outline' : 'eye';
    this.setState({passwordConfirmIcon: passwordConfirmIcon});
    this.setState({passwordConfirmHide: !this.state.passwordConfirmHide});
  }


  async onSubmit() {
    this.validate({
      nama: {required:true},
      telepon: {required:true, minlength:10},
      universitas: {required:true},
      jurusan: {required:true},

      email: {required:true},
      password: {required:true, minlength:6},
      //passwordConfirm: {required:true, minlength:6, equalPassword : this.state.password},
    });


    if(this.isFormValid()) {
        store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        const email = this.state.email;
        const password = this.state.password;
        const nama = this.state.nama;
        const telepon = this.state.telepon;
        const jurusan = this.state.jurusan;
        const universitas = this.state.universitas;
        const alamat = this.state.alamat;


        //login process
        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if(error) {
           showMessage({
            message: error.message,
            icon: 'warning',
            backgroundColor: 'red',
            color: Theme.colors.background,
          });


        } else {
          //insert user
          const insertPeserta = await supabase
                    .from('peserta')
                    .insert([{
                              email: email,
                              nama: nama,
                              telepon: telepon,
                              jurusan: jurusan,
                              universitas: universitas,
                              alamat: alamat,
                            }])

          let peserta_id = insertPeserta.body[0].id;

          const { insertUsers, error } = await supabase
                    .from('users')
                    .insert([{
                              tipe: 'peserta',
                              peserta_id: peserta_id,
                              email: email,
                              password: password,
                            }])
        }

          store.dispatch({
              type: 'LOADING',
              payload: { isLoading:false }
          });

          showMessage({
            message: 'Data berhasil disimpan',
            icon: 'success',
            type: 'success',
          });

          this.props.navigation.navigate('PesertaScreen');
      }
    }


  render() {
    return (
      <PaperProvider theme={Theme}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Insert Peserta"/>
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>

         <List.Section>
          <List.Subheader style={{ fontWeight: 'bold' }}>Login</List.Subheader><Divider />

            <TextInput
              label="Email"
              value={this.state.email}
              onChangeText={text => this.setState({email: text})}
              style={styleApp.TextInput}
              selectionColor={Theme.colors.accent}
            />
            {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

            <TextInput
              label="Password"
              secureTextEntry={this.state.passwordHide}
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
              style={styleApp.TextInput}
              right={<TextInput.Icon icon={this.state.passwordIcon} onPress={() => this.passwordDisplay()} />}
              selectionColor={Theme.colors.accent}
            />
            {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          </List.Section>

        <List.Section>
          <List.Subheader style={{ fontWeight: 'bold' }}>Personal</List.Subheader><Divider />
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

        </List.Section>

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

export default PesertaInsertScreen;
