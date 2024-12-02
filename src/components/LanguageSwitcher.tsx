import { Menu } from '@headlessui/react';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import GlobeIcon from 'src/assets/icons/globe-alt.svg';
import { languages } from 'src/constants';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const location = useLocation();

    const changeLanguage = (newLang: string) => {
        const currentPath = location.pathname.replace(/^\/(zh|en)/, '');
        const newPath = `/${newLang}/#${currentPath}`;

        window.history.replaceState(null, '', newPath);
        i18n.changeLanguage(newLang);
    };

    return (
        <Menu as='div' className='relative'>
            <Menu.Button className='flex h-8 w-8 items-center justify-center rounded-[8px] ring-1 ring-neutral-300 hover:ring-primary-500 focus:outline-none active:bg-primary-300/30 laptop:h-10 laptop:w-10 laptop:rounded-[10px] laptop:ring-[1.5px]'>
                <GlobeIcon className='h-4 w-4' />
            </Menu.Button>
            <Menu.Items className='absolute right-0 top-[105%] z-10 shadow-dropdown'>
                <div className='typography-desktop-body-5 w-[200px] overflow-hidden rounded-md bg-neutral-50 pb-1.5 text-neutral-800'>
                    <div className='flex items-center justify-between border-b border-neutral-200 bg-white pb-[15px] pl-5 pr-4 pt-[13px]'>
                        <div className='flex items-center gap-2'>
                            <GlobeIcon className='h-5 w-5' /> Language
                        </div>
                        <ChevronDown className='h-4 w-4 text-neutral-400' />
                    </div>
                    {languages.map(({ code, label }, index) => (
                        <Menu.Item key={code}>
                            <button
                                className={`flex w-full items-center justify-between px-5 py-[11px] text-left hover:text-primary-500 ${
                                    index === 0
                                        ? 'border-b border-neutral-200'
                                        : ''
                                }`}
                                onClick={() => changeLanguage(code)}
                            >
                                {label}
                                {i18n.language.includes(code) && (
                                    <CheckIcon className='h-3.5 w-3.5 text-success-700' />
                                )}
                            </button>
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Menu>
    );
};
