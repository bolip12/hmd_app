import React, { Component } from 'react';
import { View, ScrollView } from 'react-native'
import { Provider as PaperProvider, Appbar, IconButton, Headline, Divider, Text, TextInput, HelperText, Button, Portal, Dialog, Title, Subheading, Paragraph } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme.js';
import styleApp from '../../../config/styleApp.js';
import store from '../../../config/storeApp';

class PesertaUpdateScreen extends Component {
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

    let docId = this.props.route.params.docId;

    
    const nama = this.state.nama;
    const telepon = this.state.telepon;
    const jurusan = this.state.jurusan;
    const universitas = this.state.universitas;
    const alamat = this.state.alamat;
    

    let response = [];
    
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

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
  

  render() {
    return (
      <PaperProvider theme={Theme}>
        <Appbar.Header style={styleApp.Appbar}>
          <Appbar.BackAction color= {Theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Update Peserta" color= {Theme.colors.primary}/>
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>

          <TextInput
              label="Nama"
              value={this.state.nama}
              onChangeText={text => this.setState({nama: text})}
              style={styleApp.TextInput}   
              selectionColor={Theme.colors.accent}                                    
            />

            <TextInput
              label="Telepon/WA"
              value={this.state.telepon}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({telepon: text})}
              selectionColor={Theme.colors.accent}
              style={styleApp.TextInput}             
            />

            <TextInput
              label="Universitas"
              value={this.state.universitas}
              onChangeText={text => this.setState({universitas: text})}
              style={styleApp.TextInput}   
              selectionColor={Theme.colors.accent}                                    
            />

            <TextInput
              label="Jurusan"
              value={this.state.jurusan}
              onChangeText={text => this.setState({jurusan: text})}
              style={styleApp.TextInput}   
              selectionColor={Theme.colors.accent}                                    
            />

            <TextInput
              label="Alamat"
              value={this.state.alamat}
              onChangeText={text => this.setState({alamat: text})}
              style={styleApp.TextInput}   
              selectionColor={Theme.colors.accent}                                    
            />

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