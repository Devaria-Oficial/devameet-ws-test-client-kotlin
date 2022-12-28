import { useState } from "react";

export const MyPosition = ({ position, videoRef, peerVideoConnection, data }) => {
    const togglMute = async () => {
        let payload = {
            userId: data.user,
            link: data.link,
            muted: !position.muted
        }
        peerVideoConnection.updateUserMute(payload);
    }
    return (
        <div className="container-position">
            <div className="position">
                <p>ID: {position?.clientId}</p>
                <p>Name: {position?.name}</p>
                <p>Avatar: {position?.avatar}</p>
                <p>Position: {'x: ' + position?.x + ' y: ' + position?.y + ' orientation: ' + position?.orientation}</p>
            </div>

            <div className="video">
                {/* <audio ref={videoRef} autoPlay playsInline muted /> */}
                <video ref={videoRef} autoPlay playsInline muted />
                <button type="button" onClick={togglMute}>{position?.muted ? 'Desmutar' : 'Mutar'}</button>
            </div>
        </div>
    );
}