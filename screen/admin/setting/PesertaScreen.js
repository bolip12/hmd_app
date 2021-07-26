import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider} from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';

class PesertaScreen extends Component {

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

      //query
      let { data, error, count } = await supabase
          .from('peserta')
          .select('id, nama, email, telepon')


      //memasukan respon ke state untuk loop data di render
      this.setState({data:data});

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  onRight(item) {
    return(
      <View style={{ flexDirection: 'row' }}>
          <IconButton icon='lock-reset' size={25} onPress={() => this.props.navigation.navigate('PesertaResetPasswordScreen', {docId:item.id, email:item.email})} />
          <IconButton icon='pencil' size={25} onPress={() => this.props.navigation.navigate('PesertaUpdateScreen', {docId:item.id})} />
      </View>

    )
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Peserta" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.nama}
                  description={item.email}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.nama.charAt(0)}</Badge>}
                  right={() => this.onRight(item)}
                  onPress={() => this.props.navigation.navigate('PesertaUpdateScreen', {docId:item.id})}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.props.navigation.navigate('PesertaInsertScreen')}
              style={{margin:20}}
          >
            Insert Peserta
          </Button>

        </PaperProvider>
      )
  }
}

export default PesertaScreen;
