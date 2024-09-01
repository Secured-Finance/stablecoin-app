import { useContext } from 'react';
import { Context } from 'src/contexts/SecuredFinanceProvider';

const useSF = () => {
    const { satoshiClient } = useContext(Context);
    return satoshiClient;
};

export default useSF;
