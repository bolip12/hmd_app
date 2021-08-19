import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, List, Badge, IconButton, Divider} from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';

class KehadiranScreen extends Component {

  constructor(props) {
      super(props);
      
      //redux variable
      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        
       
      }
  }

  componentDidMount() {
    this.getData();
     
  }

  componentWillUnmount() {
    
  }

  async getData() {
      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:true }
      });
      
      let { data, error} = await supabase
          .from('kelas_peserta')
          .select('id, kelas_id, kelas:kelas_id (nama), pelatihan:pelatihan_id (nama)')
          .eq('peserta_id', this.state.peserta_id)
          .order('tanggal_mulai', {foreignTable: 'kelas'})

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
            <Appbar.Content title="Kelas" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.pelatihan.nama}
                  description={item.kelas.nama}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.pelatihan.nama.charAt(0)}</Badge>}
                  right={() => <IconButton icon='arrow-right-circle-outline' />}
                  onPress={() => this.props.navigation.push('KehadiranKelasScreen', {kelas_id:item.kelas_id})}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default KehadiranScreen;