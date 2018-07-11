import React from 'react'
import { Text, View } from 'react-native'

class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    static navigationOptions = {
        headerTransparent: true,
        headerLeft: null

    }

    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text>asdfadsfa</Text>
            </View>
        )
    }


}

module.exports = Home