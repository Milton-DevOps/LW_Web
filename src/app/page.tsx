import { Carousel, Navbar } from "@/components";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Main content goes here */}
        <Carousel />
      </main>
      <Footer />
    </div>
  );
}
