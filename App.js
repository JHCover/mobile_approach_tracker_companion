import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, Button, TouchableOpacity, Alert, Modal, Pressable, View} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Updates from "expo-updates";


export default function App() {

    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

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

    const openGoalModal = () => {

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
                                <Text style={styles.modalText}>Hello World!</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>Hide Modal</Text>
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
});
