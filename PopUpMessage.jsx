/* istanbul ignore file */
import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from '../../../styles/PopUpMessage.scss';
import { setTogglePopup } from '../../../store/actions/earningsCallTranscriptActions';

function PopUpMessage({ message }) {
  const dispatch = useDispatch();
  const closePopup = () => {
    dispatch(setTogglePopup(false));
  };
  return (
    <div className={`${styles.overlay}`}>
      <div className={`${styles.popup}`}>
        <div className={`${styles.text}`}>{message} </div>
        <button type="button" className={`${styles.closeButton}`} onClick={closePopup}>close</button>
      </div>
    </div>
  );
}

PopUpMessage.propTypes = {
  message: PropTypes.string,
};

export default PopUpMessage;
{isPopupOpen && (
      <PopUpMessage message="Unable to fetch llm response. Please try again later..." />
      )}
