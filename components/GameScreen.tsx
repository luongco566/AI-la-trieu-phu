
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Question, Player, LifelineState, AnswerState, GameSettings } from '../types';
import { PRIZE_MONEY, XP_PER_CORRECT_ANSWER } from '../constants';
import { UserContext } from '../contexts/UserContext';
import { logAnswerEvent } from '../services/analyticsService';
import { getExtendedExplanation, paraphraseQuestion } from '../services/geminiService';

import PrizeLadder from './PrizeLadder';
import Timer from './Timer';
import Lifelines from './Lifelines';
import AudiencePollModal from './AudiencePollModal';
import RotateHint from './RotateHint';
import ExplainModal from './ExplainModal';
import HostControls from './HostControls';
import ReactionButtons from './ReactionButtons';
import useTTS from '../hooks/useTTS';


interface GameScreenProps {
    gameSettings: GameSettings;
    questions: Question[];
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    currentPlayerIndex: number;
    setCurrentPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
    onGameEnd: (players: Player[]) => void;
    lifelines: LifelineState;
    setLifelines: React.Dispatch<React.SetStateAction<LifelineState>>;
    isGamePaused: boolean;
    onPause: () => void;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const getSafeHavenPrize = (questionIndex: number): number => {
    if (questionIndex >= 10) return PRIZE_MONEY[5]; 
    if (questionIndex >= 5) return PRIZE_MONEY[10];
    return 0;
};


const GameScreen: React.FC<GameScreenProps> = ({ 
    gameSettings, questions: initialQuestions, players, setPlayers, currentPlayerIndex, setCurrentPlayerIndex, 
    onGameEnd, lifelines, setLifelines, isGamePaused, onPause, isDarkMode, setIsDarkMode 
}) => {
    const { addXp, profile } = useContext(UserContext);
    const [questions, setQuestions] = useState(initialQuestions);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answerState, setAnswerState] = useState<AnswerState>(AnswerState.UNSELECTED);
    const [disabledChoices, setDisabledChoices] = useState<number[]>([]);
    const [showAudiencePoll, setShowAudiencePoll] = useState(false);
    const [hint, setHint] = useState<string | null>(null);
    const [isPostAnswerPause, setIsPostAnswerPause] = useState(false);
    const [showPortraitLayout, setShowPortraitLayout] = useState(false);
    const [showExplainModal, setShowExplainModal] = useState(false);
    const [explanationText, setExplanationText] = useState("");
    const [isHostLocked, setIsHostLocked] = useState(gameSettings.gameMode === 'host');
    
    const { speak, isSpeaking } = useTTS();

    const currentPlayer = players[currentPlayerIndex];
    const currentQuestion = questions[currentPlayer?.questionIndex];

    const resetForNewQuestion = useCallback(() => {
        setSelectedAnswer(null);
        setAnswerState(AnswerState.UNSELECTED);
        setDisabledChoices([]);
        setHint(null);
        setIsPostAnswerPause(false);
        if (gameSettings.gameMode === 'host') {
            setIsHostLocked(true);
        }
    }, [gameSettings.gameMode]);

    const moveToNextTurn = useCallback((updatedPlayers: Player[]) => {
        const nextPlayerIndex = updatedPlayers.findIndex((p, idx) => idx > currentPlayerIndex && !p.isFinished);
        if (nextPlayerIndex !== -1) {
            setCurrentPlayerIndex(nextPlayerIndex);
            resetForNewQuestion();
        } else {
             const firstUnfinishedPlayer = updatedPlayers.findIndex(p => !p.isFinished);
             if (firstUnfinishedPlayer !== -1) {
                 setCurrentPlayerIndex(firstUnfinishedPlayer);
                 resetForNewQuestion();
             } else {
                onGameEnd(updatedPlayers);
             }
        }
    }, [currentPlayerIndex, onGameEnd, resetForNewQuestion, setCurrentPlayerIndex]);
    
    const handleAnswer = (isCorrect: boolean) => {
        setIsPostAnswerPause(true);
        setAnswerState(isCorrect ? AnswerState.CONFIRMED_CORRECT : AnswerState.CONFIRMED_WRONG);
        
        if (gameSettings.gameMode === 'classic') {
            logAnswerEvent({
                at: new Date().toISOString(),
                userId: profile.id,
                questionId: currentQuestion.id,
                chosenIndex: selectedAnswer!,
                correct: isCorrect,
                timeMs: 0, // Simplified for now
                mode: 'classic',
                domain: currentQuestion.domain,
            });

            if(isCorrect) {
                addXp(XP_PER_CORRECT_ANSWER[currentPlayer.questionIndex]);
            }
        }

        setTimeout(() => {
            setPlayers(prevPlayers => {
                const updatedPlayers = [...prevPlayers];
                const playerToUpdate = { ...updatedPlayers[currentPlayerIndex] };

                if (isCorrect) {
                    if (playerToUpdate.questionIndex === questions.length - 1) {
                        playerToUpdate.isFinished = true;
                        playerToUpdate.finalPrize = PRIZE_MONEY[0];
                    } else {
                        playerToUpdate.questionIndex += 1;
                    }
                } else {
                    playerToUpdate.isFinished = true;
                    playerToUpdate.finalPrize = getSafeHavenPrize(playerToUpdate.questionIndex);
                }
                
                updatedPlayers[currentPlayerIndex] = playerToUpdate;
                
                if (playerToUpdate.isFinished) {
                    moveToNextTurn(updatedPlayers);
                } else {
                    resetForNewQuestion();
                }

                return updatedPlayers;
            });
        }, 3000);
    };

