
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AddAccount from '../Stack/addAccount'
import AddVoucher from '../Stack/addVoucher'
import EditAccount from '../Stack/EditAccount'
import TabNavigator from "./Tab"


const Stack = createNativeStackNavigator();






function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MobileAccounting"
        component={TabNavigator}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="AddAccount"
        component={AddAccount}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="AddVoucher"
        component={AddVoucher}
        options={{
          headerShown: false
        }}
      />      
    </Stack.Navigator>
  )
}


export default StackNavigator