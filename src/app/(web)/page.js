import AtdMoneyBanner from "@/components/sections/AtdMoneyBanner";
import CategorySection from "@/components/sections/CategorySection";
import EditorsAndWatchedGrid from "@/components/sections/EditorsAndWatchedGrid";
import HeroSection from "@/components/sections/HeroSection";
import HoroscopeSection from "@/components/sections/HoroscopeSection";
import LatestVideosSection from "@/components/sections/LatestVideosSection";
import MyAstroBanner from "@/components/sections/MyAstroBanner";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TrendingSection from "@/components/sections/TrendingSection";

export default function HomePage() {
  return (
    <div className="max-w-8xl mx-auto  py-8">
      <HeroSection/>
      <TrendingSection/>
      <CategorySection/>
      <AtdMoneyBanner/>
      <LatestVideosSection/>
      <EditorsAndWatchedGrid/>
      <HoroscopeSection/>
      <MyAstroBanner/>
      <NewsletterSection/>
      
    </div>
  );
}