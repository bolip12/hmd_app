import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, IconButton, Badge, Divider} from 'react-native-paper';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';

class PelatihanMateriScreen extends Component {

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

      let pelatihan_id = this.props.route.params.pelatihan_id;

      //query
      let { data, error, count } = await supabase
          .from('pelatihan_materi')
          .select('id, materi, pertemuan')
          .eq('pelatihan_id', pelatihan_id)
          .order('pertemuan', { ascending: true })

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
            <Appbar.Content title="Materi" subtitle={this.props.route.params.pelatihan_nama} />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.materi}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.pertemuan}</Badge>}
                  right={() => <IconButton icon='pencil' size={25} onPress={() => this.props.navigation.navigate('PelatihanMateriUpdateScreen', {docId:item.id})} />}
                  onPress={() => this.props.navigation.navigate('PelatihanMateriUpdateScreen', {docId:item.id})}
                />
                <Divider />
              </View>
            )}
          />

          <Button
              mode="contained"
              icon="plus"
              onPress={() => this.props.navigation.navigate('PelatihanMateriInsertScreen', {pelatihan_id:this.props.route.params.pelatihan_id})}
              style={{margin:20}}
          >
            Insert Materi
          </Button>

        </PaperProvider>
      )
  }
}

export default PelatihanMateriScreen;
