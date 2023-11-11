import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReaderQR() {

  const navigate = useNavigate()
  const [result, setResult] = useState('')
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width:250,
        height:250
      },
      fps:5
    });

    scanner.render(success, error);

    function success(result){
      scanner.clear();
      setResult(result)
    }

    function error (){
    }

  }, [])

  useEffect(async()=>{
    if(result){
     await axios.post('http://localhost:8889/reader',{password:result})
      .then(res=>{
        if(res.data.message ==="Validation successfully"){
          navigate('/successfully');
        }else{
          navigate('/failed');
        }
      })
    };
  },[result])

  return (
    <div>
      <div id='reader'></div>
    </div>

  )
};

export default ReaderQR;