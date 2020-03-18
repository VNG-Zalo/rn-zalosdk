// import 'react-native-gesture-handler';
// import { enableScreens } from 'react-native-screens';
// enableScreens();
import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { Text, TouchableOpacity, Linking, View, Alert } from 'react-native';
import OauthScreen from './OauthScreen';
import ProfileScreen from './ProfileScreen';
import PluginsScreen from './PluginsScreen';
import TrackingScreen from './TrackingScreen';
import SettingsScreen from './SettingsScreen';
import RNZaloSDK from 'rn-zalo';

class AppScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="mainscreen" component={MainScreen} title="ZaloSDK Demo" />
                    <Scene key="oauth" component={OauthScreen} title="Oauth Demo" />
                    <Scene key="profile" component={ProfileScreen} title="Profile Demo" />
                    <Scene key="plugins" component={PluginsScreen} title="Plugins Demo" />
                    <Scene key="tracking" component={TrackingScreen} title="Traking Demo" />
                    <Scene key="settings" component={SettingsScreen} title="Settings Demo" />
                </Scene>
            </Router>
        );
    }
}

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onError = err => {
        if (err === 'Not authentication') {
            Alert.alert('Ngưởi dùng chưa login.\nHãy vào Oauth > Login Login Zalo');
        }
        this.setState({ err });
    };

    componentDidMount() {
        RNZaloSDK.getSettings()
            .then(data => {
                this.setState({ ...data });
            })
            .then(err => {
                this.onError(err);
            });
    }

    render() {
        const { buttonStyle, textStyle } = styles;
        const { is_show_top_bar, label, primary } = this.props;
        const newButtonStyle = primary
            ? buttonStyle
            : [buttonStyle, { backgroundColor: '#f34541', borderBottomColor: '#a43532' }];
        return (
            <View style={styles.container}>
                {is_show_top_bar ? (
                    <View style={styles.topBar}>
                        <Text style={styles.topBarTextStyle} testID="txt_top_bar">
                            ZaloSDK Demo
                        </Text>
                    </View>
                ) : null}
                <View style={styles.bodyUI}>
                    <TouchableOpacity
                        key="oauth"
                        style={buttonStyle}
                        testID="btn_oauth"
                        accessibilityLabel="btn_oauth"
                        onPress={() => {
                            Actions.oauth();
                        }}
                    >
                        <Text style={textStyle}>Oauth</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="profile"
                        style={buttonStyle}
                        testID="btn_profile"
                        accessibilityLabel="btn_profile"
                        onPress={() => {
                            Actions.profile();
                        }}
                    >
                        <Text style={textStyle}>Profile - Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="plugins"
                        style={buttonStyle}
                        testID="btn_plugins"
                        accessibilityLabel="btn_plugins"
                        onPress={() => {
                            Actions.plugins();
                        }}
                    >
                        <Text style={textStyle}>Plugins</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key="tracking"
                        style={buttonStyle}
                        testID="btn_tracking"
                        accessibilityLabel="btn_tracking"
                        onPress={() => {
                            Actions.tracking();
                        }}
                    >
                        <Text style={textStyle}>Tracking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_settings"
                        accessibilityLabel="btn_settings"
                        onPress={() => {
                            Actions.settings();
                        }}
                    >
                        <Text style={textStyle}>Settings</Text>
                    </TouchableOpacity>
                    {false && (
                        <TouchableOpacity style={buttonStyle}>
                            <Text style={textStyle}>Wakeup</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ ...styles.bodyUIFoot, marginBottom: 100 }}>
                        <Text>State: </Text>
                        {Array.from(Object.entries(this.state)).map(data => (
                            <View
                                key={data[0]}
                                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                <Text>{'' + data[0]}</Text>
                                <Text>{JSON.stringify(data[1], null, 2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }
}

MainScreen.defaultProps = {
    primary: true,
    is_show_top_bar: false,
};

const styles = {
    bodyUIFoot: {
        backgroundColor: '#0ff',
        flex: 1,
        flexDirection: 'column',
    },
    bodyUI: {
        paddingTop: 10,
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    topBar: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#00bfff',
        height: 80,
        paddingBottom: 5,
    },
    topBarTextStyle: {
        color: '#000',
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
    },
    textStyle: {
        color: '#000',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
    },
    buttonStyle: {
        height: 45,
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#00bfff',
        borderWidth: 1,
        margin: 8,
    },
};

export default AppScreen;
