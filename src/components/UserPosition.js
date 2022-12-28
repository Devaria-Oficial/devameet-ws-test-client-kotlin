
export const UserPosition = ({ position, videoRef }) => {
    return (
        <div className="container-position">
            <div className="position">
                <p>ID: {position?.clientId}</p>
                <p>Name: {position?.name}</p>
                <p>Avatar: {position?.avatar}</p>
                <p>Position: {'x: ' + position?.x + ' y: ' + position?.y + ' orientation: ' + position?.orientation}</p>
                <p>Mudo: {position?.muted ? 'Sim' : 'Não'}</p>
            </div>

            <div className="video">
                {/* <audio autoPlay playsInline id={position?.clientId} /> */}
                <video autoPlay playsInline id={position?.clientId} muted={position?.muted} />
            </div>
        </div>
    );
}