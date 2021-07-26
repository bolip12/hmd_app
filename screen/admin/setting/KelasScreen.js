import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider} from 'react-native-paper';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';

class KelasScreen extends Component {

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
          .from('kelas')
          .select('id, nama, pelatihan:pelatihan_id (nama), status')



      //memasukan respon ke state untuk loop data di render
      this.setState({data:data});

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }


  onRight(item) {
    return(
      <View>
        { item.status == true ?
          <IconButton icon='check-bold' color="green" />
          :
          <IconButton icon='close-thick' color="red" />
        }
      </View>

    )
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Kelas" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.nama}
                  description={item.pelatihan.nama}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.nama.charAt(0)}</Badge>}
                  right={() => this.onRight(item)}
                  onPress={() => this.props.navigation.navigate('KelasUpdateScreen', {docId:item.id})}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.props.navigation.navigate('KelasInsertScreen')}
              style={{margin:20}}
          >
            Insert Kelas
          </Button>

        </PaperProvider>
      )
  }
}

export default KelasScreen;
