import React, { Component, useState, createContext } from 'react';
import { Text, Alert, TouchableOpacity, Linking, View, ScrollView } from 'react-native';
import RNZaloSDK from 'rn-zalo';
import { TextInput } from 'react-native-gesture-handler';
import LogStateView from './components/LogStateView';

const PluginsScreen = props => {
    const [state, setState] = useState({
        data: {
            link: '',
            message: '',
            zdict: '',
            link_title: '',
            link_desc: '',
            link_thumb: '',
            link_source: '',
        },
    });

    const onError = err => {
        if (err.error_message === 'Not authentication') {
            Alert.alert('Ngưởi dùng chưa login.\nHãy vào Oauth > Login Login Zalo');
        }
        if (err.error_code === -1024) {
            Alert.alert('Để dùng tính năng này cần phải install app Zalo ');
        }
        setState({ ...state, err, result: err });
    };

    const { buttonStyle, textStyle } = styles;
    const { is_show_top_bar, label, primary } = props;
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
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={link => setState({ ...state, data: { ...state.data, link } })}
                    value={state.data.link}
                    placeholder="link (https://vnexpress.net, ....)"
                    testID="ed_link"
                    accessibilityLabel="ed_link"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={message => setState({ ...state, data: { ...state.data, message } })}
                    value={state.data.message}
                    placeholder="Nhập tin nhắn"
                    testID="ed_message"
                    accessibilityLabel="ed_message"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={zdict => setState({ ...state, data: { ...state.data, zdict } })}
                    value={state.data.zdict}
                    placeholder="ZDict"
                    testID="ed_zdict"
                    accessibilityLabel="ed_zdict"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={link_title => setState({ ...state, data: { ...state.data, link_title } })}
                    value={state.data.link_title}
                    placeholder="Nhập title của link"
                    testID="ed_title_link"
                    accessibilityLabel="ed_title_link"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={link_desc => setState({ ...state, data: { ...state.data, link_desc } })}
                    value={state.data.message}
                    placeholder="Nhập mô tả của link"
                    testID="ed_link_desc"
                    accessibilityLabel="ed_link_desc"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={link_thumb => setState({ ...state, data: { ...state.data, link_thumb } })}
                    value={state.data.link_thumb}
                    placeholder="Nhập ảnh thumb của link"
                    testID="ed_link_thumb"
                    accessibilityLabel="ed_link_thumb"
                />
                <TextInput
                    style={styles.editTextUI}
                    onChangeText={link_source => setState({ ...state, data: { ...state.data, link_source } })}
                    value={state.data.link_source}
                    placeholder="Nhập nguồn của link"
                    testID="ed_link_source"
                    accessibilityLabel="ed_link_source"
                />
                <TouchableOpacity
                    style={buttonStyle}
                    testID="btn_share_message"
                    accessibilityLabel="btn_share_message"
                    onPress={() => {
                        const { data } = state;
                        RNZaloSDK.shareMessage(data.message, 'ZaloSDK Demo', data.link, data)
                            .then(d => {
                                setState({ ...state, ...d, err: null, result: d });
                            })
                            .catch(err => {
                                onError(err);
                            });
                    }}
                >
                    <Text style={textStyle}>Share message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={buttonStyle}
                    testID="btn_share_feed"
                    accessibilityLabel="btn_share_feed"
                    onPress={() => {
                        const { data } = state;
                        RNZaloSDK.shareFeed(data.message, 'ZaloSDK Demo', data.link, data)
                            .then(d => {
                                setState({ ...state, ...d, err: null, result: d });
                            })
                            .catch(err => {
                                onError(err);
                            });
                    }}
                >
                    <Text style={textStyle}>Shared Feed</Text>
                </TouchableOpacity>
                <LogStateView state={state.result} />
            </ScrollView>
        </View>
    );
};

PluginsScreen.defaultProps = {
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

export default PluginsScreen;
