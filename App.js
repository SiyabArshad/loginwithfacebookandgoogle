import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { StyleSheet, Text, View, Image, TouchableOpacity,Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "21943849xxxxxxxxxcontent.com",//place your google web client id
    iosClientId: "219xxxxxxxxxxxxogleusercontent.com",//place your google ios client id
    androidClientId: "21943849xxxxxxxxxsercontent.com"//place your google android client id
  });
  const [request2, response2, promptAsync2] = Facebook.useAuthRequest({
    clientId: "xxxxxxx",//place your facebook id here
  });

  React.useEffect(() => {
    if(response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
    if (response2 && response2.type === "success" && response2.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response2.authentication.accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      })();
    }
  }, [response, accessToken,response2])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const useInfo = await response.json();
    setUser(useInfo);
  }

  const ShowUserInfo = () => {
    if(user) {
      return(
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
          <Image source={{uri: user.picture}} style={{width: 100, height: 100, borderRadius: 50}} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.name}</Text>
        </View>
      )
    }
  }  

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null &&
          <>
          <Text style={{fontSize: 35, fontWeight: 'bold'}}>Welcome</Text>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray'}}>Please login</Text>
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
            }} 
        >
          <Image source={require("./btn.png")} style={{width: 300, height: 40}} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!request2}
          onPress={() => {
            promptAsync2();
            }} 
            style={{marginTop:10}}
        >
          <Image source={require("./login-button-png-18026.png")} style={{width: 300, height: 40}} />
        </TouchableOpacity>
   
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
