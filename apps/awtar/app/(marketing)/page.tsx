import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { HowItWorks } from "./_components/how-it-works";
import { ImageCarousel } from "./_components/image-carousel";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <ImageCarousel />
            <HowItWorks />
            <Footer />
        </>
    );
}
