import { useEffect } from "react";

// Componente funcional
// Servirá para alterar el título de cada pestaña donde se lo implemente
const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => document.title = prevTitle;
    }, [title]);
}

export default useTitle;