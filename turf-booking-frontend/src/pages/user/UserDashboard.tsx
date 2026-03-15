import React, { useEffect } from 'react'
import DashboardContent from '../../components/user/DashboardContent'
import Navbar_ from '../../components/user/Navbar_'
import TurfList from '../../components/user/TurfList'
import FilterBar from '../../components/user/Filterbar'
import ProfileMenu from '../../components/user/Profile'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const UserDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
                {/* Navbar */}
                 <div className="bg-white shadow-md w-full">
                        <Navbar_ >
                            <ProfileMenu user={user} />
                        </Navbar_>
                        </div>
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col">
                {/* Left Sidebar - Dashboard Content */}
                <div className="w-full bg-white shadow-md">
                    <DashboardContent user={user} />
                </div>
               
                {/* <div className="w-full p-4">
                 <FilterBar />
                </div> */}
                
                {/* Right Content - Turf List */}
                <div className="w-full p-4">
                    <TurfList />
                </div>
                </div>
       </div>
    )
}

export default UserDashboard
