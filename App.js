import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, Button, TouchableOpacity, Alert, Modal, Pressable, View, Switch,  SafeAreaView, TextInput} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as Updates from "expo-updates";
import { io } from "socket.io-client";


export default function App() {


    const socket = io("ws://192.168.1.57:3000");

// send a message to the server
    socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// receive a message from the server
    socket.on("hello from server", (...args) => {
        // ...
    });


    return (
        <View style={styles.container}>
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
