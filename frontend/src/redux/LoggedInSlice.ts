import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface LoggedInState {
  value: string
}

// Define the initial state using that type
const initialState: LoggedInState = {
  value: "",
} as LoggedInState

export const loggedInSlice = createSlice({
  name: 'loggedIn',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { changeValue } = loggedInSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.loggedIn.value

export default loggedInSlice.reducer