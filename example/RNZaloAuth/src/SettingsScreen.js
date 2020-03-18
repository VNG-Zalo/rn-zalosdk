import React, { Component, useState, createContext } from 'react';
import { Text, Alert, TouchableOpacity, Linking, View, ScrollView } from 'react-native';
import RNZaloSDK from 'rn-zalo';
import { TextInput } from 'react-native-gesture-handler';

const SettingList = props => <View style={styles.settingList}>{props.children}</View>;
const SettingContainer = props => <View style={styles.settingContainer}>{props.children}</View>;
const SettingListItem = props => <View style={styles.settingListItem}>{props.children}</View>;
const SettingLabel = props => (
    <Text style={styles.textStyle} {...props}>
        {props.children}
    </Text>
);

export default class SettingsScreen extends Component {
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
        return (
            <View style={styles.settingContainer}>
                <SettingList>
                    <SettingListItem>
                        <SettingLabel>Wakeup interval </SettingLabel>
                        <Text testID="txt_wakeup_interval" accessibilityLabel="txt_wakeup_interval">
                            {this.state['wakeup_interval'] !== null ? this.state.wakeup_interval : '#nan'}
                        </Text>
                    </SettingListItem>
                    <SettingListItem>
                        <SettingLabel> Is out app login ( by WebBrower )</SettingLabel>
                        <Text testID="txt_is_login_via_browser" accessibilityLabel="txt_is_login_via_browser">
                            {this.state['is_login_via_browser'] !== null
                                ? '' + this.state.is_login_via_browser
                                : '#nan'}
                        </Text>
                    </SettingListItem>
                    <SettingListItem>
                        <SettingLabel> Use web view if zalo app not login </SettingLabel>
                        <Text testID="txt_is_use_webview_login_zalo" accessibilityLabel="txt_is_use_webview_login_zalo">
                            {this.state['is_use_webview_login_zalo'] !== null
                                ? '' + this.state.is_use_webview_login_zalo
                                : '#nan'}
                        </Text>
                    </SettingListItem>
                    <SettingListItem>
                        <SettingLabel> Expire date </SettingLabel>
                        <Text testID="txt_expire_date" accessibilityLabel="txt_expire_date">
                            {this.state['expire_date'] !== null
                                ? new Date(this.state.expire_date).toLocaleString()
                                : '#nan'}
                        </Text>
                    </SettingListItem>
                </SettingList>
                <View style={{ ...styles.bodyUIFoot, flex: 1, marginBottom: 100 }}>
                    <Text>State: </Text>
                    {Array.from(Object.entries(this.state)).map(data => (
                        <View key={data[0]} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{'' + data[0]}</Text>
                            <Text>{JSON.stringify(data[1], null, 2)}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}

SettingsScreen.defaultProps = {
    primary: true,
    is_show_top_bar: false,
};

const styles = {
    settingListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderRadius: 2,
        borderColor: '#000',
        paddingTop: 5,
    },
    settingList: {
        padding: 5,
        flex: 1,
        flexDirection: 'column',
    },
    settingContainer: {
        position: 'absolute',
        width: '100%',
    },
    topBar: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#00bfff',
        height: 80,
        paddingBottom: 5,
    },
    textStyle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
    },
};
