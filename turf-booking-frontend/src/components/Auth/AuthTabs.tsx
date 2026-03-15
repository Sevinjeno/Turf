interface AuthTabsProps {
  action: "login" | "register";
  setAction: (action: "login" | "register") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ action, setAction }) => {
  return (
    <div className="flex justify-between mb-6">
      <button
        className={`w-1/2 py-2 font-semibold text-lg border-b-2 ${
          action === "login"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => setAction("login")}
      >
        Login
      </button>
      <button
        className={`w-1/2 py-2 font-semibold text-lg border-b-2 ${
          action === "register"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => setAction("register")}
      >
        Register
      </button>
    </div>
  );
};

export default AuthTabs;
