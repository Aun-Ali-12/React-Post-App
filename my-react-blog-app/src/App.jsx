import { Route, Routes } from 'react-router-dom'
import { supabase } from './SupabaseClient'
import CreateAcc from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Feed from './pages/Feed'


function App() {
  console.log(supabase);
  return (
    <>
      <Routes>
        <Route path='/signup' element={<CreateAcc />} />
        <Route path='/' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/feed' element={<Feed />} />
      </Routes></>
  )
}

export default App
