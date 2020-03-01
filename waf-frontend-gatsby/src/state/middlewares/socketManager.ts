import { TODOS_REQUESTED } from '../types/todos';
import { INTIALIZE_SOCKETIO_CONNECTION } from '../types/socketManager';
import todoService, { ITodosSuccess } from '../../services/todos.service';
import { todosSuccess, todosFailed } from '../actions/todos';
import { Dispatch } from 'react';
import { MiddlewareAPI, AnyAction, Action } from 'redux';
import io from 'socket.io-client';

import { SUBMIT_MANUALLY_ENTERED_ZIPCODE, SUBMIT_UPDATED_LOCATION } from '../types/global-app-properties';
import { LOGIN_SUCCESS } from '../types/login';

let socket: any = null;

const socketManager = () => {
    return (store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => async (action: AnyAction) => {

        console.log('socket middleware was added!')
        switch (action.type) {
            case INTIALIZE_SOCKETIO_CONNECTION:
                console.log('handling INTIALIZE_SOCKETIO_CONNECTION! Let\'s connect!')

                socket = io('http://localhost:3000');
                socket.on('connect', () => {
                    socket.emit('new message', { "username": "TIMMAYYY", "message": "hi" })
                    console.log("connected!")
                });

                socket.on('dope message', function (data: any) {
                    console.log("received a dope message! ", data)

                    socket.emit('dope response', { "foo": "baby" })
                });

                socket.on('foo baby back', function (data: any) {
                    console.log("received a foo baby message back! ", data)

                    // socket.emit('dope response', {"foo": "baby"})
                });

                socket.on('disconnect', function () {
                    console.log("disconnected!")
                });

                break;

            case LOGIN_SUCCESS:

                console.log('handling login success and sending payload:', action.payload)
                // console.log('p: ', payload)
                break;


            case SUBMIT_UPDATED_LOCATION:

                console.log('handling SUBMIT_UPDATED_LOCATION sending to server:', action.payload)
                socket.emit(SUBMIT_UPDATED_LOCATION, action.payload)
                break;

            case SUBMIT_MANUALLY_ENTERED_ZIPCODE:

                console.log('handling mnanually entered zipcode and sending to server:', action.payload)
                socket.emit(SUBMIT_MANUALLY_ENTERED_ZIPCODE, action.payload)
                break;

            //     try {
            //       const todosData = await todoService() as ITodosSuccess;
            //       store.dispatch(todosSuccess(todosData));
            //     } catch (error) {
            //       store.dispatch(todosFailed(error));
            //     }

            //     break;

            default:
                next(action);

        }
    };
};

export const sendToServer = (event: string, payload: any) => {

}

export default socketManager;
