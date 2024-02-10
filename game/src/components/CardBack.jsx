import { motion } from 'framer-motion';
import PropTypes from 'prop-types';


const CardBack = ({ hide, color, number }) => {

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


  if (hide) {
    // Render the card back
    return (
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center justify-center w-14 h-20 bg-slate-500 border border-white rounded-lg shadow-md"
      >
      </motion.div>
    );
  } else {
    // Render the Card component with color and number
    return (
      <motion.div 
      className="flex items-center justify-center w-14 h-20 bg-white rounded-lg shadow-md"
      initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
      animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Use the mapped Tailwind CSS class for text color and font size */}
      <span className={`${textColorClass} font-bold text-4xl`}>{number}</span>
    </motion.div>
    );
  }
};

CardBack.propTypes = {
  color: PropTypes.string,
  number: PropTypes.number,
  hide: PropTypes.bool.isRequired,
};


export default CardBack;