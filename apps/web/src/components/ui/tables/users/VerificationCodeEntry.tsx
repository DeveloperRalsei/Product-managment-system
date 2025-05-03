import { Button, Group, PinInput, Stack } from "@mantine/core";

export const VerificationCodeEntry = () => {
    return (
        <Stack mt="sm" align="center" justify="center">
            <Group>
                <PinInput length={6} />
                <Button>Gönder</Button>
            </Group>
        </Stack>
    );
};
