import {useCallback, useEffect, useMemo, useState} from "react";
import SingleCard from "./SingleCard";
import { log } from "react-modal/lib/helpers/ariaAppHider";

const cardImages = [
  { src: "./img/product-1.jpg", matched: false },
  { src: "./img/product-2.jpg", matched: false },
  { src: "./img/product-3.jpg", matched: false },
  { src: "./img/product-4.jpg", matched: false },
  { src: "./img/product-5.jpg", matched: false },
  { src: "./img/product-6.jpg", matched: false },
  { src: "./img/product-7.jpg", matched: false },
  { src: "./img/product-8.jpg", matched: false },
];
const REMAIN_MOVES = 40
const TIME = 400

function App() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [remainingMoves, setRemainingMoves] = useState(REMAIN_MOVES);
  const [gameStarted, setGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(TIME);
  const [isModalOpen, setIsModalOpen] = useState(false);

//start game
  const restartGame = () => {
    const shuffledCards = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, id: Math.random() }));
    setFirstChoice(null);
    setSecondChoice(null);
    setCards(shuffledCards);
    setRemainingMoves(REMAIN_MOVES);
    setGameStarted(false);
    setSeconds(TIME);
    setIsModalOpen(false)
  };

//restartGame
  useEffect(() => {
    restartGame();
  }, []);

  const choiceHandler = useCallback((card)=>{
    if (seconds <= 0 || remainingMoves === 0) {
      return;
    }
    if (!gameStarted) {
      setGameStarted(true);
    }
    (firstChoice && card.id !== firstChoice.id) ? setSecondChoice(card) : setFirstChoice(card);
  }, [seconds, remainingMoves, gameStarted, setGameStarted, firstChoice, setFirstChoice, secondChoice, setSecondChoice])

  //resetTurn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  }
  const isDisabled = useMemo(()=>firstChoice && secondChoice, [firstChoice, secondChoice])

  //check if cards are matched
  useEffect(() => {
    if (!firstChoice || !secondChoice) {
      return;
    }
    if (isDisabled) {setDisabled(true)}
    if (firstChoice.src === secondChoice.src) {
      // Update Cards State
      setCards((prevCards) =>
          prevCards.map((card) =>
              card.src === firstChoice.src ? { ...card, matched: true } : card
          ));
      resetTurn();
    } else {
      setTimeout(resetTurn, 1000);
    }
  }, [firstChoice, secondChoice]);

  useEffect(()=>{
    if ( firstChoice || secondChoice){setRemainingMoves((prevMoves) => (prevMoves - 1))}
  }, [firstChoice, secondChoice])
  
  useEffect(() => {
    if (seconds <= 0 || !gameStarted || remainingMoves === 0) {
      return;
    }
    // Set up the timer
    //repeatedly calls a function or executes a code snippet with a fixed time delay between each call
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds, gameStarted, remainingMoves]);

  //check if games end
  const isGameEnd = useMemo(() => {
    if (cards.every((card) => card.matched) && remainingMoves !== REMAIN_MOVES ||
        seconds <= 0 ||
        remainingMoves === 0
    ) {
      setIsModalOpen(true)
    }
    return(null);
  }, [cards, seconds, remainingMoves]);

  //open modal
  useEffect(() => {
    isGameEnd && isModalOpen ();
  }, [isGameEnd]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
      <div className="mx-32 font-mono my-10 flex items-center justify-center gap-4">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-value mb-2">
                <button className="btn btn-sm" onClick={()=>{restartGame()}}>
                  New Game
                </button>
              </div>
              <div className="stat-desc">START A NEW GAME</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-secondary">{formatTime(seconds)}</div>
              <div className="stat-desc text-secondary">↗︎Time</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title"></div>
              <div className="stat-value">{remainingMoves}</div>
              <div className="stat-desc">↘︎Remaining Moves</div>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 gap-4">
          {cards.map((item) => (
              <SingleCard
                  disabled={disabled}
                  choiceHandler={choiceHandler}
                  item={item}
                  key={item.id}
                  flipped={item === firstChoice || item === secondChoice || item.matched}
              />
          ))}
        </div>{ isModalOpen &&
          <dialog id="my_modal_1" className="modal opacity-100 z-50 pointer-events-auto">
            <div className="modal-box">
              <p className="py-4">
                {cards.some((card) => !card.matched) ? "You lose!" : "You win!"}
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-secondary" onClick={restartGame}>
                    New Game
                  </button>
                </form>
              </div>
            </div>
          </dialog>
      }
      </div>
  );
}
export default App;

