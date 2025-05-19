import React from 'react';
//import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from '../../../styles/PopUpMessageGenerateAnswer.scss';

function PopUpMessageGenerateAnswer({ message }) {
  //const dispatch = useDispatch();
  const yesAdditionalKnowledge = () => {
  console.log("User want to add additional knowledge")
  };
  const NoGenerateAnswer = () => {
console.log("User want to Generate Answer");
  };
  return (
    <div className={`${styles.overlay}`}>
      <div className={`${styles.popup}`}>
        <div className={`${styles.text}`}>{message} </div>
        <button type="button" onClick={yesAdditionalKnowledge}>Yes</button>
        <button type="button" onClick={NoGenerateAnswer}>No</button>
      </div>
    </div>
  );
}

PopUpMessageGenerateAnswer.propTypes = {
  message: PropTypes.string,
};

export default PopUpMessageGenerateAnswer;
