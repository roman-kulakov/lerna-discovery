import React from 'react';

import styles from './index.scss';
import {HelloWorld2} from "@r3mk5v/package-b";

import '@r3mk5v/package-b/dist/main.css';

function HelloWorld() {
  return (
    <>
      <div className={styles.reallyCoolClassName}>Hello World</div>
      <HelloWorld2/>
    </>
  );
}

export { HelloWorld };
