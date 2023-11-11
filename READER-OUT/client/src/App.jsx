import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Failed from './pages/Failed'
import GenQR from './pages/GenQR'
import ReaderQR from './pages/ReaderQR'
import Successfully from './pages/Successfully'


function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GenQR/>}></Route>
          <Route path='/reader' element={<ReaderQR/>}></Route>
          <Route path='/failed' element={<Failed/>}></Route>
          <Route path='/successfully' element={<Successfully/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
