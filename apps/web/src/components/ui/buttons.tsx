import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useFullscreen } from "@mantine/hooks";
import { IconDeviceDesktop } from "@tabler/icons-react";

export const ColorSchemeToggle = () => {
    const { toggleColorScheme, colorScheme } = useMantineColorScheme();

    return (
        <ActionIcon
            onClick={toggleColorScheme}
            color={colorScheme === "dark" ? "yellow" : "blue"}
        >
            {colorScheme === "dark" ? <IconSunFilled /> : <IconMoonFilled />}
        </ActionIcon>
    );
};

export const FullscreenToggle = () => {
    const { toggle, fullscreen } = useFullscreen();
    return (
        <ActionIcon onClick={toggle} color={fullscreen ? "red" : "blue"}>
            <IconDeviceDesktop />
        </ActionIcon>
    );
};
