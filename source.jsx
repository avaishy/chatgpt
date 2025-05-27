/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import styles from '../../../styles/sources.scss';
import {
  getChatMessages,
} from '../../../store/selectors/earningsCallTranscriptSelectors';

function Sources() {
  const [sources, setSources] = useState([]);
  const userMessages = useSelector((state) => getChatMessages(state));

  useEffect(() => {
    let latestSources = [];
    if (userMessages.length > 0) {
      const latestBotMessage = userMessages.filter((msg) => msg.role === 'llm').at(-1);
      if ('msg' in latestBotMessage) {
        latestSources = latestBotMessage.msg.sources;
      }
      setSources(latestSources);
    }
  }, [userMessages]);

  const cleanText = (text) => {
    try {
      const unwrapped = JSON.parse(text);
      return unwrapped.replace(/\\n/g, '\n');
    } catch (e) {
      return text.replace(/\\n/g, '\n');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Sources</h3>
      {sources.map((source, index) => (
        <div key={source.llm_response_id} className={styles.source}>
          <p className={styles.title}>
            [{index + 1}] {source.source_title} {source.page}
          </p>
          <div className={styles.content}>
            <ReactMarkdown>{cleanText(source.source_content)}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sources;
"\n\n\n- Ref. [1] : Page No : [9] Visa, Inc. (V) Q2 2024 Earnings Call Corrected Transcript 23-Apr-2024 1-877-FACTSET www.callstreet.com 10 Copyright © 2001-2024 FactSet CallStreet, LLC FX for the third quarter is expected to have an approximately 1 point drag to net revenue growth and approximately 1.5 point benefit to non-GAAP operating expense growth and an approximately 0.5 point drag to non-GAAP EPS growth. In summary, we had another solid quarter in Q2 with relatively stable underlying drivers and strong financial results. We feel good about the momentum in our business as we head into the second half across Consumer Payments, New Flows and Value-Added Services. We remain thoughtful with our spending plans as we continue to balance between short and long-term considerations in the context of a changing environment. So now, Jennifer, let's do some Q&A. Jennifer Como Senior Vice President & Global Head-Investor Relations, Visa, Inc. Thanks, Chris. And with that, we're ready to take questions, Holly. QUESTION AND ANSWER SECTION Operator: <br> - Ref. [2] : Page No : [6] 6% y
 "jest": {
    "preset": "amex-jest-preset-react",
    "moduleNameMapper": {
      "^uuid$": "uuid",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
      "^react-markdown$": "<rootDir>/node_modules/react-markdown/react-markdown.js",
      "rehype-raw$": "<rootDir>/node_modules/rehype-raw/index.js"
    },
    "setupFiles": [
      "./test-setup.js"
    ],
    "snapshotSerializers": []
  },  C:\Users\avaishy\research-assistant-root\node_modules\rehype-raw\index.js:5
    export {default} from './lib/index.js'
    ^^^^^^


      3 | import { useSelector } from 'react-redux';
      4 | import ReactMarkdown from 'react-markdown';
    > 5 | import rehypeRaw from 'rehype-raw';
        | ^
      6 | import styles from '../../../styles/sources.scss';
      7 | import {
      8 |   getChatMessages,

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)
      at Object.require (src/components/earningsCallTranscripts/chatScreen/Sources.jsx:5:1)
      at Object.require (src/components/earningsCallTranscripts/chatScreen/ChatComponentWrapper.jsx:5:1)
      at Object.require (src/components/earningsCallTranscripts/newSessionScreen/SessionsNav.jsx:8:1)
      at Object.require (src/childRoutes.jsx:5:1)
      at Object.require (src/components/Lumos.jsx:13:1)
      at Object.require (src/index.js:1:1)
      at Object.require (__tests__/index.spec.js:1:1)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |
 csp.js   |       0 |        0 |       0 |       0 |
 index.js |       0 |        0 |       0 |       0 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 passed, 1 total
Snapshots:   1 passed, 1 total
Time:        97.289 s
Ran all test suites.
