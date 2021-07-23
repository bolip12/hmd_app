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

  componentDidMount() {
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getData();
      });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getData() {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

      let docId = this.props.route.params.docId;
      
      //query
      let { data, error, count } = await supabase
          .from('pelatihan_materi')
          .select('id, materi, pertemuan')
          .eq('id', docId)
          .single()
          
      this.setState({
        
        pertemuan:data.pertemuan,
        materi:data.materi,
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

      
      result = await supabase
        .from('pelatihan_materi')
        .update([{  
                pertemuan: this.state.pertemuan,
                materi: this.state.materi,
              }])
        .eq('id', docId)

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


  onDeleteConfirm() {

     let docId = this.props.route.params.docId;

      Alert.alert(
        "Perhatian",
        "Data akan dihapus?",
        [
          { text: "Batal" },
          { text: "OK", onPress: () => this.onDelete(docId) }
        ],
      );
  }

  async onDelete(docId) {
    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

    let response = await supabase
            .from('pelatihan_materi')
            .delete()
            .eq('id', docId);

    //notif
    if(response.error) {
      showMessage({
          message: result.error.message,
          icon: 'warning',
          backgroundColor: 'red',
          color: Theme.colors.background,
        });

    } else {
      showMessage({
          message: 'Data berhasil dihapus',
          icon: 'success',
          type: 'success',
        }); 
    }

    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });

    this.props.navigation.navigate('PelatihanMateriScreen')
  }


  render() {

      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Update Materi" />
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

          <Button
              mode="contained"
              icon="check"
              onPress={() => this.onSubmit()}
              style={{margin:10}}
          >
            Simpan
          </Button>


          <Button 
              mode="text"
              icon="delete"
              color="grey"
              onPress={() => this.onDeleteConfirm()}
            >
              Delete
          </Button>

        </PaperProvider>
      )
  }
}

export default PelatihanMateriInsertScreen;
