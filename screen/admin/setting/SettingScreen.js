import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Portal, Modal, ActivityIndicator, Button, Divider} from 'react-native-paper';

import Theme from '../../../config/Theme';

class SettingScreen extends Component {

  constructor(props) {
      super(props);
  }

  render() {
      return (
        <PaperProvider theme={Theme}>
          <Appbar.Header>
            <Appbar.Content title="Setting" />
          </Appbar.Header>

          <ScrollView>
          <List.Section>
              <List.Item
                key={0}
                title="Kelas"
                left={props => <List.Icon icon="home-circle-outline" />}
                right={props => <List.Icon icon="arrow-right" />}
                onPress={() => this.props.navigation.navigate('KelasScreen')}
              />
              <Divider />
              <List.Item
                key={1}
                title="Peserta"
                left={props => <List.Icon icon="account-group-outline" />}
                right={props => <List.Icon icon="arrow-right" />}
                onPress={() => this.props.navigation.navigate('PesertaScreen')}
              />
              <Divider />
              <List.Item
                key={2}
                title="Pelatihan"
                left={props => <List.Icon icon="book-account-outline" />}
                right={props => <List.Icon icon="arrow-right" />}
                onPress={() => this.props.navigation.navigate('PelatihanScreen')}
              />
              <Divider />
          </List.Section>
          </ScrollView>

        </PaperProvider>
      )
  }
}

export default SettingScreen;