import { motion } from 'framer-motion';

const CardBack = () => {
    return (
      <motion.div
        initial={{ scale: 0, y: 50 }} // Start smaller and below its final position
        animate={{ scale: 1, y: 0 }}    // Animate to its normal size and position
        transition={{ type: "spring", stiffness: 260, damping: 20, }}
        className="flex items-center justify-center w-14 h-20 bg-slate-500 border border-white rounded-lg shadow-md"
      >
      </motion.div
      >
    );
  };
  
  export default CardBack;
  