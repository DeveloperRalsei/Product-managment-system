import { ActionIcon } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { IconDeviceDesktop } from "@tabler/icons-react";

export const FullscreenToggle = () => {
    const { toggle, fullscreen } = useFullscreen();
    return (
        <ActionIcon onClick={toggle} color={fullscreen ? "red" : "blue"}>
            <IconDeviceDesktop />
        </ActionIcon>
    );
};
