import { createTheme, DEFAULT_THEME } from "@mantine/core";

export const theme = createTheme({
    ...DEFAULT_THEME,
    components: {
        ActionIcon: {
            defaultProps: {
                variant: "light",
            },
        },
    },
});
