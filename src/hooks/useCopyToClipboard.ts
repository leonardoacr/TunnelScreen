import { useState } from "react";

export function useCopyToClipboard() {
  const [result, setResult] = useState<
    null | { state: "success" } | { state: "error"; message: string }
  >(null);

  const copy = async (text: string) => {
    try {
      if (text !== "" || null || undefined) {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setResult({ state: "success" });
      } else {
        setResult({ state: "error", message: "Please generate an ID to copy" });
      }
    } catch (e: any) {
      setResult({ state: "error", message: e.message });
      throw e;
    } finally {
      setTimeout(() => {
        setResult(null);
      }, 6000);
    }
  };

  return [copy, result] as const;
}
