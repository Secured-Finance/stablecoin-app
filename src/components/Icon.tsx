import { IconName, IconProp, library } from '@fortawesome/fontawesome-svg-core';
import {
    faDiscord,
    faGithub,
    faMedium,
    faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
    faClipboard,
    faQuestionCircle,
} from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDoubleDown,
    faAngleDoubleUp,
    faAngleDown,
    faAngleUp,
    faArrowDown,
    faBars,
    faChartLine,
    faCheck,
    faCheckCircle,
    faChevronLeft,
    faChevronRight,
    faCircleNotch,
    faClipboardCheck,
    faCog,
    faExclamationCircle,
    faExclamationTriangle,
    faExternalLinkAlt,
    faHandPaper,
    faHeartbeat,
    faHistory,
    faInfoCircle,
    faPen,
    faPlug,
    faRedo,
    faTimes,
    faTrash,
    faUserCircle,
    faWallet,
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React from 'react';

// Initialize FontAwesome library with all icons
library.add(
    faCircleNotch,
    faCheck,
    faCheckCircle,
    faExclamationTriangle,
    faInfoCircle,
    faTimes,
    faTrash,
    faChartLine,
    faRedo,
    faHistory,
    faChevronLeft,
    faChevronRight,
    faClipboard,
    faClipboardCheck,
    faUserCircle,
    faWallet,
    faExternalLinkAlt,
    faCog,
    faPlug,
    faExclamationCircle,
    faAngleUp,
    faAngleDoubleUp,
    faAngleDown,
    faAngleDoubleDown,
    faPen,
    faHandPaper,
    faHeartbeat,
    faBars,
    faQuestionCircle,
    faArrowDown
);

library.add(faXTwitter, faMedium, faDiscord, faGithub);

const getIcon = (name: IconName): IconProp => {
    switch (name) {
        case 'clipboard':
            return ['far', 'clipboard'];
        case 'question-circle':
            return ['far', 'question-circle'];
        case 'x-twitter':
            return ['fab', 'x-twitter'];
        case 'medium':
            return ['fab', 'medium'];
        case 'discord':
            return ['fab', 'discord'];
        case 'github':
            return ['fab', 'github'];
        default:
            return name;
    }
};

export type IconProps = Pick<
    FontAwesomeIconProps,
    'style' | 'size' | 'color' | 'spin' | 'className'
> & {
    name: IconName;
};

export const Icon: React.FC<IconProps> = ({ name, style, ...rest }) => (
    <FontAwesomeIcon style={style} icon={getIcon(name)} {...rest} />
);
