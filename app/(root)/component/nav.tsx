/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function NavbarDemo() {
  const { data: session, status, update } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base nav items that don't change
  const baseNavItems = [
    { name: "For You", link: "/" },
    { name: "Blogs", link: "/blog" },
  ];

  // Compute nav items based on session and admin status
  const navItems = [
    ...baseNavItems,
    // Only add Write link if user is authenticated
    ...(status === "authenticated" && session?.user?.name 
      ? [{ name: "Write", link: `/write/${session.user.name}` }] 
      : []
    ),
    // Only add Review link if user is admin
    ...(status === "authenticated" && isAdmin ? [{ name: "Manage", link: "/manage" }] : []),
  ];

  // Reset admin state immediately when session becomes unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      setIsAdmin(false);
      setAdminCheckComplete(true);
    }
  }, [status]);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      // Only check admin status if we have an authenticated session
      if (status !== "authenticated" || !session?.user?.name) {
        setIsAdmin(false);
        setAdminCheckComplete(true);
        return;
      }

      try {
        const res = await fetch(`/api/isAdmin?name=${encodeURIComponent(session.user.name)}`, {
          // Add cache busting to ensure fresh data
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch admin status');
        }
        
        const adminData = await res.json();
        setIsAdmin(adminData?.role === 'admin');
      } catch (error) {
        console.error('Failed to check admin status:', error);
        setIsAdmin(false);
      } finally {
        setAdminCheckComplete(true);
      }
    };

    // Reset states when loading
    if (status === "loading") {
      setAdminCheckComplete(false);
      setIsAdmin(false);
      return;
    }

    fetchIsAdmin();
  }, [session?.user?.name, status]);

  // Force session refresh on window focus (helps catch logout from other tabs)
  useEffect(() => {
    const handleFocus = () => {
      if (status !== "loading") {
        update();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [status, update]);

  // Close mobile menu when session changes (like after logout)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [status]);

  const renderAuthButton = () => {
    if (status === "loading") {
      return <NavbarButton disabled>Loading</NavbarButton>;
    }
    
    if (status === "authenticated" && session?.user?.name) {
      return (
        <NavbarButton variant="primary" href={`/profile/${session.user.name}`}>
          Profile
        </NavbarButton>
      );
    }
    
    return (
      <NavbarButton variant="primary" href="/login">
        Login
      </NavbarButton>
    );
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {renderAuthButton()}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${item.name}-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {renderAuthButton()}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};