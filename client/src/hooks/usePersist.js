import { useState, useEffect } from "react";

// Componente funcional
// Servirá como un Hook personalizado para lo que es el 'almacenamiento'
const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);
    // Retornando este Hook personalizado para persistir en el LocalStorage
    return [persist, setPersist];
}
export default usePersist;