import { useEffect, useState } from 'react';
import { Earn } from 'src/components/pages';

function EntryPoint() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <Earn />;
}

export default EntryPoint;
