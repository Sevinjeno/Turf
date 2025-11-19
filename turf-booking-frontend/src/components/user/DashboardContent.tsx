interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string; // profile photo URL
}

interface ProfileMenuProps {
  user: User | null;   // or undefined depending on your Redux default
}

const DashboardContent: React.FC<ProfileMenuProps> = ({user}) => {
  console.log("user",user)
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
        <p>Here's your dashboard content.</p>
      </div>
    );
  };
  
  export default DashboardContent;