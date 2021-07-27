import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, List, Badge, Divider } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import styleApp from '../../../config/styleApp';
import dateFormatSupa from '../../../component/dateFormatSupa';
import thousandFormat from '../../../component/thousandFormat';

class PembayaranScreen extends Component {

  constructor(props) {
      super(props);
      
      //redux variable
      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        /*labels: [],
        datalist: [0],*/
       
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
        .from('kelas_pembayaran')
        .select('id, tanggal, nominal, keterangan')
        .eq('peserta_id', this.state.peserta_id)
    
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
            <Appbar.Content title="Pembayaran" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View>
                <List.Item
                  title={dateFormatSupa(item.tanggal)}
                  description={item.keterangan}
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{(index+1)}</Badge>}
                  right={() => <Subheading style={styleApp.Subheading}>{thousandFormat(item.nominal)}</Subheading>}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default PembayaranScreen;