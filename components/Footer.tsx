const Footer = () => (
  <footer className="border-t border-foreground/20 py-6 ">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
      <p className="text-foreground">
        © {new Date().getFullYear()} Supermax. All rights reserved.
      </p>

      <nav className="flex gap-4 mt-4 md:mt-0">
        <a
          href="#"
          className="text-foreground/70 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-foreground/70 hover:text-foreground transition-colors"
        >
          Terms of Service
        </a>
      </nav>
    </div>
  </footer>
);

export default Footer;
