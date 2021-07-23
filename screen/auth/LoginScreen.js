import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, TextInput, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase';
import Theme from '../../config/Theme';
import store from '../../config/storeApp';
import Loading from '../../component/Loading';

class LoginScreen extends Component {

  constructor(props) {
      super(props);

      //redux variable
      this.state = store.getState();
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        email: 'alifsasetyaputra@gmail.com',
        password: '1234567',
        isLoading: false,
      };
  }

  componentDidMount() {
  }

  //memanggil api untuk menyimpan data
  async onLogin() {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

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
        showMessage({
            message: 'Berhasil Login',
            type: 'success',
            icon: 'success',
        });

        store.dispatch({
            type: 'LOGIN',
            payload: { isLogin:true, user_type:'admin' }
        });
      }

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
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

          <TextInput
            label="Password"
            value={this.state.password}
            onChangeText={text => this.setState({password:text})}
            secureTextEntry={true}
            style={{marginHorizontal:10}}
          />

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
