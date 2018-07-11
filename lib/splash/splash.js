import React, { Component } from 'react';
import {
  Text, TextInput, Platform, View,
  StyleSheet, Image, Button, Dimensions, StatusBar,
  ToastAndroid, TouchableOpacity,
  AsyncStorage, Alert
} from 'react-native';
var forge = require('node-forge')

const swidth = Dimensions.get('window').width;
const sheight = Dimensions.get('window').height;
const ACCOUNT_ID = 'USER_ID'
const PASSWORD = 'USER_PWD'
const COOKIEZ = 'cookiez'

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      userId: '',
      userPwd: '',
    }
  }

  static navigationOptions = {
    headerTransparent: true
  }

  componentWillMount() {

  }

  componentDidMount() {
    let account
    let password
    this._getAccountInfo(ACCOUNT_ID).then((value) => {
      account = value
    })
    this._getAccountInfo(PASSWORD).then((value) => {
      password = value
      if (account && password) {
        this._login(account, password)
      }
    })
    this.timer = setTimeout(() => {
      // ToastAndroid.show("3秒之后做的事情", ToastAndroid.LONG);
      this.setState((previousState) => {
        return { showLogin: !previousState.showLogin }
      })
    }, 3000)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    let show = this.state.showLogin ? this._renderLogin() : this._renderSplash()
    return (
      <View>
        {show}
      </View>
    );
  }

  _renderLogin() {
    return <View style={styles.loginContent}>
      <Text style={styles.LoginTitle}>登录账户</Text>
      <TextInput style={styles.loginInput} placeholder={'请输入登录账户'}
        placeholderTextColor={'#dadada'} underlineColorAndroid={'#999999'}
        onChangeText={(text) => {
          this.setState({ userId: text })
        }}></TextInput>
      <TextInput style={styles.loginInput} secureTextEntry={true} placeholder={'请输入密码'}
        placeholderTextColor={'#dadada'} underlineColorAndroid={'#999999'}
        tinColor={'#dadada'} onChangeText={(text) => {
          let md = forge.md.md5.create();
          md.update(password);
          text = md.digest().toHex();
          this.setState({ userPwd: text })
        }}></TextInput>
      <TouchableOpacity onPress={this._pressBtn.bind(this)}>
        <View style={styles.loginbtnout}>
          <Text style={styles.loginBtn}>登录</Text>
        </View>
      </TouchableOpacity>
    </View>
  }

  _pressBtn() {
    this._login(this.state.userId, this.state.userPwd)
  }

  _login(username, password) {
    fetch('https://designerapp.1sju.com/yishuju-back-end/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: username,
        password: password
      })
    }).then((res) =>
      res.json()
    ).then((responseJson) => {
      console.log(JSON.stringify(responseJson))
      ToastAndroid.show(responseJson.msg, ToastAndroid.LONG)
      if (responseJson.error_code == 'Y10000') {

        this._setAccountInfo(ACCOUNT_ID, responseJson.datas.userName);
        this._setAccountInfo(PASSWORD, responseJson.datas.password);
        this._setAccountInfo(COOKIEZ, responseJson.datas.cookiez)
        const { navigate } = this.props.navigation;
        // alert(JSON.stringify(this.props))
        navigate('Home')
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  _renderSplash() {
    return <View style={styles.content}>
      <StatusBar hidden={true}>
      </StatusBar>
      <View style={styles.container}>
        <Image
          style={styles.firstImage}
          source={require('../assets/welcome_head.png')}
        />
      </View>

      <View style={styles.another}>
        <Image
          style={styles.secondImage}
          source={require('../assets/welcome.png')}
        />
      </View>

    </View>
  }

  _getAccountInfo(key) {
    try {
      let pro
      AsyncStorage.getItem(key).then((value) => {
        // const jsonValue = JSON.parse(value)
        // alert(value)
        pro(value)
      });
      return new Promise((resolve) => {
        pro = resolve
      })
    } catch (error) {

    }

  }

  _setAccountInfo(key, value) {
    try {
      AsyncStorage.setItem(key, value).done(() => {
        console.log('存入成功')
      })

    } catch (error) {

    }
  }
}

const styles = StyleSheet.create({
  loginContent: {
    display: 'flex', backgroundColor: 'white', width: swidth, height: sheight, alignContent: 'center'
  },
  LoginTitle: {
    alignSelf: 'center',
    marginTop: (Platform.OS === 'ios') ? 10 : 20,
    marginBottom: 30
  },
  loginInput: {
    marginLeft: 50,
    marginRight: 50,
  },
  loginbtnout: {
    width: 255,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: '#dadada',
    margin: 10
  },
  loginBtn: {
    fontSize: 18,
    color: 'white'
  },
  content: {
    display: 'flex',
    backgroundColor: 'white',
    height: sheight,
    flexDirection: 'column'
  },
  another: {
    flex: 1,
    width: swidth,
    alignItems: 'center',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  container: {
    flex: 1,
    width: swidth,
    alignItems: 'flex-end'
  },
  firstImage: {
    width: 110,
    height: 110,
  },
  secondImage: {
    width: 160,
    height: 60
  },
});

module.exports = Splash;
