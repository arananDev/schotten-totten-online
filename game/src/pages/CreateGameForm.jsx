import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import socket from '../client';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CreateGameForm = () => {
  const navigate = useNavigate();

  const bounceAnimation = {
    y: ["0%", "-30%", "0%"],
    transition: {
      y: {
        repeat: Infinity,
        repeatDelat: 5,
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const [name, setName] = useState('');
  const [idCopied, setIdCopied] = useState(false)
  const [gameID, setGameID] = useState('');
  const [joinGameID, setJoinGameID] = useState('');
  const [isGameCreator, setIsGameCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('gameCreated', (newGameID) => {
      setGameID(newGameID);
      setIsLoading(false);
      setIsGameCreator(true)
    });

    socket.on('joinedGame', () => {
      const destinationGameID = isGameCreator ? gameID : joinGameID;
      navigate(`/game/${destinationGameID}`);
      
    });

    socket.on('gameFull', () => {
      alert('Game is full.');
    });

    socket.on('gameNotExists', () => {
      alert('Game does not exist.');
    });

    return () => {
      socket.off('gameCreated');
      socket.off('gameFull');
      socket.off('gameNotExists');
      socket.off('joinedGame');
    };
  }, [navigate, gameID, joinGameID, isGameCreator]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    socket.emit('createGame', { name });
  };

  const handleGameCode = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    socket.emit('joinGame', { name, gameID: joinGameID });
  };

  const GameTitle = () => (
    <motion.h1
      className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-blue-900 md:text-5xl lg:text-6xl dark:text-white"
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 17 }}
    >
      Schotten Totten
    </motion.h1>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {GameTitle()}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading && <motion.div
        animate={bounceAnimation}
        className="text-lg font-semibold text-gray-700 mb-4"
        >Waiting for other player...</motion.div>}

        {gameID && (
          <div>
            <p>Game ID: {gameID}</p>
            {idCopied ? (<p
            className='mt-5'
            > ID copied! </p>)
                      :(<CopyToClipboard text={gameID}>
              <button
               onClick={() => {setIdCopied(true)}} 
                className='w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-600 mt-5'>
              Copy Game ID</button>
            </CopyToClipboard>)}
          </div>
        )}
            {/* Create Game Form */}
          {!gameID && (
            <>
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Player Name: </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Your Name" />
            </div>
            <button className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-600" type="submit">
              CREATE GAME
            </button>
          </form>

          <form className="space-y-4 mt-6" onSubmit={handleGameCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Game ID: </label>
              <input type="text" value={joinGameID} onChange={(e) => setJoinGameID(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., zdh3fj" />
            </div>
            <button className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-600" type="submit">
              JOIN GAME
            </button>
          </form>
          </>)}

      </motion.div>
    </div>
  );
};

export default CreateGameForm;
