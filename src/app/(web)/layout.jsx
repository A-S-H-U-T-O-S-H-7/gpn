import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import VideoModalProvider from "@/components/video/VideoModalProvider";

export default function WebLayout({ children }) {
  return (
    <VideoModalProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer/>
    </VideoModalProvider>
  );
}
