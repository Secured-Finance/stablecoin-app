import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
};

export const PaginationFooter = ({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
}: Props) => {
    return (
        <div className='mt-6 flex items-center justify-between'>
            <div className='flex items-center'>
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center ${
                        currentPage === 1 ? 'text-gray-300' : 'text-[#1a30ff]'
                    }`}
                >
                    <ChevronLeft size={16} />
                    <span className='ml-1'>Previous</span>
                </button>
                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className={`ml-4 flex items-center ${
                        currentPage === totalPages
                            ? 'text-gray-300'
                            : 'text-[#1a30ff]'
                    }`}
                >
                    <span className='mr-1'>Next</span>
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className='text-sm text-[#565656]'>
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};
