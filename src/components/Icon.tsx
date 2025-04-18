import { IconName, IconProp, library } from '@fortawesome/fontawesome-svg-core';
import {
    faDiscord,
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
/* eslint-disable @typescript-eslint/no-explicit-any */
library.add(
    faCircleNotch as any,
    faCheck as any,
    faCheckCircle as any,
    faExclamationTriangle as any,
    faInfoCircle as any,
    faTimes as any,
    faTrash as any,
    faChartLine as any,
    faRedo as any,
    faHistory as any,
    faChevronLeft as any,
    faChevronRight as any,
    faClipboard as any,
    faClipboardCheck as any,
    faUserCircle as any,
    faWallet as any,
    faExternalLinkAlt as any,
    faCog as any,
    faPlug as any,
    faExclamationCircle as any,
    faAngleUp as any,
    faAngleDoubleUp as any,
    faAngleDown as any,
    faAngleDoubleDown as any,
    faPen as any,
    faHandPaper as any,
    faHeartbeat as any,
    faBars as any,
    faQuestionCircle as any,
    faArrowDown as any
);

// Brand icons
library.add(faXTwitter as any, faMedium as any, faDiscord as any);
/* eslint-enable @typescript-eslint/no-explicit-any */

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
