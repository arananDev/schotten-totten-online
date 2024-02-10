import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Rocks from "../components/Rocks";
import Card from "../components/Card";
import CardBack from "../components/CardBack";
import "./MainGame.css";
import socket from '../client';
import { useParams } from 'react-router-dom';
import Dialog from "../components/Dialog";

const buttonStyling =
  "bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded";

function MainGame() {
  const { roomID } = useParams();
  const [playerCards, setPlayerCards] = useState([])
  const [oppsCards, setOppsCards] = useState([])
  const [deckLength, setDeckLength] = useState(0)
  const [gameState, setGameState] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [canCardHover, setCanCardHover] = useState(true);
  const [canRockHover, setCanRockHover] = useState(true);
  const [action, setAction] = useState(null);
  const [showRevealCard, setShowRevealCard] = useState(false)
  const [dialogContent, setDialogContent] = useState('')
  const [dialogType, setDialogType] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [buttonScale, setButtonScale] = useState(1)
  const [rockToProve, setRockToProve] = useState(null)

  const playerID = localStorage.getItem('playerID'); // Retrieve playerID from local storage
  const bounceAnimation = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10, mass: 0.75, repeat: 1 , repeatType: "reverse" } }
  };


  useEffect(() => {
    if (playerID && roomID) {
      socket.emit('initializeGame', { gameId: roomID, playerID });
    }
  }, [roomID, playerID])

  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameState(state["game"])
      const updatedOppsCards = state["opps_cards"].map(card => ({
        ...card,
        hide: true // Ensure all opponent cards are initially hidden
      }));
      setOppsCards(updatedOppsCards);
      setPlayerCards(state["cards"])
      setCurrentPlayer(state['currentPlayer'])
      setDeckLength(state["deck_length"])
      setCanCardHover(state['currentPlayer'])
      setCanRockHover(false)
      setAction(null)
      setShowRevealCard(false)
      setButtonScale(1)
    });

     socket.on('revealOppCard', (cardIndex) => {
      // Update oppsCards to reveal the card at the specified index
     setOppsCards(oppsCards => oppsCards.map((card, index) => {
    if (index === cardIndex) {
      return { ...card, hide: false }; // Reveal this card
    }
    return card; // Leave other cards unchanged
  }));
    });

    socket.on('error', (data) => {
      setDialogContent(data["message"])
      setDialogType("error")
      setShowDialog(true)
      setCanCardHover(true)
      setCanRockHover(false)
      setAction(null)
      setShowRevealCard(false)
    });

    socket.on('message', (data) => {
      setDialogContent(data["message"])
      setDialogType("message")
      setShowDialog(true)
    });

    socket.on('gameFinished', (data) => {
      setDialogContent(`${data["winner"]} has won the match!`)
      setDialogType("succeed")
      setShowDialog(true)
      setCurrentPlayer(false)
      setCanCardHover(false)
    });

    socket.on('validateProveRock', (rock_index) => {
      setDialogContent(`Should rock ${rock_index} be claimed by the opponent`)
      setDialogType("prove")
      setShowDialog(true)
      setRockToProve(rock_index)
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    socket.on('connect', () => {
      console.log('Connected');
      if (playerID && roomID) {
        socket.emit('initializeGame', { gameId: roomID, playerID });
      }
    });

    return () => {
      socket.off('gameState');
      socket.off('disconnect');
      socket.off('connect');
      socket.off('revealOppCard');
      socket.off('error');
      socket.off('gameFinished')
    };
    
  }, [roomID, playerID, oppsCards]);
  
   const handleCardClick = (index) => {
    if (canCardHover){
      setSelectedCard(index);
      setCanRockHover(true)
      setAction("play")
      setShowRevealCard(true)
    }
  };

  const handleRockClick = (index) => {
    if (canRockHover && action === "play"){
      socket.emit("playTurn", {
        rockIndex: index,
        cardIndex: selectedCard,
        playerID: playerID,
        gameId: roomID,
      })
      setButtonScale(1)
      setCanRockHover(false)
      setCanCardHover(false)
      setSelectedCard(null)
      setAction(null)
      setShowRevealCard(false)
    }

    if (canRockHover && action === "prove"){
      socket.emit("proveRock", {
        rockIndex: index,
        playerID: playerID,
        gameId: roomID,
      })
      setButtonScale(1)
      setCanRockHover(false)
      setCanCardHover(true)
      setSelectedCard(null)
      setAction(null)
      setShowRevealCard(false)
    }
  }

  const handleRevealCardClick = () => {
    socket.emit("revealCard", {
      cardIndex : selectedCard,
      playerID: playerID,
      gameId: roomID,
    })
    setCanRockHover(false)
    setCanCardHover(true)
    setSelectedCard(null)
    setAction(null)
    setShowRevealCard(false)
  }

  const toggleModal = () => {
    setDialogContent("")
    setShowDialog(false)
    setRockToProve(null)
    
  }

  const handleProveRockButton = () => {
    setAction("prove")
    setCanRockHover(true)
    setButtonScale(1.2)
  }

  const validateRockApproval = (rockIndex) => {
    socket.emit("rockApprovalValidated",{
      rockIndex : rockIndex,
      playerID: playerID,
      gameId: roomID,
    } )
    toggleModal()
  }

  const showDeck = () => {
    const numberOfCards = deckLength >= 10 ? 10 : deckLength;
    return Array.from({ length: numberOfCards }, (_, index) => (
      <div
        key={index}
        className="absolute top-0 left-0"
        style={{ transform: `translateX(${index * -2}px)` }}
      >
        <CardBack hide={true} />
      </div>
    ));
  };

  return (
    <div className="min-h-screen w-full bg-blue-900 flex flex-col justify-center items-center p-4 relative">
        {currentPlayer && (
        <motion.div
          className="absolute top-0 transform -translate-x-1/2 p-4 text-white font-bold text-4xl"
          initial="initial"
          animate="animate"
          variants={bounceAnimation} // Apply the bounce animation
        >
          Your turn!
        </motion.div>
      )}
      <Rocks canHover={canRockHover} onClick={handleRockClick} data={gameState} />
      <div className="absolute bottom-0 left-0 p-4 flex flex-row space-x-2">
        {playerCards.map((card, index) => (
          <Card
            key={index}
            number={card.number}
            color={card.color}
            isHoverEnabled={canCardHover}
            onClick={() => handleCardClick(index)}
            isSelected={selectedCard === index}
          />
        ))}
      </div>
      <div className="absolute top-0 right-0 p-4 flex flex-row space-x-2">
      {oppsCards.map((card, index) => (
          <CardBack
            key={index}
            number={card.number}
            color={card.color}
            hide={card.hide}
          />
        ))}
      </div>
      {showRevealCard && (<div className="absolute bottom-0 right-100 p-4">
        <motion.button
          className={buttonStyling}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.2 }}
          onClick={handleRevealCardClick}
        >
          Reveal card
        </motion.button>
      </div>)}
      <div className="absolute bottom-0 right-0 p-4">
        <motion.button
          className={buttonStyling}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: buttonScale, y: 0}}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.2 }}
          onClick={handleProveRockButton}
        >
          Prove a rock is yours!
        </motion.button>
      </div>
      <div className="absolute top-0 left-2 p-4">{showDeck()}</div>
      {showDialog && (
        <div className="absolute right-20">
          <Dialog
            dialogType={dialogType}
            content={dialogContent}
            toggleModal={toggleModal}
            onApprove={() => {validateRockApproval(rockToProve)}}
          />
        </div>
      )}
    </div>
  );
}

export { MainGame };
