"use client";

import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";

const menu = [
  { label: "Workshopy", href: "/workshopy" },
  { label: "Kalendár", href: "/kalendar" },
  { label: "O mne", href: "/o-mne" },
  { label: "Súkromné akcie", href: "/sukromne-akcie" },
  { label: "Kontakt", href: "/kontakt" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-200/60 bg-paper/85 backdrop-blur-md">
      <Container large className="!py-4">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex items-center justify-between gap-6">
                <Link
                  href="/"
                  className="flex items-center"
                  aria-label="Tvorivko domov">
                  <Image
                    src="/img/logo.png"
                    alt="Tvorivko"
                    width={3000}
                    height={3000}
                    priority
                    sizes="64px"
                    className="h-16 w-16 object-contain"
                  />
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                  {menu.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-rose-light hover:text-rose-dark">
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="hidden md:block">
                  <Link href="/kalendar" className="btn-rose">
                    Rezervuj miesto
                  </Link>
                </div>

                <Disclosure.Button
                  aria-label="Otvoriť menu"
                  className="rounded-full p-2 text-ink hover:bg-rose-light md:hidden">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24">
                    {open ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </Disclosure.Button>
              </div>

              <Disclosure.Panel className="md:hidden">
                <nav className="mt-4 flex flex-col gap-1 border-t border-paper-200 pt-4">
                  {menu.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-base font-medium text-ink-soft hover:bg-rose-light hover:text-rose-dark">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/kalendar" className="btn-rose mt-3 w-full">
                    Rezervuj miesto
                  </Link>
                </nav>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </Container>
    </header>
  );
}
