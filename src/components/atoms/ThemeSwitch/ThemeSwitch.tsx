import { Switch } from 'src/components/ui/Switch';

export const ThemeSwitch = ({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}) => {
    return <Switch checked={checked} onCheckedChange={onCheckedChange} />;
};
