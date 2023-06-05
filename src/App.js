import CryptoJS from 'crypto-js';
import './App.css';
import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Download, QrCode2, Visibility } from '@mui/icons-material';

function App() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('')
  const [encryptedText, setEncryptedText] = useState('');
  const [title, setTitle] = useState('')
  const qrCodeRef = useRef(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [scannedText, setScannedText] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');

  const resetGenerate = () => {
    setText('');
    setPassword('');
    setEncryptedText('');
    setTitle('');
  }

  const resetExtract = () => {
    setDecryptedText('');
    setDecryptPassword('');
    setScannedText('');
  }

  const handleScannedTextChange = (e) => {
    setScannedText(e.target.value);
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDecryptPasswordChange = (e) => {
    setDecryptPassword(e.target.value);
  }

  const encryptText = () => {
    // Perform encryption logic using a library like bcrypt.js or crypto-js
    // Example using crypto-js:
    const encrypted = CryptoJS.AES.encrypt(text, password).toString();
    setEncryptedText(encrypted);
  };

  const downloadQRCode = () => {
    html2canvas(qrCodeRef.current).then((canvas) => {
      const dataUrl = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${title}.png`;
      a.click();
    });
  };

  const decryptText = () => {
    const decrypted = CryptoJS.AES.decrypt(scannedText, decryptPassword).toString(CryptoJS.enc.Utf8);
    setDecryptedText(decrypted);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Stack display={'flex'} flexDirection={'row'} justifyContent={'center'} padding={'30px'} gap={'20px'} alignItems={'center'}>
        <img src={'/logo.png'} width={100} height={100}/>
        <Typography sx={{fontSize:'26px',fontWeight: 900, lineHeight:'28px'}}>We Love Mother Land - Korea</Typography>
        </Stack>
        <Stack sx={(theme) => ({
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          width: `min(${'90vw'}, ${'1192px'})`,
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
          }
        })}>
          <Stack gap={'10px'} sx={(theme) => ({
            width: '50%',
            [theme.breakpoints.down('sm')]: {
              width: '100%'
            }
          })}>
            <Stack display={'flex'} flexDirection={'row'}>
              <Typography sx={{ fontSize: '24px', fontWeight: 700, lineHeight: '22px', padding: '20px' }}>QR ကုဒ် ထုတ်ရန်</Typography>
              <Button onClick={resetGenerate}>Reset Generate</Button>
            </Stack>
            <TextFieldWithLabel label={'ဓာတ်ပုံအမည်'} onTextChange={handleTitleChange} value={title} placeholder={'E.g., PhotoName'} />
            <TextFieldWithLabel label={'ဖွက်ချင်တဲ့စာ'} onTextChange={handleTextChange} value={text} placeholder={'E.g., အမည်၊ စာရွက်နံပါတ်'} />
            <TextFieldWithLabel label={'လျှို့ဝှက်နံပါတ်'} onTextChange={handlePasswordChange} value={password} placeholder={'E.g., 12345678'} type={'password'} />
            <Button variant={'contained'} onClick={encryptText} disabled={password.length < 5} startIcon={<QrCode2 />}>QR Code ထုတ်မည်။</Button>
            <Stack ref={qrCodeRef} sx={{ padding: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <QRCode size={256} value={encryptedText} viewBox={`0 0 256 256`} level='L' title={'We Love Mother Land'} />
            </Stack>
            <Button variant={'contained'} onClick={downloadQRCode} disabled={encryptText.length === 0} sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: '#355E3B' } }} startIcon={<Download />}>QR Code ဒေါင်းလုတ် လုပ်မည်။</Button>
          </Stack>
          <Stack gap={'10px'} sx={(theme) => ({
            width: '50%',
            [theme.breakpoints.down('sm')]: {
              width: '100%'
            }
          })}>
            <Stack display={'flex'} flexDirection={'row'}>
              <Typography sx={{ fontSize: '24px', fontWeight: 700, lineHeight: '22px', padding: '20px' }}>QR ကုဒ် ပြန်စစ်ရန်</Typography>
              <Button onClick={resetExtract}>Reset Extract</Button>
            </Stack>
            <TextFieldWithLabel label={'ဖွက်စာကိုထည့်ပါ'} onTextChange={handleScannedTextChange} value={scannedText} placeholder={'U2FsdGVkX1+CSE1OERdapGEBs2x3LMl4a0MbxlQxMbk='} />
            <TextFieldWithLabel label={'လျှို့ဝှက်နံပါတ်'} onTextChange={handleDecryptPasswordChange} value={decryptPassword} placeholder={'E.g., 12345678'} type={'password'} />
            {scannedText && decryptPassword && decryptPassword.length > 4 && (
              <Button onClick={decryptText} startIcon={<Visibility />}>ဖွက်စာဖြည်ကြည့်မည်။</Button>
            )}
            {decryptedText && <Typography marginTop={'20px'} sx={{ fontSize: '22px', fontWeight: 600 }}>အကြောင်းအရာ<br /> <br /><Typography sx={{ fontSize: '18px', fontWeight: 500 }}>{decryptedText}</Typography></Typography>}
          </Stack>
        </Stack>
      </header>
    </div>
  );
}

export default App;

const TextFieldWithLabel = ({ label, value, placeholder, onTextChange, type = 'text' }) => {
  return <Stack sx={{
    display: 'flex',
    gap: '10px',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }}>
    <Typography sx={{ fontSize: '14px', fontWeight: 500, width: '40%' }}>
      {label}
    </Typography>
    <TextField size='small' type={type} onChange={onTextChange} value={value} placeholder={placeholder} sx={{ width: '60%' }} />
  </Stack>
}
