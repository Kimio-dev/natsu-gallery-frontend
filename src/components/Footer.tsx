// src/components/Footer.tsx
import React from 'react';
import { FaInstagram } from 'react-icons/fa'; // SNSアイコン

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-12">
      <footer className="bg-gray-800 text-white py-8 rounded-tr-full"> {/* rounded-tr-full を適用 */}
        <div className="container mx-auto px-4 flex flex-col items-center justify-between md:flex-row">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="https://instagram.com/your_instagram" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              <FaInstagram size={30} />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} NATSU_GARELLY. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;