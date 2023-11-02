import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Writestory = () => {
    const { user } = useAuthContext();
  return (
    <div>Writestory</div>
  )
}

export default Writestory