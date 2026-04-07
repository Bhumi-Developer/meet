'use client';
import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { navLinks } from '@/constants';
import { neobrutalism } from '@clerk/themes'
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside or when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center fixed z-50 w-full h-20 lg:h-28 bg-gray-200 px-4 md:px-10 gap-4 shadow-2xl">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-1 hover:scale-110 lg:hover:scale-150 duration-500 z-50"
        >
          <Image
            src="/assets/logo.svg"
            width={isMobile ? 40 : 60}
            height={isMobile ? 40 : 60}
            alt="Let's talk"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <section className="hidden lg:block sticky top-0">
          <div className="flex flex-1 gap-6">
            {navLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              
              return (
                <Link
                  href={item.route}
                  key={item.label}
                  className={cn(
                    'flex gap-4 items-center p-4 rounded-lg justify-start hover:scale-110 duration-300',
                    isActive && 'bg-blue-100 rounded-3xl'
                  )}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={24}
                    height={24}
                  />
                  <p className="text-lg font-semibold">
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* User Button & Hamburger Menu Container */}
        <div className="flex items-center gap-3 md:gap-4 z-50">
          {/* User Button */}
          <div className='hover:scale-110 lg:hover:scale-150 duration-500'>
            <SignedIn>
              <UserButton
                appearance={{
                  baseTheme: neobrutalism,
                }}
              />
            </SignedIn>
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X size={28} className="text-gray-700" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden',
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-20 left-0 right-0 z-40 bg-gray-200 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col py-6 px-4">
          {navLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
            
            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-gray-300',
                  isActive && 'bg-blue-100'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <p className="text-lg font-semibold text-gray-800">
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Add custom styles for better mobile experience */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          /* Smooth scrolling when menu is open */
          body.menu-open {
            overflow: hidden;
          }
        }
      `}</style>
    </>
  )
}

export default NavBar