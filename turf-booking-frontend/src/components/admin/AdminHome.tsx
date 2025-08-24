import TurfList from './TurfList'

const AdminHome = () => {
  return (
        <div className="mt-6">
      <TurfList />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <div className="bg-white p-6 rounded shadow text-center font-medium text-lg">
          📋 Total Bookings: 120
        </div>
        <div className="bg-white p-6 rounded shadow text-center font-medium text-lg">
          ⚽ Turfs Active: 8
        </div>
        <div className="bg-white p-6 rounded shadow text-center font-medium text-lg">
          👥 Users: 340
        </div>
      </div>
    </div>
  )
}

export default AdminHome