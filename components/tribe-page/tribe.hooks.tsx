"use client";

import { useState } from "react";

export const useTribeHooks = ()=> {
  const [ isTribeMember, setIsTribeMember ] = useState(false);
  const [ isTribeAdmin, setIsTribeAdmin ] = useState(false);
  const [ tribeId, setTribeId ] = useState<string | null>(null);
  return {
    isTribeMember,
    setIsTribeMember,
    isTribeAdmin,
    setIsTribeAdmin,
    tribeId,
    setTribeId
  }
}
