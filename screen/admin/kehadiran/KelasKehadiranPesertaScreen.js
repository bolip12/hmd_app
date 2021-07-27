import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider, Checkbox} from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';

class KelasKehadiranPesertaScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();
        store.subscribe(()=>{
          this.setState(store.getState());
        });

      this.state = {
        ...this.state,
        data: [],
        kehadiranCheck: false,

      };
  }

  componentDidMount() {
      this.getData();

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

      let kelas_id = this.props.route.params.kelas_id;
      let kelas_kehadiran_id = this.props.route.params.kelas_kehadiran_id;

      //query
      let { data:peserta } = await supabase
          .from('kelas_peserta')
          .select('peserta_id, peserta:peserta_id(nama)')
          .eq('kelas_id', kelas_id)

      
      let listData = [];
      peserta.map(async (doc) => {
        let {data:kehadiran, error} = await supabase
        .from('kelas_kehadiran_peserta')
        .select('status')
        .eq('kelas_kehadiran_id', kelas_kehadiran_id)
        .eq('peserta_id', doc.peserta_id)
        .single();

        let status = false
        if (kehadiran != null && kehadiran.status == true) {
          status = true
        }

        listData.push({
          peserta_id: doc.peserta_id,
          peserta_nama: doc.peserta.nama,
          status: status,
        });

        this.setState({data:listData});
      });

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  onCheck(peserta_id, status) {
    let data = this.state.data;
    
    data.map(async (doc, row) => {
      if(doc.peserta_id == peserta_id) {
        data[row].status = !doc.status;
      }
    })

    this.setState({data:data});
  }

  async onSubmit() {
    store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });

    let kelas_kehadiran_id = this.props.route.params.kelas_kehadiran_id;
    let data = this.state.data;

    let response = await supabase
            .from('kelas_kehadiran_peserta')
            .delete()
            .eq('kelas_kehadiran_id', kelas_kehadiran_id);

    data.map(async (doc) => {
      let {data:kehadiran, error} = await supabase
        .from('kelas_kehadiran_peserta')
        .insert([{  
            peserta_id: doc.peserta_id,
            kelas_kehadiran_id: kelas_kehadiran_id,
            status: doc.status,
          }]);
        console.log(error)
    })

     //notif
        showMessage({
          message: 'Data berhasil disimpan',
          icon: 'success',
          type: 'success',
        }); 
      
      store.dispatch({
              type: 'LOADING',
              payload: { isLoading:false }
          });

      this.props.navigation.navigate('KelasKehadiranScreen');
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title={this.props.route.params.materi} subtitle={this.props.route.params.kelas_nama} />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>

                <List.Item
                  title={item.peserta_nama}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={40}>{item.peserta_nama.charAt(0)}</Badge>}
                  right={props => <Checkbox status={item.status == true ? 'checked' : 'unchecked'} onPress={() => this.onCheck(item.peserta_id, item.status)} color={Theme.colors.primary} />}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="content-save"
              onPress={() => this.onSubmit()}
              style={{margin:10}}
          >
            Simpan
          </Button>

        </PaperProvider>
      )
  }
}

export default KelasKehadiranPesertaScreen;
