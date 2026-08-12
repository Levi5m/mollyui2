import React from "react";
import { Transition } from "@mantine/core";
import { isEnvBrowser } from "../../../utils/misc";
import "./index.scss";

interface Option { keyLabel: string; type: string; label: string; checked?: boolean }

const Keybinds: React.FC = () => {
    const [visible, setVisible] = React.useState(false);
    const [keybinds, setKeybinds] = React.useState<Option[]>([
        { keyLabel: "U", type: "checkbox", label: "Noclip", checked: true },
        { keyLabel: "H", type: "checkbox", label: "Freecam", checked: false },
        { keyLabel: "Z", type: "button", label: "Refill Health" },
        { keyLabel: "Z", type: "button", label: "Refill Armour" },
    ]);

    if (isEnvBrowser()) {
        React.useEffect(() => {
            setVisible(true);
        }, []);
    }

    React.useEffect(() => {
        const listener = (e: MessageEvent) => {
            const data = e.data;

            if (data.action === "displayBinds") {
                setVisible(data.visible);

                if (typeof data.binds != "undefined") {
                    setKeybinds(data.binds);
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [keybinds.length]);

    return (
        <>
            <Transition mounted={visible} transition={"fade"} duration={500} timingFunction="ease">
                {(styles) => (
                    <div className="KBLWrapper" style={styles}>
                        <div className="Header">
                            <div className="Title">Keybinds</div>
                        </div>
                        <div className="Keybinds">
                            {keybinds.map((bind, i) => (
                                <div key={i} className={`Keybind ${bind.checked ? "Activated" : ""}`}>
                                    <div className="Label">{bind.label}</div>
                                    <div className="Elements">
                                        <span style={{ color: "white" }}>({bind.keyLabel})</span>
                                        <div style={{ position: "relative", display: "flex", alignItems: "center", marginRight: "0.35vw", color: "white" }}>{(bind.type == "checkbox" || bind.type == "slider-checkbox") && (<span style={{ color: "white" }}>(<span className="BStatus" style={{ color: bind.checked ? "" : "rgba(255, 255, 255, 0.50)" }}>{bind.checked ? "On" : "Off"}</span>)</span>)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
};

export default Keybinds;