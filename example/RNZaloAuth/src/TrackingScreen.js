import React, { Component, useState, createContext, useContext, useEffect } from 'react';
import { Text, Alert, TouchableOpacity, Linking, View, ScrollView } from 'react-native';
import RNZaloSDK from 'rn-zalo';
import { TextInput } from 'react-native-gesture-handler';
import { LoginContext } from './Context/Login';
import LogStateView from './components/LogStateView';

const TrackingScreen = props => {
    const [state, setState] = useContext(LoginContext);
    // ;const [state, setState] = useState({});

    const onError = err => {
        if (err === 'Not authentication') {
            Alert.alert('Ngưởi dùng chưa login.\nHãy vào Oauth > Login Login Zalo');
        }
        setState({ ...state, err });
    };

    useEffect(() => {
        RNZaloSDK.getDeviceID()
            .then(d => {
                setState({ ...state, ...d, err: null });
            })
            .catch(err => {
                onError(err);
            });
    }, []);

    const { buttonStyle, textStyle } = styles;
    return (
        <View style={styles.container}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                style={styles.bodyUI}
                contentContainerStyle={{ flexShrink: 1, justifyContent: 'space-between' }}
            >
                <TouchableOpacity
                    style={buttonStyle}
                    testID="btn_get_deviceid"
                    accessibilityLabel="btn_get_deviceid"
                    onPress={() => {
                        const { device_id } = state;
                        Alert.alert('Device id: \n' + device_id);
                    }}
                >
                    <Text
                        style={{
                            ...textStyle,
                            height: '100%',
                            alignContent: 'stretch',
                            alignSelf: 'stretch',
                            fontSize: 20,
                        }}
                    >
                        Get Device ID
                    </Text>
                </TouchableOpacity>
                <View style={{ ...styles.bodyUIFoot, marginBottom: 100 }}>
                    <Text style={textStyle}> Info: </Text>
                    {state['device_id'] === null || (
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{'Device id:'}</Text>
                            <Text testID="txt_status_device_id" accessibilityLabel="txt_status_device_id">
                                {String(state.device_id).substr(0, 20)}
                            </Text>
                        </View>
                    )}
                    <Text style={textStyle}>Events: </Text>
                    {state['events'] &&
                        Array.from(Object.entries(state['events'])).map(data => {
                            return <Text key={data[0]}>{'' + data[0] + ':' + JSON.stringify(data[1], null, 2)}</Text>;
                        })}
                    <LogStateView state={state} />
                </View>
            </ScrollView>
        </View>
    );
};

TrackingScreen.defaultProps = {
    primary: true,
    is_show_top_bar: false,
};

const styles = {
    editTextUI: {
        height: 45,
        alignSelf: 'stretch',
        justifyContent: 'center',
        //  backgroundColor: '#00bfff',
        borderWidth: 1,
        margin: 8,
    },
    bodyUIFoot: {
        marginTop: 10,
        flex: 1,
        backgroundColor: '#0ff',
        flexDirection: 'column',
    },
    bodyUI: {
        marginTop: 10,
        padding: 5,
        height: '100%',
        width: '100%',
    },
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
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
        alignSelf: 'flex-start',
        color: '#000',
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
    },
    textStyle: {
        alignSelf: 'flex-start',
        color: '#000',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonStyle: {
        flex: 1,
        height: '3%',
        justifyContent: 'center',
        backgroundColor: '#00bfff',
        borderWidth: 2,
        padding: 5,
    },
};

export default TrackingScreen;
