// 🐨 you'll need to import React and ReactDOM up here
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import VisuallyHidden from '@reach/visually-hidden';
// 🐨 you'll also need to import the Logo component from './components/logo'
import { Logo } from './components/logo';
import { Form } from './components/Form';

const App = () => {
  const Status = {
    LOGIN: 'login',
    REGISTER: 'register',
    NONE: 'none',
  }

  const [showDialog, setShowDialog] = useState(Status.NONE);

  const Modal = ({ formText, status }) => (
    <Dialog
      isOpen={showDialog === status}
      onDismiss={() => setShowDialog(Status.NONE)}
      aria-label={formText}
    >
      <button
        className="close-button"
        onClick={() => setShowDialog(Status.NONE)}
      >
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>Close</span>
      </button>
      <h3>
        {formText}
      </h3>
      <Form />
    </Dialog>
  );

  return (
    <div>
      <Logo width={80} height={80} />
      <h1>Bookshelf</h1>
      <button
        onClick={() => setShowDialog(Status.LOGIN)}
      >
        Login
      </button>
      <button
        onClick={() => setShowDialog(Status.REGISTER)}
      >
        Register
      </button>
      {Status.REGISTER &&
        <Modal
          status={Status.REGISTER}
          formText="Register Form"
        />
      }
      {Status.LOGIN &&
        <Modal
          status={Status.LOGIN}
          formText="Login Form"
        />
      }
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
