import React, { Component } from 'react';
import { Text, Alert, TouchableOpacity, Linking, View, ScrollView } from 'react-native';
import RNZaloSDK from 'rn-zalo';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_get_profile"
                        onPress={() => {
                            RNZaloSDK.getProfile()
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Get profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_get_list_friend_used_app"
                        onPress={() => {
                            RNZaloSDK.getUserFriendListAtOffset(0, 999)
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Lấy danh sách friend đã sử dụng ứng dụng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_send_message_to_friend"
                        onPress={() => {
                            if (this.state['data'] === undefined || this.state.data.length === 0) {
                                Alert.alert('Xin hãy nhấn button "Lấy danh sách friend đã sử dụng ứng dụng "');
                                return;
                            }
                            RNZaloSDK.sendMessageTo(
                                this.state.data[0].id,
                                'Hello, use this app with me !!',
                                'https://developers.zalo.me/',
                            )
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Gửi tin nhắn cho friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_get_list_friend_invite"
                        onPress={() => {
                            RNZaloSDK.getUserInvitableFriendListAtOffset(0, 20)
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Lấy danh sách friend có thể mời</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_invite_friend_use_app"
                        onPress={() => {
                            if (this.state['data'] === undefined || this.state.data.length === 0) {
                                Alert.alert('Xin hãy nhấn button "Lấy danh sách friend có thể mời"');
                                return;
                            }
                            RNZaloSDK.sendAppRequestTo(this.state.data[0].id, 'Hello, use this app with me !!')
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Mời bạn sử dụng app</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_send_message_all_user_linked_OA"
                        onPress={() => {
                            if (this.state['data'] === undefined || this.state.data.length === 0) {
                                Alert.alert('Xin hãy nhấn button "Lấy danh sách friend đã sử dụng ứng dụng "');
                                return;
                            }
                            RNZaloSDK.sendOfficalAccountMessageWith(this.state.data[0].id, {})
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Gửi tin nhắn cho All Users được liên kết với Official Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={buttonStyle}
                        testID="btn_post_to_wall"
                        onPress={() => {
                            RNZaloSDK.postFeedWithMessage('Post from react native sdk', 'https://developers.zalo.me')
                                .then(data => {
                                    this.setState({ ...data, err: null });
                                })
                                .catch(err => {
                                    this.setState({ err });
                                    this.onError(err);
                                });
                        }}
                    >
                        <Text style={textStyle}>Post To Wall</Text>
                    </TouchableOpacity>
                    <View style={{ ...styles.bodyUIFoot, marginBottom: 100 }}>
                        <Text> Status: </Text>
                        {this.state.oauth_code === null || <Text testID="txt_status_login">Login</Text>}
                        <Text>Output: </Text>
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
