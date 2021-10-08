import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, List, Badge, IconButton, Divider} from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";
import * as Linking from 'expo-linking';

import supabase from '../../../config/supabase.js';
import Theme from '../../../config/Theme';
import store from '../../../config/storeApp';
import dateFormatSupa from '../../../component/dateFormatSupa';

class KehadiranKelasScreen extends Component {

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

    let kelas_id = this.props.route.params.kelas_id;
    
    let { data:kelas_kehadiran } = await supabase
          .from('kelas_kehadiran')
          .select('id, pertemuan, materi, materi_realisasi, tanggal_kehadiran, kelas(pelatihan_id)')
          .eq('kelas_id', kelas_id)
          .order('pertemuan', { ascending:true })
      
    kelas_kehadiran.map(async (doc, row) => {
      let {data:kehadiran, error} = await supabase
              .from('kelas_kehadiran_peserta')
              .select('status')
              .eq('kelas_kehadiran_id', doc.id)
              .eq('peserta_id', this.state.peserta_id)
              .single();

      kelas_kehadiran[row].status = kehadiran != null ? kehadiran.status : null;

      let {data:pelatihan_materi} = await supabase
              .from('pelatihan_materi')
              .select('materi_url')
              .eq('pelatihan_id', doc.kelas.pelatihan_id)
              .eq('pertemuan', doc.pertemuan)
              .single();

      kelas_kehadiran[row].materi_url = pelatihan_materi.materi_url;
      this.setState({kelas_kehadiran:kelas_kehadiran});
    });
    
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  onRight(item) {
    let iconStatus = '';
    let iconColor = '';
    
    if(item.status == true) {
      iconStatus = 'check-circle-outline';
      iconColor = 'green';
    } else if(item.status == false ) {
      iconStatus = 'close-circle-outline';
      iconColor = 'red';
    } else {
      iconStatus = 'timer-sand';
      iconColor = 'grey';
    }

    return(
      <View style={{ flexDirection: 'row' }}>
          <IconButton icon={iconStatus} size={28} color={iconColor}/>
          { item.materi_url != null &&
          <IconButton icon='download-circle-outline' size={28} color='green' onPress={() => Linking.openURL(item.materi_url)} />
          }
      </View>
    )
  }
  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.navigate('KehadiranScreen')} />
            <Appbar.Content title="Kehadiran" />
          </Appbar.Header>

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.kelas_kehadiran}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.materi_realisasi != null ? item.materi_realisasi : item.materi}
                  description={item.tanggal_kehadiran != null ? dateFormatSupa(item.tanggal_kehadiran) : '-' }
                  left={props => <Badge style={{ backgroundColor: Theme.colors.primary, margin: 10 }} size={35}>{item.pertemuan}</Badge>}
                  right={props =>  this.onRight(item)}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default KehadiranKelasScreen;