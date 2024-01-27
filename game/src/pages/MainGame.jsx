  // App.js
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { initialDeck } from '../helper';
  import Rock from '../components/Rock';
  import Card from '../components/Card';
  import CardBack from '../components/CardBack';
  import "./MainGame.css"

  const buttonStyling = "bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
  function MainGame() {
    const [deck, setDeck] = useState(initialDeck);
    const [playerCards, setPlayerCards] = useState([{"color": "red", "number": 7}]);
    const [opponentCards, setOpponentCards] = useState([{"color": "blue", "number": 9}, {"color": "blue", "number": 9}]); // Example opponent cards
    const [rocks, setRocks] = useState([null, null, null, null, null, null, null, null, null]);
  
    // Motion states
    const [canRockHover, setCanRockHover] = useState(false)
    const [canCardHover, setCanCardHover] = useState(true)

    const showDeck = () => {
      const numberOfCards = deck.length >= 10 ? 10 : deck.length;
      return Array.from({ length: numberOfCards }, (_, index) => (
        <div 
          key={index} 
          className="absolute top-0 left-0" 
          style={{ transform: `translateX(${index * -2}px)` }}
        >
          <CardBack />
        </div>
      ));
    };
  
  
    return (
      <div className="min-h-screen w-full bg-blue-900 flex flex-col justify-center items-center p-4 relative">
        {/* Container for rocks */}
        <div className="flex flex-row space-x-4 mb-4">
          {rocks.map((rock, index) => (
            <Rock key={index} isHoverEnabled={canRockHover} />
          ))}
        </div>
  
        {/* Bottom left container for player cards */}
        <div className="absolute bottom-0 left-0 p-4">
          <div className="flex flex-row space-x-1">
            {playerCards.map((card, index) => (
              <Card key={index} number={card.number} color={card.color} isHoverEnabled={canCardHover} />
            ))}
          </div>
        </div>
  
        {/* Top right container for opponent cards */}
        <div className="absolute top-0 right-0 p-4">
          <div className="flex flex-row space-x-1">
            {opponentCards.map((card, index) => (
              <CardBack key={index} />
            ))}
          </div>
        </div>

         {/* Botom right container for Button */}
         <div className="absolute bottom-0 right-0 p-4">
         <motion.button 
         className={buttonStyling}
         initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
        animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
        transition={{ type: "spring", stiffness: 260, damping: 20, }}
         whileHover={{scale: 1.2}} >
          Prove a rock is yours!
         </motion.button>
        </div>

        {/* Container for showing deck */}
      <div className="absolute top-0 left-2 p-4">
        {showDeck()}
      </div>
      </div>
    );
  }

  export {MainGame}