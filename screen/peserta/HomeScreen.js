import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList} from 'react-native';
import { Provider as PaperProvider, Appbar, Subheading, Title, Headline, Modal, Divider, List, Badge, IconButton, Menu } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import supabase from '../../config/supabase';
import Theme from '../../config/Theme';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp';

const windowWidth = Dimensions.get('window').width;

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
       data: [],

       openMenu: false,
       
      }
  }

  componentDidMount() {  
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getDataPeserta();
      this.getDataKelas();
    });
     
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getDataPeserta() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let { data, error} = await supabase
          .from('peserta')
          .select('id, nama, email')
          .eq('id', this.state.peserta_id)
          .single(); 

    this.setState({
      nama:data.nama, 
      email:data.email, 
    });

  }

  async getDataKelas() {

    let { data, error} = await supabase
          .from('kelas_peserta')
          .select('id, kelas_id, kelas:kelas_id (nama), pelatihan:pelatihan_id (nama)')
          .eq('peserta_id', this.state.peserta_id)
          
    this.setState({data:data});

    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  onLogout() {
      //update redux
      store.dispatch({
          type: 'LOGIN',
          payload: { isLogin:false, tipe:'', peserta_id:'' }
      });
  }

  onMenuToggle() {
      this.setState({ openMenu: !this.state.openMenu });
  }




  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Content title="Home" />
            <Appbar.Action icon="dots-vertical" onPress={() => this.onMenuToggle()} />
          </Appbar.Header>

            <Menu
                visible={this.state.openMenu}
                onDismiss={() => this.onMenuToggle()}
                anchor={{ x:windowWidth, y:50 }}
            >
                <Menu.Item icon="account-key-outline" title="Reset Password" onPress={() => this.props.navigation.navigate('ResetPasswordScreen', {email:this.state.email})} />

                <Menu.Item icon="logout" title="Logout" onPress={() => this.onLogout()} />
            </Menu>

            <View style={{ justifyContent: 'center', alignItems:'center', marginVertical:10}}>
              <Title>{this.state.nama}</Title>
              <Subheading>{this.state.email}</Subheading>

            </View>
            <Divider style={{ marginTop: 5 }} />

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
                  //onPress={() => this.goToKehadiranTab(item.kelas_id)}
                  onPress={() => this.props.navigation.navigate('Kehadiran', { screen: 'KehadiranKelasScreen', params: { kelas_id:item.kelas_id } } )}
                />
                <Divider />
              </View>
            )}
          />

        </PaperProvider>
      )
  }
}

export default HomeScreen;