import React from 'react';
import { Link } from 'react-router-dom'
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-2 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-200">
          <p className="mb-4">
            This is an unofficial mock exam / reviewer tool. Always refer to the official
            Civil Service Commission website for the most accurate information.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Privacy Policy
            </Link>
            <span className="hidden sm:block text-gray-400">• </span>
            <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Terms of Use
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-100">
            © {currentYear} CSE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
