import { Route, Router, Routes, useLocation } from 'react-router-dom'
import { supabase } from './SupabaseClient'
import CreateAcc from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import MobileNav from './components/MobileNav'
import SideNavbar from './components/SideNav'
import Settings from './components/Setting'


function App() {
  console.log(supabase);
  const location = useLocation()
  return (
    <>
      {/* checking if the specific signup or login page is so navbar won't render  */}

      <div className='lg:flex gap-10 min-h-screen'>
        <div className='hidden md:hidden lg:block bg-gray-100 w-[25%] shadow-md'>
          {location.pathname !== "/signup" && location.pathname !== "/" && (
            <SideNavbar />
          )}
        </div>
        <div>
          <Routes>
            <Route path='/signup' element={<CreateAcc />} />
            <Route path='/' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </div>

        <div className="text-2xl fixed bottom-0 left-0 w-full border-t border-[#0866FF] bg-white lg:hidden">
          {location.pathname !== "/signup" && location.pathname !== "/" && (
            <MobileNav />
          )}
        </div>
      </div>
    </>
  )
}

export default App
