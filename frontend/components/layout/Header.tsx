
  "use client";
  import { useState, useEffect } from "react";
  import Link from "next/link";
  import Image from "next/image";
  import { usePathname } from "next/navigation";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/booking", label: "Booking" },
  ];

  export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Frosted glass effect on scroll
    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
      document.body.style.overflow = menuOpen ? "hidden" : "";return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    return (
      <>
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "glass-header"
              : "bg-transparent"
          }`}
        >
          <div className="content-width px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">

              {/* Logo */}
              <Link
                href="/"
                className="relative flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md"
                aria-label="Technician Ideas — Home"
              >
                <Image
                  src="/logo.png"
                  alt="Technician Ideas — Mobile Service • Stop By Service"
                  width={140}
                  height={56}
                  priority
                  className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(201,168,76,0.4)]"
                />
              </Link>

              {/* Desktop nav */}
              <nav
                className="hidden md:flex items-center gap-8"
                aria-label="Main navigation"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative font-sans text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 
  focus-visible:ring-gold rounded-sm px-1 py-0.5 group ${
                        isActive
                          ? "text-gold"
                          : "text-silver hover:text-brand-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}

                      {/* Active underline indicator */}
                      <span
                        className={`absolute -bottom-1 left-0 right-0 h-px transition-all duration-300 ${
                          isActive
                            ? "bg-gold-gradient opacity-100scale-x-100"
                            : "bg-gold opacity-0 scale-x-0group-hover:opacity-60group-hover:scale-x-100"
                        }`}aria-hidden="true"
                      />

                      {/* Active glow dot */}
                      {isActive && (
                        <span
                          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,76,0.8)]"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  );
                })}<Link
                  href="/booking"
                  className="ml-2 px-5 py-2 text-sm font-semibold font-display rounded-md border border-gold text-gold hover:bg-gold hover:text-background transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Book Now
                </Link>
              </nav>

              {/* Hamburger button — mobile only */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
  rounded-md"aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}aria-controls="mobile-menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-silver-light transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-silver-light transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                /><span
                  className={`block w-6 h-0.5 bg-silver-light transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile drawer overlay */}
        <div
          className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />

        {/* Mobile drawer */}
        <nav
          id="mobile-menu"
          className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-background-secondary border-l border-border flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 ease-out 
  md:hidden ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {/* Gold divider */}
          <div className="divider-gold mb-8" aria-hidden="true" />

          <ul className="flex flex-col gap-2 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium font-sans transition-all duration-200 focus-visible:outline-none 
  focus-visible:ring-2 focus-visible:ring-gold ${
                      isActive
                        ? "bg-background-elevated text-gold border border-border-gold"
                        : "text-silver hover:text-brand-white hover:bg-background-elevated"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,76,0.8)] flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul><Link
            href="/booking"
            className="mt-auto block text-center px-5 py-3 text-sm font-semibold font-display rounded-md border border-gold text-gold hover:bg-gold hover:text-background
  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Book Now
          </Link>
        </nav>
      </>
    );
  }
