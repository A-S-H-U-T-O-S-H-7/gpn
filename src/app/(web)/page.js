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
import ShortsWrapper from "@/components/sections/shorts/ShortsWrapper";
import Top10TrendingCombined from "@/components/sections/Top10TrendingCombined";
import LazySection from "@/components/LazySection";

export default function HomePage() {
  return (
    <div className="max-w-8xl mx-auto pt-2 pb-8">
      {/* Above the fold - load immediately */}
      <BreakingNewsTicker />
      <HeroSection/>
      <Top10TrendingCombined />
      <CategorySection/>

      {/* Below the fold - load (and fetch data) as the visitor scrolls near them */}
      <LazySection minHeight={520}>
        <ShortsWrapper />
      </LazySection>

      <LazySection minHeight={220}>
        <AtdMoneyBanner/>
      </LazySection>

      <LazySection minHeight={900} id="latest-videos-section">
        <LatestVideosSection/>
      </LazySection>

      <LazySection minHeight={900} id="latest-news-section">
        <LatestNewsSection />
      </LazySection>

      <LazySection minHeight={600}>
        <EditorsAndWatchedGrid/>
      </LazySection>

      <LazySection minHeight={500}>
        <HoroscopeSection/>
      </LazySection>

      <LazySection minHeight={220}>
        <MyAstroBanner/>
      </LazySection>

      <LazySection minHeight={300}>
        <NewsletterSection/>
      </LazySection>
    </div>
  );
}
