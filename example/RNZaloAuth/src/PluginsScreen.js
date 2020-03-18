import React, { Component, useState, createContext } from 'react';
import { Text, Alert, TouchableOpacity, Linking, View, ScrollView } from 'react-native';
import RNZaloSDK from 'rn-zalo';
import { TextInput } from 'react-native-gesture-handler';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                link: '',
                message: '',
                zdict: '',
                link_title: '',
                link_desc: '',
                link_thumb: '',
                link_source: '',
            },
        };
    }

    onError = e => {
        if (e === 'Not authentication') {
            Alert.alert('Ngưởi dùng chưa login.\nHãy vào Oauth > Login Login Zalo');
        }
    };

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
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={link => this.setState({ data: { ...this.state.data, link } })}
                        value={this.state.data.link}
                        placeholder="link (https://vnexpress.net, ....)"
                        testID="ed_link"
                        accessibilityLabel="ed_link"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={message => this.setState({ data: { ...this.state.data, message } })}
                        value={this.state.data.message}
                        placeholder="Nhập tin nhắn"
                        testID="ed_message"
                        accessibilityLabel="ed_message"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={zdict => this.setState({ data: { ...this.state.data, zdict } })}
                        value={this.state.data.zdict}
                        placeholder="ZDict"
                        testID="ed_zdict"
                        accessibilityLabel="ed_zdict"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={link_title => this.setState({ data: { ...this.state.data, link_title } })}
                        value={this.state.data.link_title}
                        placeholder="Nhập title của link"
                        testID="ed_title_link"
                        accessibilityLabel="ed_title_link"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={link_desc => this.setState({ data: { ...this.state.data, link_desc } })}
                        value={this.state.data.message}
                        placeholder="Nhập mô tả của link"
                        testID="ed_link_desc"
                        accessibilityLabel="ed_link_desc"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={link_thumb => this.setState({ data: { ...this.state.data, link_thumb } })}
                        value={this.state.data.link_thumb}
                        placeholder="Nhập ảnh thumb của link"
                        testID="ed_link_thumb"
                        accessibilityLabel="ed_link_thumb"
                    />
                    <TextInput
                        style={styles.editTextUI}
                        onChangeText={link_source => this.setState({ data: { ...this.state.data, link_source } })}
                        value={this.state.data.link_source}
                        placeholder="Nhập nguồn của link"
                        testID="ed_link_source"
                        accessibilityLabel="ed_link_source"
                    />
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_share_message"
                        accessibilityLabel="btn_share_message"
                        onPress={() => {
                            const { data } = this.state;
                            RNZaloSDK.shareMessage(data.message, 'ZaloSDK Demo', data.link, data)
                                .then(d => {
                                    this.setState({ ...d, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
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
                            const { data } = this.state;
                            RNZaloSDK.shareFeed(data.message, 'ZaloSDK Demo', data.link, data)
                                .then(d => {
                                    this.setState({ ...d, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Shared Feed</Text>
                    </TouchableOpacity>
                    <View style={{ ...styles.bodyUIFoot, marginBottom: 100 }}>
                        <Text>State: </Text>
                        {Array.from(Object.entries(this.state)).map(data => {
                            if (data[0] === 'oauth_code') {
                                return null;
                            } else {
                                return <Text>{'' + data[0] + ':' + JSON.stringify(data[1], null, 2)}</Text>;
                            }
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

ProfileScreen.defaultProps = {
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
