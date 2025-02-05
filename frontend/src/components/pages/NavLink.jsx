import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavLink = ({ children, to, mobile = false }) => {
  return mobile ? (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        to={to} 
        className="text-white block px-4 py-3 rounded-lg text-base font-medium 
        hover:bg-purple-700/30 transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {children}
      </Link>
    </motion.div>
  ) : (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        to={to} 
        className="text-white px-4 py-2 rounded-lg text-sm font-medium 
        hover:bg-purple-700/30 transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default NavLink;