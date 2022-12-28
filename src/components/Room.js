import { useRef, useState } from "react";
import { useCreateMediaStream } from "../hooks/useCreateMediaStream";
import { useWebSocket } from "../hooks/useWebSocket";
import { MyPosition } from "./MyPosition";
import { UserPosition } from "./UserPosition";

export const Room = ({ data }) => {
    const localVideoRef = useRef();

    const userMediaStream = useCreateMediaStream(localVideoRef);
    const { connectedUsers, peerVideoConnection } = useWebSocket(data, userMediaStream);

    const myPosition = connectedUsers?.find(e => e.user == data.user);
    const others = connectedUsers?.filter(e => e.user != data.user);

    const doMove = (direction) => {
        let payload = {
            userId: data.user,
            link: data.link,
        }
        switch (direction) {
            case 'left':
                payload.x = myPosition.x > 1 ? myPosition.x - 1 : 1;
                payload.orientation = 'left';
                payload.y = myPosition.y;
                peerVideoConnection.updateUserMovement(payload);
                break;
            case 'right':
                payload.x = myPosition.x < 8 ? myPosition.x + 1 : 8;
                payload.orientation = 'right';
                payload.y = myPosition.y;
                peerVideoConnection.updateUserMovement(payload);
                break;
            case 'up':
                payload.x = myPosition.x;
                payload.orientation = 'back';
                payload.y = myPosition.y > 1 ? myPosition.y - 1 : 1;
                peerVideoConnection.updateUserMovement(payload);
                break;
            case 'down':
                payload.x = myPosition.x;
                payload.orientation = 'front';
                payload.y = myPosition.y < 8 ? myPosition.y + 1 : 8;
                peerVideoConnection.updateUserMovement(payload);
                break;
            default:
                break;
        }
    }

    if (!userMediaStream) {
        return (
            <div className="container-room">
                <h1>Favor habilitar a camera!</h1>
                <MyPosition position={myPosition} videoRef={localVideoRef} />
            </div>
        )
    }

    return (
        <div className="container-room">
            <h1>{data.link}</h1>

            <div className="user">
                <div>
                    <MyPosition position={myPosition} videoRef={localVideoRef} peerVideoConnection={peerVideoConnection} data={data} />
                </div>
                <div className="actions">
                    <button type="button" onClick={e => doMove('left')}>Left</button>
                    <div>
                        <button type="button" onClick={e => doMove('up')}>Up</button>
                        <button type="button" onClick={e => doMove('down')}>Down</button>
                    </div>
                    <button type="button" onClick={e => doMove('right')}>right</button>
                </div>
            </div>
            <div className="others">
                {others?.map((p, index) => <UserPosition key={index} position={p} />)}
            </div>
        </div>
    )
}