import AtdMoneyBanner from "@/components/sections/AtdMoneyBanner";
import BreakingNewsTicker from "@/components/sections/BreakingNewsTicker";
import CategorySection from "@/components/sections/CategorySection";
import EditorsAndWatchedGrid from "@/components/sections/EditorsAndWatchedGrid";
import HeroSection from "@/components/sections/HeroSection";
import HoroscopeSection from "@/components/sections/HoroscopeSection";
import LatestVideosSection from "@/components/sections/LatestVideosSection";
import MyAstroBanner from "@/components/sections/MyAstroBanner";
import LatestNewsSection from "@/components/sections/news-section/LatestNewsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TrendingSection from "@/components/sections/TrendingSection";

export default function HomePage() {
  return (
    <div className="max-w-8xl mx-auto pt-2 pb-8">
      <BreakingNewsTicker />
      <HeroSection/>
      <TrendingSection/>
      <CategorySection/>
      <AtdMoneyBanner/>
      <LatestVideosSection/>
      <LatestNewsSection />
      <EditorsAndWatchedGrid/>
      <HoroscopeSection/>
      <MyAstroBanner/>
      <NewsletterSection/>
      
    </div>
  );
}