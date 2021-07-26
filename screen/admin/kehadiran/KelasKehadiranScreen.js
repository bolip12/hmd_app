import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider} from 'react-native-paper';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import dateFormatSupa from '../../../component/dateFormatSupa';

class KelasPesertaScreen extends Component {

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

      //query
      let { data, error, count } = await supabase
          .from('kelas_kehadiran')
          .select('id, pertemuan, materi, tanggal_kehadiran')
          .eq('kelas_id', kelas_id);


      //memasukan respon ke state untuk loop data di render
      this.setState({data:data});

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  onRight(item) {
    let kelas_id = this.props.route.params.kelas_id;

    return(
       <View style={{ flexDirection: 'row' }}>
          <IconButton icon='account' size={27} onPress={() => this.onListPeserta(item)} />
          <IconButton icon='pencil' size={25} onPress={() => this.props.navigation.navigate('KelasKehadiranUpdateScreen', {docId:item.id})} />
      </View>

    )
  }

  onListPeserta(item) {
    this.props.navigation.navigate('KelasKehadiranPesertaScreen', {kelas_nama:this.props.route.params.kelas_nama, materi:item.materi, docId:item.id});
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title={this.props.route.params.kelas_nama} />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.materi}
                  description={dateFormatSupa(item.tanggal_kehadiran)}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.pertemuan}</Badge>}
                  right={props => this.onRight(item)}
                  onPress={() => this.onListPeserta(item)}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default KelasPesertaScreen;
