"use client";

import dynamic from "next/dynamic";
import type { CompanyInfo } from "@/data/company";

// Lazy-load the Leaflet map only on the client to avoid `window` access during SSR
const ContactMap = dynamic(() => import("./ContactMap"), { ssr: false });

interface ContactMapClientProps {
  company: CompanyInfo;
}

export default function ContactMapClient({ company }: ContactMapClientProps) {
  return <ContactMap company={company} />;
}
