import React, { Component } from 'react';
import { View, Alert, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, TextInput, Portal, Modal, ActivityIndicator, Divider, HelperText, List, Badge, IconButton } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import PickerInput from '../../../component/pickerInput';
import DateTimeInput from '../../../component/dateTimeInput.js';
import thousandFormat from '../../../component/thousandFormat.js';
import clearThousandFormat from '../../../component/clearThousandFormat.js';

class PesertaKelasScreen extends ValidationComponent {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        
        data: [],
        biaya: '',
        
      };
  }

  componentDidMount() {
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.fetchData();
      });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  async fetchData() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let kelas_id = this.props.route.params.kelas_id;

    let { data, error } = await supabase
          .from('kelas_peserta')
          .select('id, peserta_id, peserta:peserta_id (nama)')
          .eq('kelas_id', kelas_id);
    //result
    this.setState({data:data});

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  
  onDeleteConfirm(id) {

      Alert.alert(
        "Perhatian",
        "Data akan dihapus?",
        [
          { text: "Batal" },
          { text: "OK", onPress: () => this.onDelete(id) }
        ],
      );
  }

  async onDelete(id) {
    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

    let response = await supabase
            .from('kelas_peserta')
            .delete()
            .eq('id', id);

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

    this.fetchData();
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title={this.props.route.params.kelas_nama} subtitle={this.props.route.params.pelatihan_nama} />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.peserta.nama}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={40}>{item.peserta.nama.charAt(0)}</Badge>}
                  right={props => <IconButton icon='trash-can-outline' color="grey" onPress={() => this.onDeleteConfirm(item.id)} />}
                  
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.props.navigation.navigate('PesertaKelasInsertScreen', {kelas_id:this.props.route.params.kelas_id, pelatihan_id:this.props.route.params.pelatihan_id})}
              style={{margin:10}}
          >
            Tambah
          </Button>

        </PaperProvider>
      )
  }
}

export default PesertaKelasScreen;
