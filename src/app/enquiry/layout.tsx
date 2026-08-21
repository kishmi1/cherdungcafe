import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Make an Enquiry - Cherdung Café",
  description: "Have a question or want to learn more about our services? Send us an enquiry and we'll get back to you within 24 hours.",
  openGraph: {
    title: "Make an Enquiry - Cherdung Café",
    description: "Have a question or want to learn more about our services? We'd love to hear from you!",
  },
}

export default function EnquiryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}