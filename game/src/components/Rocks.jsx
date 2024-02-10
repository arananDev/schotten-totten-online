import PropTypes from 'prop-types';
import Rock from './Rock';


const Rocks = ({ canHover, onClick, data }) => {
  return (
    <div className="grid grid-cols-9 gap-12">
      {data.map((rockData, index) => (
        <Rock key={index} canHover={canHover} onClick={()=> {onClick(index)}} {...rockData} />
      ))}
    </div>
  );
};

Rocks.propTypes = {
  canHover: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      "player": PropTypes.array.isRequired,
      "opps": PropTypes.array.isRequired,
      "winner": PropTypes.string, 
    })
  ).isRequired,
};


export default Rocks;
