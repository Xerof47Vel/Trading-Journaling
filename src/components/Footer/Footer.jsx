const Footer = () => {
    return (
      <footer className="w-full dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-2 px-2 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Xerof Trading Solutions. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
            <a href="#" className="hover:text-primary transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  