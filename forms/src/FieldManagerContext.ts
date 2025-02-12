import { createContext } from 'react'

import { UseFieldStateResult } from './types.js'

export const FieldManagerContext = createContext<UseFieldStateResult | undefined>(undefined)
