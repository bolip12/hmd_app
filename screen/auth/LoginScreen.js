import React, { Component } from 'react';
import { View, Alert, BackHandler } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, TextInput, Portal, Modal, ActivityIndicator, HelperText } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase';
import Theme from '../../config/Theme';
import store from '../../config/storeApp';
import Loading from '../../component/Loading';

class LoginScreen extends ValidationComponent {

  constructor(props) {
      super(props);

      //redux variable
      this.state = store.getState();
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        email: '',
        password: '',
        passwordHide: true,
        passwordIcon: 'eye',

      };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    this.defaultValue();

  }

  onBackButtonPress = () => {
    return true;
  }

  async defaultValue() {

    let loginEmail = await AsyncStorage.getItem('@loginEmail');

    this.setState({ email:loginEmail });

    let loginPassword = await AsyncStorage.getItem('@loginPassword');
    this.setState({ password:loginPassword });

  }

  //memanggil api untuk menyimpan data
  async onLogin() {
    this.validate({
      email: {required:true, email: true},
      password: {required:true, minlength:6},
    });

    if(this.isFormValid()) {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

      await AsyncStorage.setItem('@loginEmail', this.state.email);
      await AsyncStorage.setItem('@loginPassword', this.state.password);

      const { user, session, error } = await supabase.auth.signIn({
        email: this.state.email,
        password: this.state.password,
      })

      if(error != null) {
        showMessage({
            message: error.message,
            type: 'danger',
            icon: 'danger',
        });

      } else {

        const { data } = await supabase
          .from('users')
          .select('id, tipe, peserta_id')
          .eq('email', this.state.email)
          .single();

        store.dispatch({
            type: 'LOGIN',
            payload: { isLogin:true, tipe:data.tipe, peserta_id:data.peserta_id }
        });

        showMessage({
            message: 'Berhasil Login',
            type: 'success',
            icon: 'success',
        });

      }

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
    }

  }

  passwordDisplay() {
    let passwordIcon = this.state.passwordIcon == 'eye' ? 'eye-off-outline' : 'eye';
    this.setState({passwordIcon: passwordIcon});

    this.setState({passwordHide: !this.state.passwordHide});
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Content title="Login" />
          </Appbar.Header>

          <TextInput
            label="Email"
            value={this.state.email}
            onChangeText={text => this.setState({email:text})}
            style={{marginHorizontal:10}}
          />
          {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <TextInput
            label="Password"
            secureTextEntry={this.state.passwordHide}
            value={this.state.password}
            onChangeText={text => this.setState({password:text})}
            style={{marginHorizontal:10}}
            right={<TextInput.Icon icon={this.state.passwordIcon} onPress={() => this.passwordDisplay()} />}
          />
          {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

          <Button
              mode="contained"
              icon="login"
              onPress={() => this.onLogin()}
              style={{margin:10}}
          >
            Login
          </Button>

          {/*<Button
              mode="outlined"
              icon="login"
              onPress={() => this.props.navigation.navigate('RegisterAnggotaScreen')}
              style={{margin:10}}
          >
            Register Anggota
          </Button>*/}

        </PaperProvider>
      )
  }
}

export default LoginScreen;
