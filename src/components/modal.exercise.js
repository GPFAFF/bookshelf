// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import * as React from 'react'
import { Dialog } from './lib'
import VisuallyHidden from '@reach/visually-hidden'
import { CircleButton } from '../components/lib'

const ModalContext = React.createContext({})
ModalContext.displayName = 'ModalContext'
// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitly shared state, so...
// 🐨 create a ModalContext here with React.createContext

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

function Modal({ children, props }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={
      {
        isOpen,
        setIsOpen
      }}
      {...props}
    >
      {children}
    </ModalContext.Provider>
  )
}

// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true

function ModalOpenButton({ children, props }) {
  const { setIsOpen } = React.useContext(ModalContext)
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(true), children.props.onClick),
  })
}

function ModalDismissButton({ children }) {
  const { setIsOpen } = React.useContext(ModalContext)
  return React.cloneElement(children, {
    onClick: callAll(() => setIsOpen(false), children.props.onClick),
  })
}

// 🐨 create a ModalContents component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).
function ModalContentsBase({ children, ariaLabel, props }) {
  const { isOpen, setIsOpen } = React.useContext(ModalContext)

  return (
    <Dialog
      aria-label={ariaLabel}
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      {...props}
    >
      {children}
    </Dialog >
  )
}

function ModalContents({ title, children, ...props }) {
  return (
    <ModalContentsBase {...props}>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{ textAlign: 'center', fontSize: '2em' }}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

// 🐨 don't forget to export all the components here

export { Modal, ModalContentsBase, ModalContents, ModalOpenButton, ModalDismissButton, callAll }
