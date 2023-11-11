import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GenQR() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');

    const time = new Date(Date.now()).getMonth()+ "-" +new Date(Date.now()).getDate()+"-"+new Date(Date.now()).getFullYear()+"-"+ new Date(Date.now()).getHours()+":" + new Date(Date.now()).getMinutes();
    const conTime = time.toString();
    
    const submitBtn = (e) => {
        e.preventDefault();
     /*    if (name.length > 0 && password.length > 0) {
            axios.post('http://localhost:888/genQR', { name, password, conTime })
                .then(res => {
                    setImage(res.data);
                })
        }else{
            alert('pleas enter your name and password')
        } */
    };

    const readerBtn = (e)=>{
        e.preventDefault();
        navigate('/reader')
    }

    return (
        <div>
            <button onClick={readerBtn}>reader</button>
        </div>
    )
}

export default GenQR