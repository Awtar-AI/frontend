import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthSplitLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen font-sans">
            {/* Left Form Side */}
            <div className="flex-1 flex flex-col bg-white">
                <main className="flex-1 flex flex-col px-8 py-12 lg:px-16 lg:py-16 max-w-2xl w-full mx-auto">
                    {children}
                </main>
            </div>

            {/* Right Graphic Side */}
            <div className="hidden lg:flex flex-1 bg-[#091122] relative flex-col overflow-hidden">
                {/* Top bar with Logo */}
                <div className="relative z-10 px-10 pt-8 pb-4 flex items-center justify-end">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-blue-500">
                            <div className="w-5 h-5 rounded-full border-[3px] border-current flex items-center justify-center relative">
                                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-current rounded-full" />
                                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-current rounded-full" />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Awtar AI
                        </span>
                    </Link>
                </div>

                {/* Middle + Bottom wrapper */}
                <div className="flex flex-col flex-1 justify-center px-10 lg:pl-16 -translate-y-10">
                    {/* Central Graphic & Text */}
                    <div className="max-w-xl mb-10 ml-20 -mt-30">
                        <div className="relative w-52 h-52 xl:w-56 xl:h-56 mb-6">
                            <div className="absolute inset-0 rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(37,99,235,0.2)]">
                                <div className="w-40 h-40 rounded-full border border-blue-400/50 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/40 blur-xl"></div>
                                </div>
                            </div>
                            <div className="absolute inset-x-0 h-[100%] rounded-full border border-blue-400/20 rotate-45" />
                            <div className="absolute inset-x-0 h-[100%] rounded-full border border-blue-400/20 -rotate-45" />
                            <div className="absolute inset-x-0 h-[100%] rounded-full border border-blue-400/20 rotate-90" />
                        </div>

                        <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
                            Your future is
                            <br />
                            powered by
                            <br />
                            intelligence.
                        </h1>

                        <p className="text-base text-blue-100/70 leading-relaxed font-light max-w-md">
                            Join over 10,000 professionals finding their next career milestone using
                            our neural matching algorithm.
                        </p>
                    </div>

                    {/* Trust Indicators (moved up) */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={`trust-${i}`}
                                    className="w-10 h-10 rounded-full bg-gray-300 border-2 border-[#091122] overflow-hidden relative"
                                >
                                    <Image
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-blue-100/60">
                            Trusted by top industry leaders
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
