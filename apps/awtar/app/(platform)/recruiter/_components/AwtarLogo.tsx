export function AwtarLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-blue-600">
                <div className="w-[18px] h-[18px] rounded-full border-[3px] border-current flex items-center justify-center relative">
                    <div className="absolute -top-1 -right-1 w-[5px] h-[5px] bg-current rounded-full" />
                    <div className="absolute -bottom-1 -left-1 w-[5px] h-[5px] bg-current rounded-full" />
                </div>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Awtar AI</span>
        </div>
    );
}
