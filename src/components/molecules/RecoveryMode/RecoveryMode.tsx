import { DOCUMENTATION_LINKS } from 'src/constants';
import { LearnMoreLink } from '../../Tooltip';

interface RecoveryModeProps {
    isActive: boolean;
}

export const RecoveryMode = ({ isActive }: RecoveryModeProps) => {
    const statusStyles = isActive
        ? {
              border: 'border-red-100',
              bg: 'bg-red-50',
              dot: 'bg-red-500',
              text: 'text-red-700',
              label: 'Active',
          }
        : {
              border: 'border-success-100',
              bg: 'bg-success-50',
              dot: 'bg-success-500',
              text: 'text-success-700',
              label: 'Inactive',
          };

    return (
        <div className='flex flex-col items-start gap-4 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-0'>
            <div className='flex min-h-[65px] w-full flex-col items-start justify-center gap-1.5 tablet:w-[440px]'>
                <h3 className='font-primary text-4 font-medium leading-[19px] text-neutral-450'>
                    Recovery Mode
                </h3>
                <p className='font-primary text-sm font-normal leading-[140%] text-neutral-450'>
                    Activated when the Total Collateral Ratio (TCR) falls below
                    150%. While active, your Trove can be liquidated if its
                    ratio is below the TCR, with the collateral loss capped at
                    110% of your debt. Operations are also restricted that would
                    negatively impact the TCR. Learn more in the{' '}
                    <LearnMoreLink link={DOCUMENTATION_LINKS.recoveryMode}>
                        Secured Finance Docs
                    </LearnMoreLink>
                    .
                </p>
            </div>
            <div
                className={`flex items-center gap-1 rounded-3xl border px-2 py-1.5 ${statusStyles.border} ${statusStyles.bg}`}
            >
                <div
                    className={`h-3 w-3 rounded-3xl ${statusStyles.dot}`}
                ></div>
                <span
                    className={`font-primary text-3.5 font-medium ${statusStyles.text}`}
                >
                    {statusStyles.label}
                </span>
            </div>
        </div>
    );
};
