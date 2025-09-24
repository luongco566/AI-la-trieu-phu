
import { useState, useEffect, useCallback } from 'react';

const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const loadVoices = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices);
        }
    }, []);

    useEffect(() => {
        loadVoices();
        // The voices list is often loaded asynchronously.
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, [loadVoices]);

    const speak = useCallback((text: string) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
        }
        
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "vi-VN";
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            const vietnameseVoice = voices.find(v => v.lang === "vi-VN");
            if (vietnameseVoice) {
                utterance.voice = vietnameseVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Text-to-Speech error:", error);
            setIsSpeaking(false);
        }
    }, [voices, isSpeaking]);

    return { speak, isSpeaking };
};

export default useTTS;
