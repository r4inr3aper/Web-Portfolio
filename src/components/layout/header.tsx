"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FileText, Home, User, FolderKanban, BookOpen, Mail } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "About", path: "/about", icon: User },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Learnings", path: "/learnings", icon: BookOpen },
    { label: "Contact", path: "/contact", icon: Mail },
  ];

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    const activeLink = navRef.current.querySelector<HTMLAnchorElement>('[data-active="true"]');

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;

      requestAnimationFrame(() => {
        if (indicatorRef.current) {
          indicatorRef.current.style.transition = 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
          indicatorRef.current.style.width = `${offsetWidth}px`;
          indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
          indicatorRef.current.style.opacity = '1';
        }
      });
    }
  }, [pathname]);

  const handleMouseEnter = (path: string) => {
    setHoveredItem(path);

    if (!navRef.current || !indicatorRef.current) return;

    const hoveredLink = navRef.current.querySelector<HTMLAnchorElement>(`[href="${path}"]`);

    if (hoveredLink) {
      const { offsetLeft, offsetWidth } = hoveredLink;

      requestAnimationFrame(() => {
        if (indicatorRef.current) {
          indicatorRef.current.style.transition = 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease';
          indicatorRef.current.style.width = `${offsetWidth}px`;
          indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
          indicatorRef.current.style.opacity = '1';
        }
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);

    if (!navRef.current || !indicatorRef.current) return;

    const activeLink = navRef.current.querySelector<HTMLAnchorElement>('[data-active="true"]');

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;

      requestAnimationFrame(() => {
        if (indicatorRef.current) {
          indicatorRef.current.style.transition = 'width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s ease';
          indicatorRef.current.style.width = `${offsetWidth}px`;
          indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
        }
      });
    }
  };

  return (
    <>
      {/* Profile Section */}
      <section className="w-full flex gap-4 justify-between mb-6 p-2">
        <div className="flex gap-4">
          <img
            src="./me.jpeg"
            alt="bedanta"
            width={60}
            height={60}
            className="rounded-full w-14 h-14 object-cover transition-transform hover:scale-105 duration-300"
          />
          <div className="flex flex-col gap-2 justify-center">
            <h2 className="mb-0">bedanta</h2>
            <p className="mb-0 text-zinc-400 font-normal leading-none">
              Student • Dev • Ailurophile
            </p>
          </div>
        </div>

        {/* Resume Button */}
        <div className="flex items-center">
          <a
            href="https://drive.google.com/file/d/1WEvmzzwh0T1QV9oVlUgDoD1LaXwMeHH_/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2.5 sm:px-3 sm:py-2 bg-stone-800/80 hover:bg-stone-800/90 border border-stone-700/50 hover:border-stone-700/70 rounded-lg text-base sm:text-sm font-normal text-zinc-100 transition-all duration-300 hover:shadow-md no-underline"
          >
            <FileText size={18} className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-3" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </section>

      {/* Navigation */}
      <div className="border border-stone-800/90 p-2 sm:p-[0.4rem] rounded-lg mb-12 sticky top-4 z-[100] bg-stone-900/80 backdrop-blur-md">
        <nav
          ref={navRef}
          className="flex gap-2 sm:gap-2 relative justify-start w-full z-[100] rounded-lg"
          onMouseLeave={handleMouseLeave}
        >
          {/* Active indicator background */}
          <div
            ref={indicatorRef}
            className="absolute h-[calc(100%-0.5rem)] bg-stone-800 rounded-md top-1 z-0 opacity-0"
            style={{
              transition: 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
              willChange: 'transform, width, opacity'
            }}
          />

          {/* Navigation items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-center gap-2 sm:gap-2 px-4 py-3 sm:px-4 sm:py-3 border-1 border-gray-100 rounded-md text-base sm:text-sm relative no-underline transition-colors duration-200 ease-in z-10 min-h-[44px] sm:min-h-0
                  ${pathname === item.path
                    ? "text-zinc-100"
                    : hoveredItem === item.path
                      ? "text-zinc-200"
                      : "text-zinc-400"}`}
                data-active={pathname === item.path}
                onMouseEnter={() => handleMouseEnter(item.path)}
              >
                <Icon size={20} className="flex-shrink-0 sm:hidden" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
