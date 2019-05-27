import React, { Component } from 'react';
import 'firebase/auth';
import '../App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import MessageForm from './Form/MessageForm'

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user });
        });
    }

    render() {
        return (
            <div className="app__list">
                <MessageForm user={this.state.user} />
            </div>
        );
    }
}
export default Chat;
