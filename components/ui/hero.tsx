"use client";

import Link from "next/link";
import Canvas from "./canvas";
import { Plus, ArrowRight, Shapes } from "lucide-react";
import { Button } from "./button";

export function Hero() {
  return (
    <section id="home" className="h-full min-h-dvh">
      <div className="animation-delay-8 animate-fadeIn flex flex-col items-center justify-center px-4 text-center ">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
            <Shapes className="h-5 p-1" /> Introducing Design Platform
            <a href="/products" className="hover:text-primary ml-1 flex items-center font-semibold">
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Explore <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mb-10 mt-4 md:mt-6 z-10">
          <div className="px-2">
            <div className="relative mx-auto space-y-8 h-full max-w-7xl border p-2 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-10">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <Plus strokeWidth={4} className="absolute -left-5 -top-5 h-10 w-10" />
                <Plus strokeWidth={4} className="absolute -bottom-5 -left-5 h-10 w-10" />
                <Plus strokeWidth={4} className="absolute -right-5 -top-5 h-10 w-10" />
                <Plus strokeWidth={4} className="absolute -bottom-5 -right-5 h-10 w-10" />
                Your complete agency for Design and Development.
              </h1>
              <div className="flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available Now</p>
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-2xl">
            Welcome to our development agency! We&#39;re{" "}
            <span className="font-bold text-primary">TEKI</span>
          </h1>

          <p className="md:text-md mx-auto mb-12 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            We craft enchanting visuals - websites - solutions for brands, and conjure design and code resources to empower developers.
          </p>
          
          <div className="flex justify-center gap-2">
            <Link href="/dashboard">
              <Button variant="default" size="lg">
                Buy a template
              </Button>
            </Link>
            <Link href="https://calendly.com/your-link" target="_blank">
              <Button variant="outline" size="lg">
                Book a call
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 mx-auto bg-background">
        <Canvas />
      </div>
    </section>
  );
}
