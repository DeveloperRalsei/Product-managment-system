import { createTheme, DEFAULT_THEME } from "@mantine/core";

export const theme = createTheme({
    ...DEFAULT_THEME,
    components: {
        Button: {
            defaultProps: {
                variant: "light",
            },
        },
    },
});
