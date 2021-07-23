import * as React from 'react';
import { StyleSheet } from 'react-native';
import Theme from './Theme';

export default StyleSheet.create({
  Appbar: {
    backgroundColor: Theme.colors.background,
  },
  AppbarBack: {
    marginRight: -10,
  },
  FlatList: {
    backgroundColor: Theme.colors.background,
  },
  TextInput: {
    marginHorizontal:10,
    backgroundColor: Theme.colors.background,
  },
  HelperText: {
    marginHorizontal:10,
  },
  Button: {
  	margin:10,
    //borderRadius:20,
  },
  ButtonDelete: {
    marginHorizontal:10,
    //borderRadius:20,
  },
  FAB: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Theme.colors.primary
  },
  Chip: {
    borderColor: Theme.colors.primary,
    margin: 5,
    height:35
  },
  ChipSelected: {
    backgroundColor: Theme.colors.primary,
    margin: 5,
    height:35
  },
  ChipTextSelected: {
    color: Theme.colors.background,
  },
  Caption: {
    fontSize: 14,
  },
  Subheading: {
    fontSize: 17, 
    textAlign: 'right',
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  SubheadingRed: {
    fontSize: 17, 
    textAlign: 'right',
    fontWeight: 'bold',
    color: 'red',
  },
  ScrollView: {
    backgroundColor: '#ffffff',
  }
});

