import React from 'react';

//stack
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

//bottom tab
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const BottomTab = createMaterialBottomTabNavigator();

//template
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from '../config/Theme';

//home
import HomeScreen from '../screen/admin/HomeScreen';

//kehadiran
import KehadiranScreen from '../screen/admin/kehadiran/KehadiranScreen';
import KelasKehadiranScreen from '../screen/admin/kehadiran/KelasKehadiranScreen';
import KelasKehadiranUpdateScreen from '../screen/admin/kehadiran/KelasKehadiranUpdateScreen';
import KelasKehadiranPesertaScreen from '../screen/admin/kehadiran/KelasKehadiranPesertaScreen';

//pembayaran
import PembayaranScreen from '../screen/admin/pembayaran/PembayaranScreen';
import KelasPesertaScreen from '../screen/admin/pembayaran/KelasPesertaScreen';
import KelasPembayaranScreen from '../screen/admin/pembayaran/KelasPembayaranScreen';
import KelasPembayaranInsertScreen from '../screen/admin/pembayaran/KelasPembayaranInsertScreen';
import KelasPembayaranUpdateScreen from '../screen/admin/pembayaran/KelasPembayaranUpdateScreen';
import BuktiBayarScreen from '../screen/admin/pembayaran/BuktiBayarScreen';

//screen setting: single table
import SettingScreen from '../screen/admin/setting/SettingScreen';
import KelasScreen from '../screen/admin/setting/KelasScreen';
import KelasInsertScreen from '../screen/admin/setting/KelasInsertScreen';
import KelasUpdateScreen from '../screen/admin/setting/KelasUpdateScreen';
import PesertaKelasScreen from '../screen/admin/setting/PesertaKelasScreen';
import PesertaKelasInsertScreen from '../screen/admin/setting/PesertaKelasInsertScreen';


import PesertaScreen from '../screen/admin/setting/PesertaScreen';
import PesertaInsertScreen from '../screen/admin/setting/PesertaInsertScreen';
import PesertaUpdateScreen from '../screen/admin/setting/PesertaUpdateScreen';
import PesertaResetPasswordScreen from '../screen/admin/setting/PesertaResetPasswordScreen';


import PelatihanScreen from '../screen/admin/setting/PelatihanScreen';
import PelatihanMateriScreen from '../screen/admin/setting/PelatihanMateriScreen';
import PelatihanMateriInsertScreen from '../screen/admin/setting/PelatihanMateriInsertScreen';
import PelatihanMateriUpdateScreen from '../screen/admin/setting/PelatihanMateriUpdateScreen';

export default function AdminNav() {
  return (
  	<PaperProvider theme={Theme}>
	    <NavigationContainer>
	      	<BottomTab.Navigator
	      		activeColor="black"
	          	inactiveColor="grey"
	          	barStyle={{backgroundColor:Theme.colors.primary}}
	          	shifting={false}
	        >

	        	<BottomTab.Screen
							name="Home"
							component={HomeScreen}
							options={{
								tabBarLabel: 'Home',
								tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color={color} size={25} />)
							}}
						/>
						
						
						<BottomTab.Screen
							name="Kehadiran"
							options={{
								tabBarLabel: 'Kehadiran',
								tabBarIcon: ({color}) => (<MaterialCommunityIcons name="clipboard-check-outline" color={color} size={25} />)
							}}
						>
						{() => (
		              	<Stack.Navigator>
				                <Stack.Screen
				                  name="KehadiranScreen"
				                  component={KehadiranScreen}
				                  options={{headerShown:false}}
				                />
				                <Stack.Screen
				                  name="KelasKehadiranScreen"
				                  component={KelasKehadiranScreen}
				                  options={{headerShown:false}}
				                />
				                <Stack.Screen
				                  name="KelasKehadiranUpdateScreen"
				                  component={KelasKehadiranUpdateScreen}
				                  options={{headerShown:false}}
				                />
				                <Stack.Screen
				                  name="KelasKehadiranPesertaScreen"
				                  component={KelasKehadiranPesertaScreen}
				                  options={{headerShown:false}}
				                />


										</Stack.Navigator>
						)}
		        </BottomTab.Screen>

		      	
						<BottomTab.Screen 
							name="Pembayaran"
							options={{
								tabBarLabel: 'Pembayaran',
								tabBarIcon: ({color}) => (<MaterialCommunityIcons name="credit-card-outline" color={color} size={25} />)
							}}
						>
						{() => (
          		<Stack.Navigator>
                <Stack.Screen
                  name="PembayaranScreen"
                  component={PembayaranScreen}
                  options={{headerShown:false}}
                />
                <Stack.Screen
                  name="KelasPesertaScreen"
                  component={KelasPesertaScreen}
                  options={{headerShown:false}}
                />
                <Stack.Screen
                  name="KelasPembayaranScreen"
                  component={KelasPembayaranScreen}
                  options={{headerShown:false}}
                />
                <Stack.Screen
                  name="KelasPembayaranInsertScreen"
                  component={KelasPembayaranInsertScreen}
                  options={{headerShown:false}}
                />
                <Stack.Screen
                  name="KelasPembayaranUpdateScreen"
                  component={KelasPembayaranUpdateScreen}
                  options={{headerShown:false}}
                />
                <Stack.Screen
                  name="BuktiBayarScreen"
                  component={BuktiBayarScreen}
                  options={{headerShown:false}}
                />
							</Stack.Navigator>
						)}
		        </BottomTab.Screen>

	        	{/*tab setting*/}
	        	<BottomTab.Screen 
									name="Setting"
									options={{
										tabBarLabel: 'Setting',
										tabBarIcon: ({color}) => (<MaterialCommunityIcons name="cog" color={color} size={25} />)
									}}
								>
								{() => (
              		<Stack.Navigator>
              			<Stack.Screen
		                  name="SettingScreen"
		                  component={SettingScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="KelasScreen"
		                  component={KelasScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="KelasInsertScreen"
		                  component={KelasInsertScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="KelasUpdateScreen"
		                  component={KelasUpdateScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PelatihanScreen"
		                  component={PelatihanScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PelatihanMateriScreen"
		                  component={PelatihanMateriScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PelatihanMateriInsertScreen"
		                  component={PelatihanMateriInsertScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PelatihanMateriUpdateScreen"
		                  component={PelatihanMateriUpdateScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaScreen"
		                  component={PesertaScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaInsertScreen"
		                  component={PesertaInsertScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaUpdateScreen"
		                  component={PesertaUpdateScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaResetPasswordScreen"
		                  component={PesertaResetPasswordScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaKelasScreen"
		                  component={PesertaKelasScreen}
		                  options={{headerShown:false}}
		                />
		                <Stack.Screen
		                  name="PesertaKelasInsertScreen"
		                  component={PesertaKelasInsertScreen}
		                  options={{headerShown:false}}
		                />

									</Stack.Navigator>
								)}
          </BottomTab.Screen>

	    	</BottomTab.Navigator>
	    </NavigationContainer>
    </PaperProvider>
  );
}
