"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Slide {
    src: string;
    alt: string;
    caption: string;
}

const SLIDES: Slide[] = [
    {
        src: "/images/slide-recruiter.jpg",
        alt: "Recruiter reviewing candidates on Awtar AI dashboard",
        caption: "AI-powered candidate screening",
    },
    {
        src: "/images/slide-matching.jpg",
        alt: "Intelligent matching between recruiters and candidates",
        caption: "Smart talent-job matching",
    },
    {
        src: "/images/slide-analytics.jpg",
        alt: "Recruitment analytics and insights dashboard",
        caption: "Real-time hiring analytics",
    },
    {
        src: "/images/slide-interview.jpg",
        alt: "AI-assisted interview scheduling",
        caption: "Streamlined interview process",
    },
];

export function ImageCarousel() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="relative py-20" id="features">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Recruiting, reimagined
                    </h2>
                    <p className="mt-4 text-lg text-awtar-slate">
                        See how Awtar AI transforms every step of the hiring pipeline.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-awtar-navy-light">
                    <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
                        {SLIDES.map((slide, i) => (
                            <div
                                key={slide.src}
                                className="absolute inset-0 transition-all duration-700 ease-in-out"
                                style={{
                                    opacity: i === current ? 1 : 0,
                                    transform: `scale(${i === current ? 1 : 1.05})`,
                                }}
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 1280px"
                                    priority={i === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-awtar-navy/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                    <p className="text-xl font-semibold text-white drop-shadow-lg">
                                        {slide.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                        {SLIDES.map((slide, i) => (
                            <button
                                key={slide.src}
                                type="button"
                                onClick={() => setCurrent(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === current
                                        ? "w-8 bg-awtar-blue"
                                        : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
