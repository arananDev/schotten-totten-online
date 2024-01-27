import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const WaitingPage = () => {
    const navigate = useNavigate();
    const { roomID } = useParams();
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    // Placeholder for player name from location state
    const location = useLocation();
    const name = location.state;

    useEffect(() => {
        // Placeholder for socket logic
        // ...

        return () => {
        // Cleanup for socket listeners
        // ...
        };
    }, [navigate, roomID, name]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomID);
        setShowCopyMessage(true);
        setTimeout(() => { setShowCopyMessage(false); }, 2500);
      };
    
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center min-h-screen bg-gray-100"
        >
          <div className="text-center p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">WAITING FOR OTHER PLAYER...</h2>
            <div className="mb-4">
              {/* Placeholder for animated hand of cards */}
              <div>Animated Hand of Cards Placeholder</div>
            </div>
            <div className="mb-4">
              <div className="text-lg">Game Code: {roomID}</div>
              <button onClick={handleCopy} className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600">
                Copy Game Code
              </button>
            </div>
            <p className="mt-4">Share the above code with your friends so they can join your game!</p>
            {showCopyMessage && (<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">Game Code copied!</div>)}
          </div>
        </motion.div>
      );
    }

export default {WaitingPage};
