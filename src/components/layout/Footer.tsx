import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          Student Academic Results Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;