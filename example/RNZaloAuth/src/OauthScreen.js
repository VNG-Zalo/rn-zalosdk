import React, { Component, useContext } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, AlertIOS, View } from 'react-native';
import RNZaloSDK, { ErrorCode, LoginType } from 'rn-zalo';
import { LoginProvider, LoginContext } from './Context/Login';
import LogStateView from './components/LogStateView';
import { ToastAndroid } from 'react-native';
import { Platform } from 'react-native';

const ShowToast = msg => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        Alert.alert(msg);
    }
};
const OauthScreen = props => {
    const [state, setState] = useContext(LoginContext);
    const { buttonStyle, textStyle } = styles;
    const { is_show_top_bar, label, primary } = props;
    const newButtonStyle = primary
        ? buttonStyle
        : [buttonStyle, { backgroundColor: '#f34541', borderBottomColor: '#a43532' }];

    const onError = err => {
        if (err.error_code === ErrorCode.ZaloApplicationNotInstalled) {
            Alert.alert('Để dùng tính năng này cần phải install app Zalo ');
        } else if (err.error_code === ErrorCode.ZaloOauthInvalid) {
            ShowToast('Validate failed');
        } else if (err.error_code === ErrorCode.UserBack) {
            ShowToast(err.error_message ? err.error_message : 'Login failed');
        } else {
            ShowToast(err.error_message ? err.error_message : 'Unknown error');
        }
        setState({ ...state, err });
    };
    return (
        <LoginProvider>
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
                        key="btn_oauth_by_app"
                        testID="btn_oauth_by_app"
                        accessibilityLabel="btn_oauth_by_app"
                        onPress={() => {
                            RNZaloSDK.login(LoginType.App)
                                .then(data => {
                                    setState(old_state => ({ ...old_state, ...data, err: null }));
                                    ShowToast('Login successed');
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via App</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_oauth_by_web"
                        testID="btn_oauth_by_web"
                        accessibilityLabel="btn_oauth_by_web"
                        onPress={() => {
                            RNZaloSDK.login(LoginType.Web)
                                .then(data => {
                                    setState(old_state => ({ ...old_state, ...data, err: null }));
                                    ShowToast('Login successed');
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via Web</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_oauth_by_web_or_app"
                        testID="btn_oauth_by_web_or_app"
                        accessibilityLabel="btn_oauth_by_web_or_app"
                        onPress={() => {
                            RNZaloSDK.login()
                                .then(data => {
                                    setState(old_state => ({ ...old_state, ...data, err: null }));
                                    ShowToast('Login successed');
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Zalo Via App or Web</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_login_form"
                        testID="btn_login_form"
                        accessibilityLabel="btn_login_form"
                        onPress={() => {
                            RNZaloSDK.startLoginForm()
                                .then(data => {
                                    setState({ ...state, ...data, err: null });
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Form</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_login_google_plus"
                        testID="btn_login_google_plus"
                        accessibilityLabel="btn_login_google_plus"
                        onPress={() => {
                            RNZaloSDK.startAuthenGooglePlus()
                                .then(data => {
                                    setState({ ...state, ...data, err: null });
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Google+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_login_facebook"
                        testID="btn_login_facebook"
                        accessibilityLabel="btn_login_facebook"
                        onPress={() => {
                            RNZaloSDK.startAuthenFacebook()
                                .then(data => {
                                    setState({ ...state, ...data, err: null });
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Login Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_register_zalo"
                        testID="btn_register_zalo"
                        accessibilityLabel="btn_register_zalo"
                        onPress={() => {
                            RNZaloSDK.registerZalo()
                                .then(data => {
                                    setState({ ...state, ...data, err: null });
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Register Zalo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_validate_oauth_code"
                        testID="btn_validate_oauth_code"
                        accessibilityLabel="btn_validate_oauth_code"
                        onPress={() => {
                            RNZaloSDK.isAuthenticate()
                                .then(data => {
                                    setState(old_state => ({ ...old_state, ...data, err: null }));
                                    ShowToast('Validate successed');
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Validate Oauth Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        key="btn_check_app_zalo_login"
                        testID="btn_check_app_zalo_login"
                        accessibilityLabel="btn_check_app_zalo_login"
                        onPress={() => {
                            RNZaloSDK.checkZaloLoginStatus()
                                .then(data => {
                                    setState({ ...state, ...data, err: null });
                                })
                                .catch(err => {
                                    onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Check App Zalo login</Text>
                    </TouchableOpacity>
                    <LogStateView state={state} />
                </ScrollView>
            </View>
        </LoginProvider>
    );
};

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

export default OauthScreen;
