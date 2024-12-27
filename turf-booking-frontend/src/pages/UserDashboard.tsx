import React from 'react'
import DashboardContent from '../components/DashboardContent'
import Navbar_ from '../components/Navbar_'
import TurfList from './TurfList'
import FilterBar from '../components/Filterbar'

interface Props {
    
}

const UserDashboard = (props: Props) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
                {/* Navbar */}
                <Navbar_ />
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col">
                {/* Left Sidebar - Dashboard Content */}
                <div className="w-full bg-white shadow-md">
                    <DashboardContent />
                </div>

                <div className="w-full p-4">
                 <FilterBar />
                </div>
                
                {/* Right Content - Turf List */}
                <div className="w-full p-4">
                    <TurfList />
                </div>
                </div>
       </div>
    )
}

export default UserDashboard
