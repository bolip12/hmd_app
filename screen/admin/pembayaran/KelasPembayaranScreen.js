import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider, Subheading} from 'react-native-paper';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import dateFormatSupa from '../../../component/dateFormatSupa';
import thousandFormat from '../../../component/thousandFormat';

class KelasPembayaranScreen extends Component {

  constructor(props) {
      super(props);

      this.state = store.getState();
        store.subscribe(()=>{
          this.setState(store.getState());
        });

      this.state = {
        ...this.state,
        data: [],


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

      let kelas_id = this.props.route.params.kelas_id;
      let peserta_id = this.props.route.params.peserta_id;

      //query
      let { data, error, count } = await supabase
          .from('kelas_pembayaran')
          .select('id, tanggal, nominal, keterangan')
          .eq('kelas_id', kelas_id)
          .eq('peserta_id', peserta_id);


      //memasukan respon ke state untuk loop data di render
      this.setState({data:data});

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title={this.props.route.params.peserta_nama} subtitle={this.props.route.params.kelas_nama} />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={dateFormatSupa(item.tanggal)}
                  description={item.keterangan}
                  right={props => <Subheading style={{ marginTop: 10, marginRight: 10, fontWeight:'bold' }} >{thousandFormat(item.nominal)}</Subheading>}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.props.navigation.navigate('KelasPembayaranInsertScreen', {kelas_id:this.props.route.params.kelas_id, peserta_id:this.props.route.params.peserta_id})}
              style={{margin:20}}
          >
            Tambah Pembayaran
          </Button>

        </PaperProvider>
      )
  }
}

export default KelasPembayaranScreen;
