import React from 'react';
import { ScrollView, View, FlatList, Dimensions } from 'react-native';
import { Provider as PaperProvider, Appbar, Card, List, TextInput, Button, HelperText, Subheading, RadioButton, Switch, Divider,Portal, Dialog } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme.js';
import styleApp from '../../../config/styleApp.js';
import store from '../../../config/storeApp';

class PesertaResetPasswordScreen extends ValidationComponent {
  constructor(props) {
    super(props);

    this.state = store.getState();  
    store.subscribe(()=>{
      this.setState(store.getState());
    });
    
    this.state = {
      ...this.state,
      isLoading: false,
      showPassword: true,
      showPasswordBaru: true,
      showPasswordIcon: 'eye',
      showPasswordBaruIcon: 'eye',
      passwordEksisting: '',
      passwordBaru: '',
    };

  }

  componentDidMount() {
   
  }

  async onSubmit() {
    this.validate({
      passwordEksisting: {required:true, minlength:6},
      passwordBaru: {required:true, minlength:6},
    });

    if(this.isFormValid()) {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

      const userEmail = this.props.route.params.email;
      const passwordEksisting = this.state.passwordEksisting;
      const passwordBaru = this.state.passwordBaru;

      const { user, session, error } = await supabase.auth.signIn({
              email: userEmail,
              password: passwordEksisting,
          })

      if(error != null) {
          showMessage({
            message: 'Password saat ini tidak valid',
            icon: 'warning',
            backgroundColor: 'red',
            color: Theme.colors.background,
          });

          store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
          });

      } else {
          const { error, data } = await supabase.auth.api
          .updateUser(session.access_token, { password : passwordBaru })

          let result = await supabase
          .from('users')
          .update([{  
                  password: passwordBaru,

                }])
          .eq('email', userEmail);


          store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
          });

          showMessage({
            message: 'Password berhasil diubah',
            icon: 'success',
            type: 'success',
          }); 

          this.props.navigation.navigate('PesertaScreen');

      }

    }
  }

  showPassword() {
    this.setState({ showPassword: !this.state.showPassword });

    const showPasswordIcon = this.state.showPassword ? 'eye-off-outline' : 'eye';
    this.setState({ showPasswordIcon: showPasswordIcon });
  }

  showPasswordBaru() {
    this.setState({ showPasswordBaru: !this.state.showPasswordBaru });

    const showPasswordBaruIcon = this.state.showPasswordBaru ? 'eye-off-outline' : 'eye';
    this.setState({ showPasswordBaruIcon: showPasswordBaruIcon });
  }


  render() {
    return (
      <PaperProvider theme={Theme}>
        <Appbar.Header style={{ backgroundColor: '#ffffff' }}>
          <Appbar.BackAction color= {Theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Reset Password" color= {Theme.colors.primary} />
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>
            <TextInput
              label="Password Saat Ini"
              value={this.state.passwordEksisting}
              onChangeText={(text) => this.setState({ passwordEksisting: text })}
              secureTextEntry={this.state.showPassword}
              right={<TextInput.Icon icon={this.state.showPasswordIcon} onPress={() => this.showPassword()} /> }
              style={styleApp.TextInput}
            />
            {this.isFieldInError('passwordEksisting') && this.getErrorsInField('passwordEksisting').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

            <TextInput
              label="Password Baru"
              value={this.state.passwordBaru}
              onChangeText={(text) => this.setState({ passwordBaru: text })}
              secureTextEntry={this.state.showPasswordBaru}
              right={<TextInput.Icon icon={this.state.showPasswordBaruIcon} onPress={() => this.showPasswordBaru()} /> }
              style={styleApp.TextInput}
            />
            {this.isFieldInError('passwordBaru') && this.getErrorsInField('passwordBaru').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

        </ScrollView>

        <Button 
            icon="content-save" 
            onPress={() => this.onSubmit()}
            mode="contained" 
            style={styleApp.Button}
          >
            Simpan
        </Button>

      </PaperProvider>
    );
  }
}

export default PesertaResetPasswordScreen;