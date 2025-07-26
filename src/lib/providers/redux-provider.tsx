'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/lib/store'
import { useAppDispatch } from '@/lib/store/hooks'
import { syncWithCookies, debugState } from '@/lib/store/slices/authSlice'

// Component to sync persisted state with cookies
function PersistSync() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Sync persisted state with current cookie state
    dispatch(syncWithCookies())
    // Debug: log the current state
    dispatch(debugState())
  }, [dispatch])

  return null
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistSync />
        {children}
      </PersistGate>
    </Provider>
  )
}
