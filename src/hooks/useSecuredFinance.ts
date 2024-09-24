import { useContext } from 'react';
import { SecuredFinanceContext } from 'src/contexts';

const useSF = () => {
    const { satoshiClient } = useContext(SecuredFinanceContext);
    return satoshiClient;
};

export default useSF;
