import { createContext } from 'react'

import type { UseFieldStateResult } from './types.js'

export const FieldManagerContext = createContext<UseFieldStateResult | undefined>(undefined)
