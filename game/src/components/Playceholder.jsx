import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Playceholder = ({ value }) => {
  const [isValuePassed, setIsValuePassed] = useState(false);

  useEffect(() => {
    setIsValuePassed(value && value.color && value.number);
  }, [value]);

 // Map color names to Tailwind CSS text color classes
  const colorToTailwindClass = {
    red: 'text-red-500',
    violet: 'text-violet-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-300',
    yellow: 'text-yellow-600',
  };

  // Determine the Tailwind CSS text color class based on the value.color
  // Default to 'text-black' if the color is not in the map
  const textColorClass = isValuePassed ? (colorToTailwindClass[value.color] || 'text-black') : '';

  return (
    <motion.div
      className={`w-20 h-8 ${isValuePassed ? 'bg-white' : 'bg-transparent'} rounded-lg`}
      initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
      animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {isValuePassed && (
        <span 
        className={`${textColorClass} text-center font-bold`}> {/* Use Tailwind CSS for text color and add font-bold for consistency */}
        {value.number}
        </span>
      )}
    </motion.div>
  );
};

Playceholder.propTypes = {
  value: PropTypes.shape({
    color: PropTypes.string,
    number: PropTypes.number,
  }),
};

export default Playceholder;
