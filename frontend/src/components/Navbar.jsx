import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home as HomeIcon, LogIn, UserPlus, LogOut } from "lucide-react";

const NavLink = ({ children, to, mobile = false, onClick }) => {
  return mobile ? (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link 
        to={to} 
        onClick={onClick}
        className="flex items-center text-white block px-4 py-3 rounded-lg text-base font-medium 
        hover:bg-white/20 transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-white"
      >
        {children}
      </Link>
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link 
        to={to} 
        className="flex items-center text-white px-4 py-2 rounded-lg text-sm font-medium 
        hover:bg-white/20 transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-white"
      >
        {children}
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="mr-2" size={20} /> },
    { name: "MyBlogs", path: "/myblogs", icon: <HomeIcon className="mr-2" size={20} /> },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="text-3xl font-bold tracking-wider text-white flex items-center">
              BlogSphere
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            {/* Show Signup/Login if not authenticated, else show Sign Out */}
            {!isAuthenticated ? (
              <>
                <NavLink to="/signup">
                  <UserPlus className="mr-2" size={20} />
                  Signup
                </NavLink>
                <NavLink to="/login">
                  <LogIn className="mr-2" size={20} />
                  Login
                </NavLink>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center text-white px-4 py-2 rounded-lg text-sm font-medium 
                hover:bg-white/20 transition duration-300 ease-in-out 
                focus:outline-none focus:ring-2 focus:ring-white"
              >
                <LogOut className="mr-2" size={20} />
                Sign Out
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button 
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-purple-600 to-indigo-600">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} mobile={true} onClick={toggleMenu}>
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}

                {/* Show Signup/Login if not authenticated, else show Sign Out */}
                {!isAuthenticated ? (
                  <>
                    <NavLink to="/signup" mobile={true} onClick={toggleMenu}>
                      <UserPlus className="mr-2" size={20} />
                      Signup
                    </NavLink>
                    <NavLink to="/login" mobile={true} onClick={toggleMenu}>
                      <LogIn className="mr-2" size={20} />
                      Login
                    </NavLink>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleSignOut();
                      toggleMenu();
                    }}
                    className="flex items-center text-white px-4 py-3 rounded-lg text-base font-medium 
                    hover:bg-white/20 transition duration-300 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-white w-full text-left"
                  >
                    <LogOut className="mr-2" size={20} />
                    Sign Out
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
