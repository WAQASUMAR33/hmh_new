
import Header from "../home/components/header";
import Footer from "../home/components/footer";
import Hero from "../home/components/hero";
import Status_bar from "../home/components/statusBar";
import Trusted_brand from "../home/components/trustedBrands";
import Brand_Solutions from "../home/components/brandSolutions";
import Publisher_Solutions from "../home/components/PublisherSolutions";
import ReadAboutUs from "../home/components/ReadAboutUs";
import InfluencerSlider from "./components/InfluencerSlider";
import PromoSlider from "./components/PromoSlider";
import DropshippingSteps from "./components/DropshippingSteps";
import WhatHMHOffer from "./components/WhatHmhOffer";
import OurAdvantages from "./components/OurAdvantages";
import CaseStudies from "./components/CaseStudies";
import CaseStudiesCarousel from "./components/CaseStudiesCarousel";
import IndustryInsights from "./components/IndustryInsights";

export default function Home() {
    return (
        <>
            {/* Global header */}
            <Header />
            <Hero />
            <Status_bar />
            <Trusted_brand />
            <Brand_Solutions />
            <Publisher_Solutions />
            <ReadAboutUs />
            <InfluencerSlider />
            <PromoSlider />
            <DropshippingSteps />
            <WhatHMHOffer />
            <OurAdvantages />
            <CaseStudies />
            <CaseStudiesCarousel />
            <IndustryInsights />
            <Footer />
        </>
    );
}
