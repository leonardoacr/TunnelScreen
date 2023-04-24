import { useState } from "react";

export function useCopyToClipboard() {
    const [result, setResult] = useState<
        null | { state: 'success' } | { state: 'error'; message: string }
    >(null);

    const copy = async (text: string) => {
        try {
            if (text !== '' || null || undefined) {
                await navigator.clipboard.writeText(text);
                setResult({ state: 'success' });
            } else {
                setResult({ state: 'error', message: 'Please generate an ID to copy' });
            }
        } catch (e: any) {
            setResult({ state: 'error', message: e.message });
            throw e;
        } finally {
            setTimeout(() => {
                setResult(null);
            }, 6000);
        }
    };

    return [copy, result] as const;
}