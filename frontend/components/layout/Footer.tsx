"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api, PublicSettings } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/booking", label: "Book a Service" },
];

const socialIcons = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const FALLBACK: Partial<PublicSettings> = {
  phone: "(916) 530-7539",
  email: "Cammy@moonideas.com",
  instagram_url: "https://instagram.com/moonideas",
  facebook_url: "https://facebook.com/moonideas",
  youtube_url: "",
  footer_bio: "Professional auto repair and mechanic services. Reliable mobile service and drop-off service available.",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<Partial<PublicSettings>>(FALLBACK);

  useEffect(() => {
    api.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const socials = [
    { label: "Instagram", href: settings.instagram_url, icon: socialIcons.instagram },
    { label: "Facebook",  href: settings.facebook_url,  icon: socialIcons.facebook  },
    { label: "YouTube",   href: settings.youtube_url,   icon: socialIcons.youtube   },
  ].filter((s) => s.href);

  return (
    <footer className="bg-background-secondary border-t border-border mt-auto" aria-label="Site footer">
      <div className="divider-gold" aria-hidden="true" />

      <div className="content-width px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="Moon Ideas — Home">
              <Image
                src="/logo.png"
                alt="Moon Ideas"
                width={120}
                height={48}
                className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(201,168,76,0.35)]"
              />
            </Link>
            <p className="text-silver text-sm leading-relaxed max-w-xs">
              {settings.footer_bio}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Moon Ideas on ${s.label}`}
                    className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-silver hover:text-gold hover:border-gold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase text-silver-dark">Navigation</h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-silver text-sm hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold tracking-widest uppercase text-silver-dark">Contact</h3>
            <ul className="flex flex-col gap-3">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-silver text-sm hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone?.replace(/\D/g, "")}`} className="flex items-center gap-2 text-silver text-sm hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-2">
              <Link href="/booking" className="inline-block px-5 py-2.5 text-sm font-semibold font-display rounded-md bg-gold-gradient text-background hover:shadow-gold-glow-strong transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Book a Service
              </Link>
            </div>
          </div>
        </div>

        <div className="divider-gold mt-16 mb-6" aria-hidden="true" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-silver-dark text-xs font-sans">
          <p>© {currentYear} Moon Ideas. All rights reserved.</p>
          <p>Mobile Service<span className="text-gold mx-1">•</span>Drop-Off Service</p>
        </div>
      </div>
    </footer>
  );
}
