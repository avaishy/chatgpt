import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

function LLMFeedback({ handleMessageFeedback, messageId, feedback }) {
  const [locFeedback, setLocFeedback] = useState({});

  useEffect(() => {
    setLocFeedback(feedback);
  }, [feedback]);

  const handleThumbsUp = (data) => {
    setLocFeedback(data);
    handleMessageFeedback(data, messageId);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <FaThumbsUp
        onClick={() => handleThumbsUp({
          thumbsup: !locFeedback.thumbsup,
          thumbsdown: false,
          comment: locFeedback.comment,
          submitted: locFeedback.submitted,
        })}
        size={22}
        color={locFeedback.thumbsup === true ? 'green' : '#ccc'}
      />
      <FaThumbsDown
        onClick={() => handleThumbsUp({
          thumbsup: false,
          thumbsdown: !locFeedback.thumbsdown,
          comment: locFeedback.comment,
          submitted: locFeedback.submitted,
        })}
        size={22}
        color={locFeedback.thumbsdown === true ? 'red' : '#ccc'}
      />
    </div>
  );
}

LLMFeedback.propTypes = {
  handleMessageFeedback: PropTypes.func,
  messageId: PropTypes.string,
  feedback: PropTypes.objectOf(
    PropTypes.shape({
      thumbsup: PropTypes.bool,
      thumbsdown: PropTypes.bool,
      comment: PropTypes.string,
      submitted: PropTypes.bool,
    })
  ),
};

export default LLMFeedback;
