// import 'react-native-gesture-handler';
// import { enableScreens } from 'react-native-screens';
// enableScreens();
import React, { Component, useReducer, useState, useContext, useEffect } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { ScrollView, Image, Text, TouchableOpacity, Linking, View, Alert } from 'react-native';
import OauthScreen from './OauthScreen';
import ProfileScreen from './ProfileScreen';
import PluginsScreen from './PluginsScreen';
import TrackingScreen from './TrackingScreen';
import SettingsScreen from './SettingsScreen';
import RNZaloSDK from 'rn-zalo';
import Modal, { ModalButton, ModalContent, ModalFooter } from 'react-native-modals';
import BackIcon from '../images/back_chevron.png';

import { LoginProvider, LoginContext } from './Context/Login';
import LogStateView from './components/LogStateView';

const AppScreen = props => {
    return (
        <LoginProvider>
            <Router>
                <Scene key="root" backButtonImage={BackIcon}>
                    <Scene key="mainscreen" component={MainScreen} title="ZaloSDK Demo" />
                    <Scene key="oauth" component={OauthScreen} title="Oauth Demo" />
                    <Scene key="profile" component={ProfileScreen} title="Profile Demo" />
                    <Scene key="plugins" component={PluginsScreen} title="Plugins Demo" />
                    <Scene key="tracking" component={TrackingScreen} title="Traking Demo" />
                    <Scene key="settings" component={SettingsScreen} title="Settings Demo" />
                </Scene>
            </Router>
        </LoginProvider>
    );
};

const ButtonLogged = props => {
    const [visible, setVisible] = useState(false);
    const [state, setState] = useContext(LoginContext);
    useEffect(() => {
        if (state['user'] === null || Object.keys(state.user).length === 0) {
            RNZaloSDK.getProfile()
                .then(data => {
                    console.log('getprofile data', data);
                    setState({ ...state, ...data, loading: false });
                })
                .catch(err => {
                    props.onError(err);
                });
        }
        return () => {
            setState({
                data: [],
                user: {},
                oauth_code: null,
                loading: false,
            });
        };
    }, [state.oauth_code]);
    if (state['user'] === null || Object.keys(state.user).length === 0) {
        return null;
    }
    const { user } = state;
    return (
        <TouchableOpacity
            key="oauth"
            style={props.style}
            testID="btn_oauth"
            accessibilityLabel="btn_oauth"
            onPress={() => {
                setVisible(true);
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContext: 'center',
                }}
            >
                <Text
                    style={{
                        ...styles.textStyle,
                        textAlign: 'center',
                        alignSelf: 'center',
                        flex: 1,
                    }}
                >
                    Profile Info
                </Text>
                {user['picture'] && user.picture['data'] ? (
                    <Image style={{ flex: 0.2 }} source={{ uri: user.picture.data.url }} />
                ) : (
                    <Text>No picture</Text>
                )}
            </View>
            <Modal
                customBackdrop={<View style={{ flex: 1, backdropColor: 'white' }} />}
                height={0.3}
                width={0.9}
                rounded
                actionsBordered
                onTouchOutside={() => {
                    setVisible(false);
                }}
                visible={visible}
                modalTitle={null}
                footer={
                    <ModalFooter style={{ backgroundColor: 'white' }}>
                        <ModalButton
                            text="Logout"
                            bordered
                            key="button-2"
                            onPress={() => {
                                setVisible(false);
                                Alert.alert(
                                    'Xác nhận',
                                    'Bạn có muốn đăng xuất không?',
                                    [
                                        {
                                            text: 'Có',
                                            onPress: () => {
                                                RNZaloSDK.logout().then(() => {
                                                    setState({ oauth_code: null });
                                                });
                                            },
                                        },
                                        { text: 'Không', onPress: () => {} },
                                    ],
                                    { cancelable: true },
                                );
                            }}
                        />
                        <ModalButton key="button-1" bordered text="Cancel" onPress={() => setVisible(false)} />
                    </ModalFooter>
                }
            >
                <ModalContent
                    style={{
                        flex: 1,
                        backgroundColor: 'white',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 25,
                            fontWeight: '500',
                            color: '#000',
                            textAlign: 'left',
                            paddingBottom: 10,
                        }}
                    >
                        User profile
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image style={{ width: 100, height: 100 }} source={{ uri: user.picture.data.url }} />
                        <View style={{ flex: 0.9, flewDirection: 'column' }}>
                            <Text>{user.name}</Text>
                            <Text>{user.id}</Text>
                        </View>
                    </View>
                </ModalContent>
            </Modal>
        </TouchableOpacity>
    );
};

const MainScreen = props => {
    const [state, setState] = useContext(LoginContext);
    const onError = err => {
        if (err === 'Not authentication') {
            Alert.alert('Ngưởi dùng chưa login.\nHãy vào Oauth > Login Login Zalo');
        }
        setState(old_state => ({ ...old_state, err, loading: false }));
    };

    useEffect(() => {
        if (false && state.oauth_code === null) {
            RNZaloSDK.login(0)
                .then(login_data => {
                    RNZaloSDK.getProfile()
                        .then(data => {
                            console.log('load data', data);
                            setState(old_state => ({ ...old_state, ...login_data, ...data, loading: false }));
                        })
                        .catch(err => {
                            onError(err);
                        });
                })
                .catch(err => {
                    onError(err);
                });
        }
        RNZaloSDK.getSettings()
            .then(data => {
                console.log('getSettings data', data);
                setState({ ...state, ...data, loading: false });
            })
            .catch(err => {
                onError(err);
            });
    }, []);

    const { buttonStyle, textStyle } = styles;
    const { is_show_top_bar, label, primary } = props;
    const newButtonStyle = primary
        ? buttonStyle
        : [buttonStyle, { backgroundColor: '#f34541', borderBottomColor: '#a43532' }];
    if (state.loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 30,
                    }}
                >
                    Loading ...
                </Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container}>
            {state['oauth_code'] && state.oauth_code !== null ? (
                <ButtonLogged style={buttonStyle} key="btn_loggedin" />
            ) : null}
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
            <LogStateView state={state} />
        </ScrollView>
    );
};

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
