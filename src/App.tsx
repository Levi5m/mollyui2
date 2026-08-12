import React from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from './theme';
import Vanta from "./features";
import Input from "./features/modules/input";
import Notifications from "./features/modules/notifications";
import Keybinds from "./features/modules/keybinds";

const App: React.FC = () => {
    return (
        <MantineProvider withNormalizeCSS withGlobalStyles theme={{ ...theme }}>
            <Vanta />
            <Input />
            <Notifications />
            <Keybinds />
        </MantineProvider>
    )
}

export default App