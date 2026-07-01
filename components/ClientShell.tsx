"use client";
import dynamic from "next/dynamic";

const Cursor       = dynamic(() => import("@/components/Cursor"),       { ssr: false });
const Terminal     = dynamic(() => import("@/components/Terminal"),      { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <Terminal />
      {children}
    </>
  );
}