    const confirmAnswer = () => {
        if (selectedAnswer === null || answerState !== AnswerState.SELECTED) return;
        handleAnswer(selectedAnswer === currentQuestion.correctIndex);
    };

    const handleTimeout = useCallback(() => {
        if (!isPostAnswerPause && !isGamePaused) {
            handleAnswer(false);
        }
    }, [isPostAnswerPause, isGamePaused, handleAnswer]);
    
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (isGamePaused || isPostAnswerPause || isHostLocked) return;

            if (e.key >= '1' && e.key <= '4') {
                const choiceIndex = parseInt(e.key, 10) - 1;
                if (!disabledChoices.includes(choiceIndex) && (answerState === AnswerState.UNSELECTED || answerState === AnswerState.SELECTED)) {
                    setSelectedAnswer(choiceIndex);
                    setAnswerState(AnswerState.SELECTED);
                }
            } else if (e.key === 'Enter' && selectedAnswer !== null && answerState === AnswerState.SELECTED) {
                confirmAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedAnswer, answerState, disabledChoices, confirmAnswer, isGamePaused, isPostAnswerPause, isHostLocked]);


    const handleShowExplanation = async () => {
        setExplanationText("AI đang phân tích, vui lòng chờ...");
        setShowExplainModal(true);
        const text = await getExtendedExplanation(currentQuestion);
        setExplanationText(text);
    };

    const handleParaphrase = async () => {
        const paraphrased = await paraphraseQuestion(currentQuestion);
        if(paraphrased) {
            const newQuestion = { ...currentQuestion, ...paraphrased };
            setQuestions(prev => prev.map(q => q.id === newQuestion.id ? newQuestion : q));
        }
    };

    if (!currentPlayer || !currentQuestion) {
        return <div className="flex items-center justify-center h-screen bg-[#1e124d]">Đang tải...</div>;
    }
    
    const getChoiceClass = (index: number) => {
        let baseClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-semibold text-lg flex items-center shadow-lg min-h-[70px]";
        
        if (disabledChoices.includes(index)) return `${baseClass} bg-gray-700/70 border-gray-600 text-gray-400 opacity-60 cursor-not-allowed`;
        if (isHostLocked) return `${baseClass} bg-indigo-900/80 border-purple-500 cursor-not-allowed`;
        
        const unselectedClass = "bg-indigo-900/80 border-purple-500 hover:bg-indigo-800/80 hover:border-purple-400";

        switch (answerState) {
            case AnswerState.SELECTED:
                return index === selectedAnswer ? `${baseClass} bg-orange-500 text-black border-orange-300 scale-105 shadow-orange-500/50` : `${baseClass} ${unselectedClass}`;
            case AnswerState.CONFIRMED_CORRECT:
                return index === currentQuestion.correctIndex ? `${baseClass} bg-green-600 text-white border-green-400 animate-pulse` : `${baseClass} ${unselectedClass} opacity-50`;
            case AnswerState.CONFIRMED_WRONG:
                if (index === selectedAnswer) return `${baseClass} bg-red-600 text-white border-red-400`;
                if (index === currentQuestion.correctIndex) return `${baseClass} bg-green-600 text-white border-green-400 animate-pulse`;
                return `${baseClass} ${unselectedClass} opacity-50`;
            default:
                return `${baseClass} ${unselectedClass}`;
        }
    };
    
    const handleSelectAnswer = (index: number) => {
        if (answerState === AnswerState.UNSELECTED || answerState === AnswerState.SELECTED) {
            setSelectedAnswer(index);
            setAnswerState(AnswerState.SELECTED);
        }
    }

    const QuestionArea = () => (
        <div className="w-full h-full flex flex-col justify-center items-center">
            {hint && (
                <div className="mb-4 p-3 bg-blue-900/50 rounded-lg border border-blue-400 text-center w-full max-w-4xl">
                    <p className="text-base font-semibold text-blue-300">Gợi ý:</p>
                    <p className="italic text-white text-sm">{hint}</p>
                </div>
            )}
            <div className="w-full max-w-4xl bg-black/20 border-2 border-purple-600 rounded-2xl p-4 md:p-6 shadow-lg flex-grow flex flex-col justify-center relative">
                 <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={handleParaphrase} title="Biến thể câu hỏi" className="p-2 rounded-full bg-blue-600/50 hover:bg-blue-500/50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                    <button onClick={handleShowExplanation} title="Giải thích sâu" className="p-2 rounded-full bg-green-600/50 hover:bg-green-500/50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></button>
                 </div>
                <h3 className="text-xl md:text-3xl font-bold text-center mb-6">Câu {currentPlayer.questionIndex + 1}: {currentQuestion.question}</h3>
                <div className="grid grid-cols-1 portrait:grid-cols-2 landscape:md:grid-cols-2 gap-3">
                    {currentQuestion.choices.map((choice, i) => (
                        <button key={i} onClick={() => handleSelectAnswer(i)} className={getChoiceClass(i)} disabled={isGamePaused || disabledChoices.includes(i) || isPostAnswerPause || isHostLocked}>
                            <span className="font-bold mr-3 text-yellow-400">{String.fromCharCode(65 + i)}:</span>
                            <span>{choice}</span>
                        </button>
                    ))}
                </div>
            </div>
            {selectedAnswer !== null && answerState === AnswerState.SELECTED && !isHostLocked && (
                <button onClick={confirmAnswer} className="mt-4 px-10 py-3 text-lg font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 animate-pulse">
                    Chắc chắn
                </button>
            )}
        </div>
    );

    const Header = () => (
         <header className="w-full flex justify-between items-center p-2 flex-wrap gap-y-2">
            <h2 className="text-lg md:text-2xl font-bold order-1 flex items-center">
                { profile.equippedCosmetics.avatar && <img src={profile.equippedCosmetics.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 border-2 border-yellow-400" /> }
                Lượt của: <span className="text-yellow-400 ml-2">{currentPlayer.name}</span>
            </h2>
            <div className="order-2 landscape:absolute landscape:left-1/2 landscape:-translate-x-1/2">
                <Timer duration={30} onTimeout={handleTimeout} isPaused={isPostAnswerPause || showAudiencePoll || isGamePaused || isHostLocked} key={`${currentPlayer.id}-${currentPlayer.questionIndex}`}/>
            </div>
            <div className="flex items-center space-x-2 order-3">
                <Lifelines lifelines={lifelines} setLifelines={setLifelines} currentQuestion={currentQuestion} setDisabledChoices={setDisabledChoices} setShowAudiencePoll={setShowAudiencePoll} setHint={setHint} isGamePaused={isGamePaused} />
                <button onClick={onPause} className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white" aria-label="Tạm dừng">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
                </button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white">
                    {isDarkMode ? '🌞' : '🌜'}
                </button>
            </div>
        </header>
    );

    return (
        <div className="relative">
            {!showPortraitLayout && <RotateHint onContinuePortrait={() => setShowPortraitLayout(true)} />}

            <div className={`min-h-screen bg-[#1e124d] text-white font-['Roboto',_sans-serif] ${showPortraitLayout ? 'portrait:block' : 'hidden'} landscape:block`}>
                <div className="hidden landscape:flex landscape:flex-col h-screen p-4">
                    <Header />
                    <div className="flex-grow grid grid-cols-[1fr_320px] gap-6 mt-4">
                        <main className="flex flex-col justify-center items-center"><QuestionArea /></main>
                        <aside className="h-full bg-black/30 rounded-xl p-4"><PrizeLadder currentQuestionIndex={currentPlayer.questionIndex} /></aside>
                    </div>
                </div>
                <div className="landscape:hidden portrait:flex portrait:flex-col h-screen p-2 space-y-3">
                    <Header />
                    <main className="flex flex-col justify-center items-center flex-grow"><QuestionArea /></main>
                    <aside>
                        <details className="bg-black/30 rounded-xl p-2">
                             <summary className="cursor-pointer font-bold p-2 text-center text-yellow-400">Thang tiền</summary>
                             <div className="pt-2"><PrizeLadder currentQuestionIndex={currentPlayer.questionIndex} /></div>
                        </details>
                    </aside>
                </div>
            </div>

            { gameSettings.gameMode === 'classic' && <ReactionButtons /> }
            { gameSettings.gameMode === 'host' && <HostControls question={currentQuestion} onLockChange={setIsHostLocked} speak={speak} isSpeaking={isSpeaking} onCorrect={() => handleAnswer(true)} onWrong={() => handleAnswer(false)} /> }
            { showAudiencePoll && (<AudiencePollModal question={currentQuestion} onClose={() => setShowAudiencePoll(false)} />)}
            { showExplainModal && (<ExplainModal content={explanationText} onClose={() => setShowExplainModal(false)} />)}
        </div>
    );
};

export default GameScreen;
