import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { LoginContext } from '../Context/Login';

const LogStateView = props => {
    if (props['state'] == null) {
        return null;
    }
    return (
        <View
            style={{
                margin: 5,
                flex: 1,
                flexDirection: 'column',
                marginBottom: 100,
            }}
        >
            <Text>State: {props.state.loading} </Text>
            {Array.from(Object.entries(props.state)).map(data => (
                <View
                    key={data[0]}
                    style={{
                        padding: 5,
                        flex: 1,
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    <Text>{'' + data[0]}</Text>
                    <Text>{JSON.stringify(data[1], null, 2)}</Text>
                </View>
            ))}
        </View>
    );
};
LogStateView.defaultProps = {
    state: { loading: true },
};

export default LogStateView;
