export function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="rounded-lg px-4 py-3 bg-muted">
                <div className="flex items-center gap-1 h-5">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    )
}
