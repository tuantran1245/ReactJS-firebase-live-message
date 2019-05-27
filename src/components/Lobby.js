import React, { Component } from 'react';
import 'firebase/auth';
import '../App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import {Redirect} from "react-router-dom";

class Lobby extends Component {
    currentUser;
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        this.state = {
            users: [],
            redirect: false
        };
        this.getCurrentUser();

        this.pushUserStatusToFireBase = this.pushUserStatusToFireBase().bind(this);
    }

    getCurrentUser() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.updateCurrentUserStatus();
            } else {
                console.log('unable to get current user instance');
            }
        });

    }

    updateCurrentUserStatus() {
        firebase.database().ref(".info/connected").on(
            "value",  (snap) => {
                if (snap.val()) {
                    this.pushUserStatusToFireBase('online')
                } else {
                    // client has lost network
                    this.pushUserStatusToFireBase('offline')
                }
            });
    }

    pushUserStatusToFireBase(status) {
        console.log('current uid', this.currentUser.uid);
        return firebase.firestore().collection('users').doc(`${this.currentUser.uid}`).update({
            status: status
        })
    }

    onCollectionUpdate = (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            const { uid, nickName, email, gender, dob, status } = doc.data();
            users.push({
                key: doc.id,
                doc, // DocumentSnapshot
                uid, // user id
                nickName,
                email,
                gender,
                dob,
                status
            });
        });
        this.setState({
            users
        });
    };

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    async signOut() {
       await firebase.auth().signOut();
       await this.pushUserStatusToFireBase('offline');
       await this.setRedirect();
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    };

    render() {
        return (
            <div className="container">
                <div>
                    <div>
                        <h3>
                            Message list
                        </h3>
                    </div>
                    <div>
                        {this.renderRedirect()}
                        <button onClick={this.signOut}>Sign out</button>
                    </div>
                    <div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nick name</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map(user =>
                                <tr>
                                    {/*<td><Link to={`/show/${user.uid}`}>{user.status}</Link></td>*/}
                                    <td>{user.nickName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.status}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lobby;
