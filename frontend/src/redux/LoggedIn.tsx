import React, { useState } from 'react'

import { useAppSelector, useAppDispatch } from '../hooks'

import { changeValue } from './LoggedInSlice'

export function Counter() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.loggedIn.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(changeValue("hei"))}
        >
          Increment
        </button>
        {count ? <div>true</div> : <div>false</div>}
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(changeValue("hade"))}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}