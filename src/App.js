import {useEffect, useRef, useState} from "react";
import SingleCard from "./SingleCard";

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

function App() {
  const [cards, setCards] = useState([]);
  const [firstChoise, setFirstChoise] = useState(null);
  const [secondChoise, setSecondChoise] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [remainingMoves, setRemainingMoves] = useState(40);
  const [gameStarted, setGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(120);

  // shuffle cards for a new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, id: Math.random() }));

    setFirstChoise(null);
    setSecondChoise(null);
    setCards(shuffledCards);
    setRemainingMoves(40); // Set your desired default value for moves
    setGameStarted(false);
    setSeconds(120);
  };

  const choiceHandeler = (card) => {
    if (seconds <= 0 || remainingMoves === 0) {
      // If the game hasn't started, or time is up, or no remaining moves, do nothing
      return;
    }
    if (!gameStarted) {
      setGameStarted(true);
      // Start the timer here
    }
    setRemainingMoves((prevMoves) => Math.max(prevMoves - 1, 0));
    firstChoise ? setSecondChoise(card) : setFirstChoise(card);
  };
  // Format the remaining time (e.g., “00:02:30” for 2 minutes and 30 seconds)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const modalRef = useRef(null);
  // reset choice and count turns
  const resetTurn = () => {
    setFirstChoise(null);
    setSecondChoise(null);
    setDisabled(false);
  };
  // useEffects
  // compare selected cards
  useEffect(() => {
    if (firstChoise && secondChoise) {
      setDisabled(true);
      if (firstChoise.src === secondChoise.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === firstChoise.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoise, secondChoise]);
  useEffect(() => {
    shuffleCards();
  }, []);
  useEffect(() => {
    // Exit early if countdown is finished or the game hasn't started
    if (seconds <= 0 || !gameStarted || remainingMoves === 0) {
      return;
    }
    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds, gameStarted, remainingMoves]);
  useEffect(() => {
    // Check if all cards are matched or if the time/remaining moves are exhausted
    // const isGameEnd = cards.every((card) => card.matched) || seconds <= 0 || remainingMoves === 0;
    const isGameEnd = (cards.every((card) => card.matched) && remainingMoves !== 40) || seconds <= 0 || remainingMoves === 0;

    if (isGameEnd) {
      // Use the ref to show the modal when the game ends
      if (modalRef.current) {
        modalRef.current.showModal();
      }
    }
  }, [cards, seconds, remainingMoves]);


  return (
      <div className="mx-32 font-mono my-10 flex items-center justify-center gap-4">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-value mb-2">
                <button className="btn btn-sm" onClick={shuffleCards}>
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
          {cards.map((item, index) => (
              <SingleCard
                  disabled={disabled}
                  choiceHandeler={choiceHandeler}
                  item={item}
                  key={item.id}
                  flipped={item === firstChoise || item === secondChoise || item.matched}
              />
          ))}
        </div>
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box">
            <p className="py-4">
              {cards.every((card) => card.matched) ? "You win!" : "You lose!"}
            </p>
            <div className="modal-action">
              <form method="dialog" >
                <button className="btn btn-secondary" onClick={shuffleCards}>
                  New Game
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
  );
}

export default App;