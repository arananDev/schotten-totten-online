import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({ number, color, isHoverEnabled }) => {

  const hoverAnimation = isHoverEnabled ? { scale: 1.2 } : {};

  return (
    <motion.div 
      className="flex items-center justify-center w-14 h-20 bg-white rounded-lg shadow-md"
      initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
      animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={hoverAnimation} // Scale up the card on hover
    >
      <span style={{ color: color, fontWeight: 'bold', fontSize: 'large' }}>{number}</span>
    </motion.div>
  );
};


Card.propTypes = {
  color: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  isHoverEnabled: PropTypes.bool.isRequired,
};

export default Card;
