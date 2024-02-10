import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({ number, color, isHoverEnabled, onClick, isSelected}) => {

  const hoverAnimation = isHoverEnabled && !isSelected ? { scale: 1.2 } : {};
  const selectedScale = isSelected ? 1.2 : 1;

  // Map color names to Tailwind CSS text color classes
  const colorToTailwindClass = {
    red: 'text-red-500',
    violet: 'text-violet-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-300',
    yellow: 'text-yellow-600',
  };

  // Get the appropriate Tailwind CSS class for the given color
  const textColorClass = colorToTailwindClass[color] || 'text-black'; // Default to black if color is not mapped

  return (
    <motion.div 
      className="flex items-center justify-center w-14 h-20 bg-white rounded-lg shadow-md cursor-pointer"
      initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
      animate={{ scale: selectedScale, y: 0 }}    // Animate to its normal size and position
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      whileHover={hoverAnimation} // Scale up the card on hover
      onClick={onClick}
    >
      {/* Use the mapped Tailwind CSS class for text color and font size */}
      <span className={`${textColorClass} font-bold text-4xl`}>{number}</span>
    </motion.div>
  );
};


Card.propTypes = {
  color: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  isHoverEnabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired
};

export default Card;
