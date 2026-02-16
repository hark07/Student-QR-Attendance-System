import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScanQR from './Components/ScanQR';
import FaceScanning from './Components/FaceScanning';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ScanQR />} />
      {/* <Route path='/' element={<FaceScanning />} /> */}
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App