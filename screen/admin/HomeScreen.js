import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList } from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, ProgressBar, Colors, List, Badge, Divider } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import supabase from '../../config/supabase';
import Theme from '../../config/Theme';
import store from '../../config/storeApp';

class HomeScreen extends Component {

  constructor(props) {
      super(props);
      
      //redux variable
      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,

       dataList: [],

      }
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
      
      
      let { data, error } = await supabase
        .rpc('total_pertemuan_laporan')

      data.map((doc,row) => {
        let progress = doc.pertemuan/doc.total_pertemuan;
        data[row].progress = parseFloat(progress.toFixed(2));
      })
      
      this.setState({dataList:data});

      store.dispatch({
          type: 'LOADING',
          payload: { isLoading:false }
      });
  }

  async onLogout() {
    const { error } = supabase.auth.signOut()

    if(error) {
      showMessage({
          message: error.message,
          icon: 'warning',
          backgroundColor: 'red',
          color: theme.colors.background,
        });

    } else {
      const updateUser = await supabase
      //update redux
      store.dispatch({
          type: 'LOGIN',
          payload: { isLogin:false, tipe:'', peserta_id:'' }
      });
    }

  }

  /*onLogout() {
      //update redux
      store.dispatch({
          type: 'LOGIN',
          payload: { isLogin:false, tipe:'', peserta_id:'' }
      });
  }
*/
  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Content title="Home" />
            <Appbar.Action icon="power" onPress={() => this.onLogout()} />
          </Appbar.Header>

          <List.Item
            title='Kelas Pertemuan'
            
          />
          <Divider />

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={this.state.dataList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <List.Item
                  title={item.kelas_nama}
                  description={item.pelatihan_nama}
                  left={props => <Badge style={{ backgroundColor:Theme.colors.primary, margin: 10 }} size={35}>{item.kelas_nama.charAt(0)}</Badge>}
                  right={() => <Subheading>{item.pertemuan+'/'+item.total_pertemuan}</Subheading>}
                  onPress={() => this.props.navigation.navigate('Kehadiran', { screen: 'KelasKehadiranScreen', params: { kelas_id:item.kelas_id, kelas_nama:item.kelas_nama  } } )}
                />
                <ProgressBar progress={item.progress} color={Theme.colors.primary} style={{ marginHorizontal:10, height:10 }} />
              </View>
            )}
          />
          

        </PaperProvider>
      )
  }
}

export default HomeScreen;