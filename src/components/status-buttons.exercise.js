/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import { useMutation, queryCache } from 'react-query'
import { client } from 'utils/api-client'
// 🐨 you'll need useQuery, useMutation, and queryCache from 'react-query'
// 🐨 you'll also need client from 'utils/api-client'
import { useAsync } from 'utils/hooks'
import * as colors from 'styles/colors'
import { CircleButton, Spinner } from './lib'
import { useListItem, useUpdateListItem } from 'utils/list-items'

function TooltipButton({ label, highlight, onClick, icon, ...rest }) {
  const { isLoading, isError, error, run } = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
                ? colors.danger
                : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({ user, book }) {
  // 🐨 call useQuery here to get the listItem (if it exists)
  // queryKey should be 'list-items'
  // queryFn should call the list-items endpoint

  // 🐨 search through the listItems you got from react-query and find the
  // one with the right bookId.
  const listItem = useListItem(user, book.id)

  const [create] = useMutation(({ bookId }) =>
    client('list-items', { data: { bookId }, token: user.token }),
    {
      onSettled: () => queryCache.invalidateQueries('list-items')
    }
  )

  const [remove] = useMutation(({ id }) =>
    client(`list-items/${id}`, { token: user.token, method: 'DELETE' }),
    {
      onSettled: () => queryCache.invalidateQueries('list-items')
    }
  )

  const [update] = useUpdateListItem(user)

  // 🐨 call useMutation here and assign the mutate function to "update"
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.


  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            // 🐨 add an onClick here that calls update with the data we want to update
            // 💰 to mark a list item as unread, set the finishDate to null
            // {id: listItem.id, finishDate: null}
            onClick={() => update({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
            <TooltipButton
              label="Mark as read"
              highlight={colors.green}
              onClick={() => update({ id: listItem.id, finishDate: Date.now() })}
              // 🐨 add an onClick here that calls update with the data we want to update
              // 💰 to mark a list item as read, set the finishDate
              // {id: listItem.id, finishDate: Date.now()}
              icon={<FaCheckCircle />}
            />
          )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({ id: listItem.id })}
          // 🐨 add an onClick here that calls remove
          icon={<FaMinusCircle />}
        />
      ) : (
          <TooltipButton
            label="Add to list"
            highlight={colors.indigo}
            // 🐨 add an onClick here that calls create
            onClick={() => create({ bookId: book.id })}
            icon={<FaPlusCircle />}
          />
        )}
    </React.Fragment>
  )
}

export { StatusButtons }
