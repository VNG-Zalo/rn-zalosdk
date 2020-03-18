import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, Linking, View } from 'react-native';
import RNZaloSDK from 'rn-zalo';

export default class OauthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oauth_code: null,
        };
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
                <ScrollView style={styles.bodyUI}>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_oauth_by_app"
                        accessibilityLabel="btn_oauth_by_app"
                        onPress={() => {
                            RNZaloSDK.login(1)
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({ err });
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via App</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_oauth_by_web"
                        accessibilityLabel="btn_oauth_by_web"
                        onPress={() => {
                            RNZaloSDK.login(2)
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({ err });
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via Web</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_oauth_by_web_or_app"
                        accessibilityLabel="btn_oauth_by_web_or_app"
                        onPress={() => {
                            RNZaloSDK.login()
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({ err });
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via App or Web</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle} testID="btn_register_zalo">
                        <Text style={textStyle}>Rgister Zalo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_validate_oauth_code"
                        accessibilityLabel="btn_validate_oauth_code"
                        onPress={() => {
                            RNZaloSDK.isAuthenticate()
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                });
                        }}
                    >
                        <Text style={textStyle}>Validate Oauth Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyle} testID="btn_check_app_zalo_login" onPress={() => {}}>
                        <Text style={textStyle}>Check App Zalo login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_oauth_logout"
                        accessibilityLabel="btn_oauth_logout"
                        onPress={() => {
                            RNZaloSDK.logout();
                            this.setState({ oauth_code: null });
                        }}
                    >
                        <Text style={textStyle}>Logout Zalo App</Text>
                    </TouchableOpacity>
                    <View style={styles.bodyUIFoot}>
                        <Text> Status: </Text>
                        {this.state.oauth_code === null || <Text testID="txt_status_login">Login</Text>}
                        <Text>Output: </Text>
                        {Array.from(Object.entries(this.state)).map(data => {
                            if (data[0] === 'oauth_code') {
                                return null;
                            } else {
                                return <Text> {'' + data[0] + ':' + JSON.stringify(data[1])} </Text>;
                            }
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

OauthScreen.defaultProps = {
    primary: true,
};

const styles = {
    bodyUIFoot: {
        backgroundColor: '#0ff',
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
