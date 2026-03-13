import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-awtar-blue text-xs font-black text-white">
                        A
                    </span>
                    Awtar AI
                </div>

                <div className="flex gap-6 text-sm text-awtar-slate">
                    <Link href="#" className="hover:text-white">
                        Privacy
                    </Link>
                    <Link href="#" className="hover:text-white">
                        Terms
                    </Link>
                    <Link href="#" className="hover:text-white">
                        Contact
                    </Link>
                </div>

                <p className="text-sm text-awtar-slate/60">
                    &copy; {new Date().getFullYear()} Awtar AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
