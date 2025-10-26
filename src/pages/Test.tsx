
import React, { useState, useEffect } from 'react';
import { apiService, GameScore } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Test = () => {
    const { currentUser } = useAuth();
    const [gameState, setGameState] = useState<'waiting' | 'showing' | 'playing' | 'finished'>('waiting');
    const [sequence, setSequence] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const [gameEndTime, setGameEndTime] = useState<number>(0);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [showResult, setShowResult] = useState(false);

    const generateSequence = (length: number): number[] => {
        const numbers = Array.from({ length: 18 }, (_, i) => i + 1);
        const shuffled = numbers.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, length);
    };

    const startGame = () => {
        const sequenceLength = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
        const newSequence = generateSequence(sequenceLength);
        setSequence(newSequence);
        setUserInput([]);
        setCurrentStep(0);
        setScore(0);
        setGameState('showing');
        setGameStartTime(Date.now());
        setShowResult(false);
    };

    const handleCellClick = (cellNumber: number) => {
        if (gameState !== 'playing') return;

        const newUserInput = [...userInput, cellNumber];
        setUserInput(newUserInput);

        // Check if the input matches the sequence so far
        const isCorrect = newUserInput.every((input, index) => input === sequence[index]);
        
        if (!isCorrect) {
            // Game over
            setGameState('finished');
            setGameEndTime(Date.now());
            setScore(userInput.length);
            setShowResult(true);
            submitScore();
        } else if (newUserInput.length === sequence.length) {
            // Round completed successfully
            setScore(sequence.length);
            setUserInput([]);
            setCurrentStep(0);
            // Start next round with longer sequence
            const nextLength = sequence.length + (difficulty === 'easy' ? 1 : 2);
            const newSequence = generateSequence(nextLength);
            setSequence(newSequence);
            setGameState('showing');
        }
    };

    const submitScore = async () => {
        if (!currentUser?.uid) return;

        try {
            const gameDuration = Math.round((gameEndTime - gameStartTime) / 1000);
            const gameScore: GameScore = {
                user_id: parseInt(currentUser.uid) || 1,
                score: score,
                game_duration: gameDuration,
                difficulty: difficulty,
                created_at: new Date().toISOString()
            };

            await apiService.submitGameScore(gameScore);
            console.log('Score submitted successfully');
        } catch (error) {
            console.error('Failed to submit score:', error);
        }
    };

    const resetGame = () => {
        setGameState('waiting');
        setSequence([]);
        setUserInput([]);
        setCurrentStep(0);
        setScore(0);
        setShowResult(false);
    };

    // Auto-advance through showing phase
    useEffect(() => {
        if (gameState === 'showing') {
            const timer = setTimeout(() => {
                setGameState('playing');
            }, 2000); // Show sequence for 2 seconds
            return () => clearTimeout(timer);
        }
    }, [gameState, sequence]);

    const getCellClass = (cellNumber: number) => {
        let classes = 'game-board-cell';
        
        if (gameState === 'showing' && sequence.includes(cellNumber)) {
            classes += ' highlighted';
        }
        
        if (gameState === 'playing' && userInput.includes(cellNumber)) {
            classes += ' selected';
        }
        
        return classes;
    };

    return (
        <div className="test-container">
            <h1>Memory Game</h1>
            
            {gameState === 'waiting' && (
                <div className="game-setup">
                    <h2>Choose Difficulty</h2>
                    <div className="difficulty-buttons">
                        <button 
                            className={difficulty === 'easy' ? 'active' : ''}
                            onClick={() => setDifficulty('easy')}
                        >
                            Easy (4-6 items)
                        </button>
                        <button 
                            className={difficulty === 'medium' ? 'active' : ''}
                            onClick={() => setDifficulty('medium')}
                        >
                            Medium (6-10 items)
                        </button>
                        <button 
                            className={difficulty === 'hard' ? 'active' : ''}
                            onClick={() => setDifficulty('hard')}
                        >
                            Hard (8-14 items)
                        </button>
                    </div>
                    <button className="start-button" onClick={startGame}>
                        Start Game
                    </button>
                </div>
            )}

            {gameState === 'showing' && (
                <div className="game-instructions">
                    <h2>Memorize the sequence!</h2>
                    <p>Watch the highlighted cells carefully...</p>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="game-instructions">
                    <h2>Now click the cells in the same order!</h2>
                    <p>Score: {score} | Progress: {userInput.length}/{sequence.length}</p>
                </div>
            )}

            {gameState === 'finished' && showResult && (
                <div className="game-result">
                    <h2>Game Over!</h2>
                    <div className="result-stats">
                        <p>Final Score: <strong>{score}</strong></p>
                        <p>Difficulty: <strong>{difficulty}</strong></p>
                        <p>Duration: <strong>{Math.round((gameEndTime - gameStartTime) / 1000)}s</strong></p>
                    </div>
                    <div className="result-buttons">
                        <button onClick={startGame}>Play Again</button>
                        <button onClick={resetGame}>Change Difficulty</button>
                    </div>
                </div>
            )}

            <div className="game-board">
                <div className="game-board-row">
                    <div className={getCellClass(1)} onClick={() => handleCellClick(1)}>1</div>
                    <div className={getCellClass(2)} onClick={() => handleCellClick(2)}>2</div>
                    <div className={getCellClass(3)} onClick={() => handleCellClick(3)}>3</div>
                </div>
                <div className="game-board-row">
                    <div className={getCellClass(4)} onClick={() => handleCellClick(4)}>4</div>
                    <div className={getCellClass(5)} onClick={() => handleCellClick(5)}>5</div>
                    <div className={getCellClass(6)} onClick={() => handleCellClick(6)}>6</div>
                </div>
                <div className="game-board-row">
                    <div className={getCellClass(7)} onClick={() => handleCellClick(7)}>7</div>
                    <div className={getCellClass(8)} onClick={() => handleCellClick(8)}>8</div>
                    <div className={getCellClass(9)} onClick={() => handleCellClick(9)}>9</div>
                </div>
                <div className="game-board-row">
                    <div className={getCellClass(10)} onClick={() => handleCellClick(10)}>10</div>
                    <div className={getCellClass(11)} onClick={() => handleCellClick(11)}>11</div>
                    <div className={getCellClass(12)} onClick={() => handleCellClick(12)}>12</div>
                </div>
                <div className="game-board-row">
                    <div className={getCellClass(13)} onClick={() => handleCellClick(13)}>13</div>
                    <div className={getCellClass(14)} onClick={() => handleCellClick(14)}>14</div>
                    <div className={getCellClass(15)} onClick={() => handleCellClick(15)}>15</div>
                </div>
                <div className="game-board-row">
                    <div className={getCellClass(16)} onClick={() => handleCellClick(16)}>16</div>
                    <div className={getCellClass(17)} onClick={() => handleCellClick(17)}>17</div>
                    <div className={getCellClass(18)} onClick={() => handleCellClick(18)}>18</div>
                </div>
            </div>
        </div>
    )
}

export default Test;