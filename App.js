import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, Button, TouchableOpacity, Alert, Modal, Pressable, View, Switch,  SafeAreaView, TextInput} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Updates from "expo-updates";


export default function App() {

    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [noGoal, setNoGoal] = useState(0)
    const [yesGoal, setYesGoal] = useState(0)

    const [newYesGoal, setNewYesGoal] = useState(0)
    const [newNoGoal, setNewNoHoal] = useState(0)

    const [yesGoalCount, setYesGoalCount] = useState(0)
    const [noGoalCount, setNoGoalCount] = useState(0)

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [streamGoalActive, setStreamGoalActive] = useState(false)

    const [number, onChangeNumber] = React.useState(null);

    const socket = useRef(null);


    useEffect(() => {
        socket.current = new WebSocket('wss://8mvlcuyyo1.execute-api.us-east-1.amazonaws.com/production')
        console.log("release channel", Updates.releaseChannel)
        socket.current.addEventListener('open', e =>  {
            console.log('WebSocket is connected')
            getInitialValues()
        })
        socket.current.addEventListener('close', e => console.log('WebSocket is closed'))

        socket.current.addEventListener('error', e => console.error('WebSocket is in error', e))

        socket.current.addEventListener('message', e => {
            console.log(`number of yes's: ${JSON.parse(e.data).message}`)
            let message = JSON.parse(e.data).message
            console.log(`number of yes's:`, message.yesCount)
            setYesCount(message.yesCount)
            setNoCount(message.noCount)

            // Set stream goal stats
            if (message.streamGoal) {
                setStreamGoalActive(message.streamGoal.streamGoalActive)
                setNoGoal(message.streamGoal.noGoal)
                setYesGoal(message.streamGoal.yesGoal)
                setNoGoalCount(message.streamGoal.noGoalCount)
                setYesGoalCount(message.streamGoal.yesGoalCount)
            }
        })

        return () => {
            socket.current.close();
            console.log("websocket closed")
        };
    }, []);

    useEffect (() => {
        setInterval(sendHeartbeat, 300000)
    }, [])

    const sendHeartbeat = () => {
        const payload = {
            action: 'message',
            type: 'heartbeat'
        }
        console.log("heartbeat sent")
        socket.current.send(JSON.stringify(payload))

    }

    const getInitialValues = () => {
        const payload = {
            action: 'message',
            type: 'getInitialValues'
        }
        socket.current.send(JSON.stringify(payload))

    }

    const changeStreamGoals = (newNoGoal, newYesGoal) => {
        const payload = {
            action: 'message',
            type: 'setStreamGoalCounts',
            streamGoal: {
                newNoGoal,
                newYesGoal,
            }
        }
        socket.current.send(JSON.stringify(payload))
    }

    const changeStreamGoalCounts = (newNoGoalCount, newYesGoalCount) => {
        const payload = {
            action: 'message',
            type: 'resetStreamGoalCounts',
            streamGoal: {
                streamGoalActive,
                newNoGoalCount,
                newYesGoalCount,
            }
        }
        socket.current.send(JSON.stringify(payload))
    }

    const changeStreamGoalActive = () => {
        const payload = {
            action: 'message',
            type: 'setStreamGoalActive',
            streamGoal: {
                streamGoalActive,
            }
        }
        socket.current.send(JSON.stringify(payload))
    }

    const addYesButtonPress = async () => {
        console.log("yesButton")
        const payload = {
            action: 'message',
            type: 'increaseYes'
        }
        socket.current.send(JSON.stringify(payload))
    }


    const minusYesButtonPress = () => {
        console.log("decreaseYesButton")
        const payload = {
            action: 'message',
            type: 'decreaseYes'
        }
        socket.current.send(JSON.stringify(payload))
    }

    const addNoButtonPress = () => {
        console.log("increaseNoButton")
        const payload = {
            action: 'message',
            type: 'increaseNo'
        }
        socket.current.send(JSON.stringify(payload))
    }

    const minusNoButtonPress = () => {
        console.log("decreaseMinusButton")
        const payload = {
            action: 'message',
            type: 'decreaseNo'
        }
        socket.current.send(JSON.stringify(payload))
    }

    const handleCheckForUpdate = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.reloadAsync();
            } else {
                console.log("no update")
            }
        } catch (e) {
           console.log("error", e)
        }
    }
    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={{
                flex: 1,
                marginBottom: 15,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <Text style={{marginTop: 36}}>Elite Marketing Stat Tracker</Text>
                <View style={{
                    flex: 1,
                    margin: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Button onPress={addYesButtonPress} title={"Plus Yes"}></Button>
                    <Button onPress={minusYesButtonPress} title={"Minus Yes"}></Button>
                </View>
                <View style={{
                    flex: 1,
                    margin: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Button onPress={addNoButtonPress} title={"Plus No"}></Button>
                    <Button onPress={minusNoButtonPress} title={"Minus No"}></Button>
                </View>
                <Text>Number of Yes's: {yesCount}</Text>
                <Text>Number of No's: {noCount}</Text>
            </View>
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
                <View style={{
                    width: '100%',
                    height: 35,
                    backgroundColor: 'black',
                    alignItems: "center",
                    flexDirection: "row",
                }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Stream Goal</Text>
                                <View style={styles.container}>
                                    <Text>Display Status</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View>
                                <Text>Yes Goal</Text>
                                <SafeAreaView style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeNumber}
                                        value={number}
                                        placeholder="useless placeholder"
                                        keyboardType="numeric"
                                    />
                                    <Text> / </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeNumber}
                                        value={number}
                                        placeholder="useless placeholder"
                                        keyboardType="numeric"
                                    />
                                </SafeAreaView>
                                <Text>No Goal</Text>
                                <SafeAreaView style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeNumber}
                                        value={number}
                                        placeholder="useless placeholder"
                                        keyboardType="numeric"
                                    />
                                    <Text> / </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChangeNumber}
                                        value={number}
                                        placeholder="useless placeholder"
                                        keyboardType="numeric"
                                    />
                                </SafeAreaView>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Update</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={{marginHorizontal: 6}} onPress={() => handleCheckForUpdate()}>
                        <Text style={{color: "white"}} width={30} height={30}>Update</Text>
                    </TouchableOpacity>
                    <Text style={{
                        textAlign: 'center',
                        color: 'lime',
                        fontSize: 16,
                        padding: 7,
                    }}>{Updates.updateId}</Text>
                </View>
            <Text>{Updates.releaseChannel}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        margin: 8,
    },
    input: {
        height: 40,
        margin: 12,
        width: 40,
        borderWidth: 1,
        padding: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    }
});
