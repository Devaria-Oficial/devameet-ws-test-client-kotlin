import { useState } from "react";

export const Form = ({setData}) => {

    const [link, setLink] = useState('');
    const [user, setUser] = useState('');

    const createRoom = () =>{
        setData({link, user});
    }

    return (
        <div className="container-form">
            <input type="text" placeholder="Informe o nome da sala"
                value={link} onChange={e => setLink(e.target.value)}/>
            <input type="text" placeholder="Informe o id do Usuario"
                value={user} onChange={e => setUser(e.target.value)}/>

            <button type="button" onClick={createRoom}>Entrar</button>
        </div>
    )
}