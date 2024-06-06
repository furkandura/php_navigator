import React, {createContext, useContext, useState} from 'react';

const Context = createContext();

const Provider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [cizLogo, setCizLogo] = useState(false)

    const data = {
        loading,
        setLoading,
        setCizLogo,
        cizLogo
    };

    return (
        <Context.Provider value={data}>
            {children}
        </Context.Provider>
    );
};

export const useApp = () =>  useContext(Context);
export default Provider;
