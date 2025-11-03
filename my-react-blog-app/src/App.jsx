import { Route, Router, Routes } from 'react-router-dom'
import { supabase } from './SupabaseClient'
import CreateAcc from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import MobileNav from './components/MobileNav'
import SideNavbar from './components/SideNav'

function App() {
  console.log(supabase);
  return (
    <>
      <div className='lg:flex min-h-screen'>
        <div className='hidden lg: block'>
          <SideNavbar />
        </div>
        <div>
          <Routes>
            <Route path='/signup' element={<CreateAcc />} />
            <Route path='/' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feed' element={<Feed />} />
          </Routes>
        </div>

        <div className="text-2xl fixed bottom-0 left-0 w-full border-t-2 border-[#0866FF] bg-white lg:hidden">
          <MobileNav />
        </div>
      </div>
    </>
  )
}

export default App
