import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        this.state = {
            users: []
        };
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
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nick name</th>
                                <th>Date of birth</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.users.map(user =>
                                <tr>
                                    {/*<td><Link to={`/show/${user.uid}`}>{user.status}</Link></td>*/}
                                    <td>{user.nickName}</td>
                                    <td>{user.dob}</td>
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
