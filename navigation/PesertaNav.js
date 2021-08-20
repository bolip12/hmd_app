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
import HomeScreen from '../screen/peserta/HomeScreen';
import ResetPasswordScreen from '../screen/peserta/ResetPasswordScreen';

//kehadiran
import KehadiranScreen from '../screen/peserta/kehadiran/KehadiranScreen';
import KehadiranKelasScreen from '../screen/peserta/kehadiran/KehadiranKelasScreen';

//pembayaran
import PembayaranScreen from '../screen/peserta/pembayaran/PembayaranScreen';



export default function PesertaNav() {
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
							options={{
								tabBarLabel: 'Home',
								tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color={color} size={25} />)
							}}
						>
						{() => (
		              	<Stack.Navigator>
				                <Stack.Screen 
				                  name="HomeScreen"
				                  component={HomeScreen}
				                  options={{headerShown:false}}
				                />
				                <Stack.Screen 
				                  name="ResetPasswordScreen"
				                  component={ResetPasswordScreen}
				                  options={{headerShown:false}}
				                />
				                
										</Stack.Navigator>
						)}
		        </BottomTab.Screen>

						
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
				                  name="KehadiranKelasScreen"
				                  component={KehadiranKelasScreen}
				                  options={{headerShown:false}}
				                />
				                
										</Stack.Navigator>
						)}
		        </BottomTab.Screen>

		      	
						<BottomTab.Screen 
							name="PembayaranScreen"
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
                
                
							</Stack.Navigator>
						)}
		        </BottomTab.Screen>

	        
	    	</BottomTab.Navigator>
	    </NavigationContainer>
    </PaperProvider>
  );
}