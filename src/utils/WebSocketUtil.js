//import { io } from 'socket.io-client';
import io from 'socket.io-client';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class PeerConnectionSession {
    _room;
    _userId;
    peerConnections = {};
    senders = [];
    listeners = {};
    connected = false;

    constructor(socket) {
        this.socket = socket;
        this.onCallMade();
    }

    connect(){
        this.connected = true;
    }

    addPeerConnection(id, stream, callback) {
        if (!this.peerConnections[id]) {
            console.log('addPeerConnection', id)
            this.peerConnections[id] = new window.RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            });

            stream.getTracks().forEach((track) => {
                this.senders.push(this.peerConnections[id].addTrack(track, stream));
            });

            this.listeners[id] = (event) => {
                const fn = this['_on' + capitalizeFirstLetter(this.peerConnections[id].connectionState)];
                fn && fn(event, id);
            };

            this.peerConnections[id].addEventListener('connectionstatechange', this.listeners[id]);

            this.peerConnections[id].ontrack = function ({ streams: [stream] }) {
                callback(stream);
            };
        }
    }

    removePeerConnection(id) {
        this.peerConnections[id].removeEventListener('connectionstatechange', this.listeners[id]);
        delete this.peerConnections[id];
        delete this.listeners[id];
    }

    async callUser(to) {
        console.log('callUser', to);
        console.log('callUser', this.peerConnections[to]?.iceConnectionState);
        if (this.peerConnections[to]?.iceConnectionState === 'new') {
            const offer = await this.peerConnections[to].createOffer();
            await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer));
            this.socket.emit('call-user', { offer, to, link: this._room });
        }
    }

    onAnswerMade(callback) {
        this.socket.on('answer-made', async (data) => {
            console.log('onAnswerMade', data);
            await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer));
            callback(data.socket);
        });
    }

    onCallMade() {
        this.socket.on('call-made', async (data) => {
            const selectedPeer = this.peerConnections[data.socket];
            if (selectedPeer) {
                await selectedPeer.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await selectedPeer.createAnswer();
                await selectedPeer.setLocalDescription(new RTCSessionDescription(answer));

                console.log('make-answer', answer);
                this.socket.emit('make-answer', {
                    answer,
                    to: data.socket,
                    link: this._room
                });
            }
        });
    }

    joinRoom(data) {
        this._room = data.link;
        this._userId = data.user;
        this.socket.emit('join', { link: this._room, userId: this._userId });
    }

    onAddUser(callback) {
        this.socket.on(`${this._room}-add-user`, async ({ user }) => {
            callback(user);
        });
    }

    onRemoveUser(callback) {
        this.socket.on(`${this._room}-remove-user`, ({ socketId }) => {
            callback(socketId);
        });
    }

    onUpdateUserList(callback) {
        this.socket.on(`${this._room}-update-user-list`, ({ users }) => {
            callback(users);
        });
    }

    updateUserMovement(data) {
        this.socket.emit('move', data);
    }

    updateUserMute(data) {
        this.socket.emit('toggl-mute-user', data);
    }

    clearConnections() {
        // this.socket?.close();
        // this.senders = [];
        // if(this.peerConnections){
        //     Object.keys(this.peerConnections)?.forEach(this.removePeerConnection?.bind(this));
        // }
    }
}

export const createPeerConnectionContext = () => {
    const { REACT_APP_SOCKET_URL } = process.env;
    const socket = io(REACT_APP_SOCKET_URL);

    return new PeerConnectionSession(socket);
};
