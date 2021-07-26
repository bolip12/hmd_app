import React, { Component } from 'react';
import { View, ScrollView, FlatList, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider, TextInput} from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import styleApp from '../../../config/styleApp';
import FormBottom from '../../../component/formBottom.js';

class PelatihanScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();
        store.subscribe(()=>{
          this.setState(store.getState());
        });

      this.state = {
        ...this.state,
        data: [],

        nama: '',
        formDisplay: false,


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

      //query
      let { data, error, count } = await supabase
          .from('pelatihan')
          .select('id, nama')

      this.setState({data:data});

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

      let response = [];

      //insert
        if(this.state.docId === '') {
        response = await supabase
          .from('pelatihan')
          .insert([{
                    nama: this.state.nama,
                  }]);
      //update
      } else {
        response = await supabase
          .from('pelatihan')
          .update([{
                    nama: this.state.nama,
                 }])
          .eq('id', this.state.docId);

      }

      //notif
      if(response.error) {
        showMessage({
            message: response.error.message,
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

          this.toggleForm();
          this.getData();
  }

  onDeleteConfirm() {
      Alert.alert(
        "Perhatian",
        "Data akan dihapus?",
        [
          { text: "Batal" },
          { text: "OK", onPress: () => this.onDelete(this.state.docId) }
        ],
      );
  }

  async onDelete(docId) {
    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

    let response = await supabase
            .from('pelatihan')
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

    this.toggleForm();
    this.getData();
  }

  toggleForm(item) {
      this.setState({formDisplay: !this.state.formDisplay});
      if(item) {
        this.setState({docId:item.id, nama:item.nama});
      } else {
        this.setState({docId:'', nama:''});
      }

  }

  onRight(item) {
    return(
      <View style={{ flexDirection: 'row' }}>
          <IconButton icon='bulletin-board' size={25} onPress={() => this.props.navigation.navigate('PelatihanMateriScreen', {pelatihan_id:item.id, pelatihan_nama:item.nama})} />
          <IconButton icon='pencil' size={25} onPress={() => this.toggleForm(item)} />
      </View>
    )
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Pelatihan" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.nama}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.nama.charAt(0)}</Badge>}
                  right={() => this.onRight(item)}
                  onPress={() => this.props.navigation.navigate('PelatihanMateriScreen', {pelatihan_id:item.id, pelatihan_nama:item.nama})}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.toggleForm()}
              style={{margin:20}}
          >
            Insert Pelatihan
          </Button>

          <FormBottom
              title=""
              display={this.state.formDisplay}
              onToggleForm={status => this.toggleForm()}
            >
              <TextInput
              label="Nama"
              value={this.state.nama}
              onChangeText={text => this.setState({nama: text})}
              style={styleApp.TextInput}
          />


          <Button
            mode="contained"
            icon="content-save-outline"
            onPress={() => this.onSubmit()}
            disabled={this.state.isLoading}
            style={styleApp.Button}
          >
            Save
          </Button>


          {this.state.docId != '' &&
          <Button
              mode="text"
              icon="delete"
              color="grey"
              onPress={() => this.onDeleteConfirm()}
              style={styleApp.ButtonDelete}
            >
              Delete
          </Button>
          }

          </FormBottom>

        </PaperProvider>
      )
  }
}

export default PelatihanScreen;
