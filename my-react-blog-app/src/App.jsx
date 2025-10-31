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
        <div className='bg-gray-100'>
          <Routes>
            <Route path='/signup' element={<CreateAcc />} />
            <Route path='/' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feed' element={<Feed />} />
          </Routes>
        </div>

        <div className="text-2xl fixed bottom-0 left-0 w-full bg-gray-100 text-gray-900 border-t-4 border-gray-200 lg:hidden">
          <MobileNav />
        </div>
      </div>
    </>
  )
}

export default App
