import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white text-center py-4 mt-10">
      <p className="text-sm flex items-center justify-center gap-2">
        🌟 If you like this project, consider giving it a star! 
        <a 
          href="https://github.com/Sapna127/WanderWise" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          <Github className="w-5 h-5" />
          {/* GitHub */}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
