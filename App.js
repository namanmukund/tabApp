import * as React from 'react'
import UserForm from './pages/UserForm'
import UserDetail from './pages/UserDetail'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator()

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="UserForm">
      <Stack.Screen
        name="UserForm"
        component={UserForm}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetail}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  </NavigationContainer>
)

export default App
