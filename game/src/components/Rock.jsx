import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Rock = ({ isHoverEnabled }) => {

    const hoverAnimation = isHoverEnabled ? { scale: 1.2 } : {};

  return (
    <div className="flex items-center justify-center">
      <motion.div 
        className="w-20 h-8 bg-rock rounded-lg"
        initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
        animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={hoverAnimation}  // Scale up the rock on hover
      ></motion.div>
    </div>
  );
};

Rock.propTypes = {
    isHoverEnabled: PropTypes.bool.isRequired,
};

export default Rock;
