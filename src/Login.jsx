import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { DataContext } from "./Context";
import { StackActions } from "@react-navigation/native";

export default function Login({ navigation }) {
  const dataContext = useContext(DataContext);
  const { setUserInfo, setGroupId } = dataContext;

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: EXPO_PUBLIC_WEB_CLIENT_ID,
      iosClientId: EXPO_PUBLIC_IOS_CLIENT_ID,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setGroupId(userInfo?.user?.id);
      if (userInfo?.user?.id) {
        navigation.dispatch(StackActions.replace("Home", { logout }));
      }
    } catch (e) {
      console.log("========>>>error", error);
    }
  };

  const logout = () => {
    setUserInfo(null);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    setGroupId(null);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
