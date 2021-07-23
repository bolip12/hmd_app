import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider, Checkbox} from 'react-native-paper';

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
      let { data, error, count } = await supabase
          .from('kelas_kehadiran_peserta')
          .select('id, peserta_id, status, peserta:peserta_id (nama)')
          .eq('kelas_kehadiran_id', kelas_kehadiran_id)

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
            <Appbar.Content title={this.props.route.params.materi} />
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
                  right={props => <Checkbox status={item.status == true ? 'checked' : 'unchecked'} onPress={() => this.setState({kehadiranCheck:false})} color={Theme.colors.primary} />}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default KelasKehadiranPesertaScreen;
