import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const atomApiList = atom([]);

export const useApiList = () => {
    const [apiList, setApiList] = useAtom(atomApiList);
    useEffect(() => {
        console.log(window.api.triggerMessage('getStore'));
    }, []);
    return {
        apiList,
        setApiList
    };
};