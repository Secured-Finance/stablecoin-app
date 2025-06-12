import { Layers2, Vault } from 'lucide-react';
import React from 'react';
import { PositionInfoCard } from '../PositionInfoCard';

export const EmptyPositions: React.FC = () => {
    return (
        <div className='w-full'>
            <h2 className='mb-4 font-primary text-5/none font-semibold'>
                My Positions
            </h2>

            <div className='grid w-full grid-cols-1 justify-items-center gap-6 laptop:grid-cols-2'>
                <PositionInfoCard
                    icon={Vault}
                    title='No Trove Yet'
                    description='A Trove is your personal vault where you can deposit FIL as collateral to borrow USDFC with 0% interest, while maintaining exposure to FIL.'
                    buttonText='Create Trove'
                    to='/trove'
                />

                <PositionInfoCard
                    icon={Layers2}
                    title='No Stability Pool Deposit Yet'
                    description='Deposit USDFC to earn FIL rewards. The pool helps maintain system stability by covering liquidated debt, ensuring a balanced and secure ecosystem.'
                    buttonText='Deposit'
                    to='/stability-pool'
                />
            </div>
        </div>
    );
};
