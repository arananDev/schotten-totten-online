import { motion } from 'framer-motion';
import Playceholder from './Playceholder';
import PropTypes from 'prop-types';

const Rock = ({ canHover, onClick, player, opps, winner }) => {
  const playerPlays = player.map((card, index) => (
    <Playceholder key={index} value={card} />
  ));

  // Ensure there's a minimum of 3 placeholders if player's array length is less than 3
  while (playerPlays.length < 3) {
    playerPlays.push(<Playceholder key={`player-placeholder-${playerPlays.length}`} value={{}} />);
  }

  const oppsPlays = opps.map((card, index) => (
    <Playceholder key={index} value={card} />
  )).reverse();

  // Ensure there's a minimum of 3 placeholders if opps' array length is less than 3
  while (oppsPlays.length < 3) {
    oppsPlays.unshift(<Playceholder key={`opps-placeholder-${oppsPlays.length}`} value={{}} />);
  }

  // Conditionally set hover effect based on canHover
  const hoverEffect = canHover ? { scale: 1.2 } : {};

  return (
    <div className="grid grid-rows-7 gap-2">
      {oppsPlays}
      <motion.div
        className="w-20 h-8 bg-rock rounded-lg cursor-pointer" 
        initial={{ scale: 0, y: 50 }} 
        animate={{ scale: 1, y: 0 }}  
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={hoverEffect} 
        onClick={onClick} 
      >
         {winner && (
          <span className="text-black font-bold text-sm">
            {winner}
          </span>
        )}

      </motion.div>
      {playerPlays}
    </div>
  );
};

Rock.propTypes = {
  canHover: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  player: PropTypes.array.isRequired,
  opps: PropTypes.array.isRequired,
  winner: PropTypes.string,
};

export default Rock;
