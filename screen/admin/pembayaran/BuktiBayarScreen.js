import React, { Component } from 'react';
import { View, Alert, ScrollView, Image } from 'react-native';
import { Provider as PaperProvider, Appbar, Button, Portal, Modal, TouchableRipple, ActivityIndicator, } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
import ValidationComponent from 'react-native-form-validator';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

import supabase from '../../../config/supabase';
import Theme from '../../../config/Theme';
import Loading from '../../../component/Loading';

class BuktiBayarScreen extends ValidationComponent {

  constructor(props) {
      super(props);

      this.state = {
        bukti_bayar: null,
        bukti_bayarURL: null,
        isLoading: false,
      };
  }

  componentDidMount() {
      this.getData();

  }

  async getData() {
      this.setState({isLoading:true});

      //parameter
      let id = this.props.route.params.id;

      //query data supabase
      const { data, error } = await supabase
                                    .from('kelas_pembayaran')
                                    .select('*')
                                    .eq('id', id)
                                    .single();
                                    

      //get url image sampul
      let bukti_bayarURL = '';
      if(data.bukti_bayar != '') {
        const { signedURL } = await supabase
                                      .storage
                                      .from('hmd')
                                      .createSignedUrl('buktibayar/'+data.bukti_bayar, 60);
        bukti_bayarURL = signedURL;
      }

      this.setState({
                      
                      bukti_bayar: data.bukti_bayar,
                      bukti_bayarURL: bukti_bayarURL,
                      isLoading:false
                    });
  }

 

  async onOpenGallery() {
    this.setState({isLoading:true});

    //request akses galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showMessage({
        message: 'Akses galeri tidak diijinkan',
        type: 'danger',
        icon: 'danger',
      });

    } else {

      //buka galeri
      let fileImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      //jika close galeri
      if (fileImage.cancelled) {
        this.setState({isLoading:false});

      //proses upload
      } else {
      
        //ambil nama file & ekstensi (jpg/png)
        let fileData = fileImage.uri.split('/');
        let fileName = fileData[(fileData.length-1)];
        let fileNameData = fileName.split('.');
        let fileNameExt = fileNameData[1];

        //upload image ke supabase storage
        const { data, error } = await supabase
                                .storage
                                .from('hmd')
                                .upload('buktibayar/'+fileName, decode(fileImage.base64), {
                                     contentType: 'image/'+fileNameExt
                                })

        //get url image sampul
        const { signedURL } = await supabase
                                      .storage
                                      .from('hmd')
                                      .createSignedUrl('buktibayar/'+fileName, 60);
        let bukti_bayarURL = signedURL;

        //respon
        if(error != null) {
          showMessage({
            message: error,
            type: 'danger',
            icon: 'danger',
          });
        } else {
          //update sampul di table buku
          let id = this.props.route.params.id;
          const { data } = await supabase
                                        .from('kelas_pembayaran')
                                        .update([{
                                            bukti_bayar: fileName,
                                        }])
                                        .eq('id', id);

          showMessage({
            message: 'Gambar berhasil diupload',
            type: 'success',
            icon: 'success',
          });
        }

        this.setState({isLoading:false, bukti_bayarURL:bukti_bayarURL});
      }
      //end proses upload
    }

  }

  onDeleteConfirm() {
    Alert.alert(
      "Perhatian",
      "Gambar sampul akan dihapus",
      [
        { text: "Batal" },
        { text: "OK", onPress: () => this.onDelete() }
      ]
    );
  }

  async onDelete() {
      this.setState({isLoading:true});

      //ambil nama file
      let fileName = this.state.bukti_bayar;

      //hapus
      const { data, error } = await supabase
                              .storage
                              .from('hmd')
                              .remove(['buktibayar/'+fileName]);

      if(error != null) {
        showMessage({
          message: error,
          type: 'danger',
          icon: 'danger',
        });
      } else {
        //update sampul di table buku
        let id = this.props.route.params.id;
        const { data } = await supabase
                                      .from('kelas_pembayaran')
                                      .update([{
                                          bukti_bayar: null,
                                      }])
                                      .eq('id', id);

        showMessage({
          message: 'Gambar berhasil dihapus',
          type: 'success',
          icon: 'success',
        });
      }
      
      this.setState({isLoading:false, bukti_bayarURL:null});
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Action icon="arrow-left" onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Bukti Pembayaran" /*subtitle={this.state.judul}*/ />
          </Appbar.Header>

          <ScrollView>

            {this.state.bukti_bayarURL != null ?
              <View style={{flex:1,alignItems:'center'}}>
                <TouchableRipple onPress={() => this.setState({displayBukti:true})}>
                  <Image source={{uri:this.state.bukti_bayarURL}} style={{width:250, height:250, margin:20}} />
                </TouchableRipple>

                <Button icon="delete" mode="outlined" color="grey" onPress={() => this.onDeleteConfirm()} style={{margin:10}}>
                  Delete
                </Button>
              </View>
              :
              <View>
                <Button icon="image" mode="contained" color={Theme.colors.primary} onPress={() => this.onOpenGallery()} style={{margin:10}}>
                  Upload Galeri
                </Button>
              </View>
            }

          </ScrollView>

          <Portal>
            <Modal visible={this.state.displayBukti} onDismiss={() => this.setState({displayBukti:false})} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
              <Image source={{uri:this.state.bukti_bayarURL}} style={{width:400, height:500}} />
            </Modal>
          </Portal>

          <Portal>
            <Modal visible={this.state.isLoading}>
              <ActivityIndicator akategori_idating={true} size="large" color={Theme.colors.primary} />
            </Modal>
          </Portal>
        </PaperProvider>
      )
  }
}

export default BuktiBayarScreen;
