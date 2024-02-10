import PropTypes from 'prop-types';

const Dialog = ({ dialogType, content, toggleModal, onApprove }) => {
  let title, themeColor, themeHover;

  switch (dialogType) {
    case 'error':
      title = "Error!";
      themeColor = "bg-red-500";
      themeHover = "hover:bg-red-700";
      break;
    case 'message':
      title = "Message";
      themeColor = "bg-blue-500";
      themeHover = "hover:bg-blue-700";
      break;
    case 'succeed':
      title = "Game Finished";
      themeColor = "bg-green-500";
      themeHover = "hover:bg-green-700";
      break;
    case 'prove':
      title = "Rock Approval request";
      themeColor = "bg-orange-500";
      themeHover = "hover:bg-orange-700";
      break;
    default:
      title = "Notice";
      themeColor = "bg-gray-500";
      themeHover = "hover:bg-gray-700";
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className={`flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 ${themeColor}`}>
            <h3 className={`text-xl font-medium text-white`}>
              {title}
            </h3>
            <button 
              type="button" 
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggleModal}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {content}
          </div>
          <div className="flex justify-center space-x-4 p-4">
            <button
              type="button"
              className={`text-white ${themeColor} ${themeHover} focus:ring-4 focus:outline-none focus:ring-opacity-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
              onClick={toggleModal}
            >
              Close
            </button>
            {dialogType === 'prove' && (
              <button
                type="button"
                className="text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={onApprove}
              >
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Dialog.propTypes = {
  dialogType: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
  onApprove: PropTypes.func, // onApprove is optional; not all dialog types might use it
};

export default Dialog;
