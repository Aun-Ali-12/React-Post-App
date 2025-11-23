import { Route, Router, Routes, useLocation } from 'react-router-dom'
import { supabase } from './SupabaseClient'
import CreateAcc from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Feed from './pages/Feed'
import Create from './pages/Create'
import MobileNav from './components/MobileNav'
import SideNavbar from './components/SideNav'
import Settings from './components/Setting'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
  console.log(supabase);
  const location = useLocation()
  return (
    <>
      <ToastContainer />
      {/* checking if the specific signup or login page is so navbar won't render  */}

      <div className='lg:flex gap-10 min-h-screen'>
        {location.pathname !== "/" && location.pathname !== "/signup" && (
          <div className='hidden md:hidden lg:block bg-gray-100 w-[25%] shadow-md fixed top-0 left-0 h-screen'>
            <SideNavbar />
          </div>
        )}
        <div>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<CreateAcc />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/create' element={<Create />} />
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
