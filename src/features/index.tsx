import React from "react";
import { Transition } from "@mantine/core";
import { isEnvBrowser } from "../utils/misc";
import { Icon } from "@iconify/react";
import "./index.scss";

interface Metadata { key: string; value: string; color?: string }
interface Tab {
    type: string;
    label: string;
    desc?: string;
    categories?: { label: string; tabs: Tab[] }[];
    hazardous?: boolean;
    checked?: boolean;
    locked?: boolean;
    value?: number;
    values?: string[];
    min?: number;
    max?: number;
    step?: number;
    name?: string;
    dead?: boolean;
    vehicle?: boolean;
    isDriver?: boolean;
    metaData?: Metadata[];
}

const Vanta: React.FC = () => {
    const [visible, setVisible] = React.useState<boolean>(false);
    const rootTabs: Tab[] = [
        {
            type: "subMenu",
            label: "Player",
            categories: [
                {
                    label: "Player",
                    tabs: [{ type: "button", label: "Revive", desc: "This will attempt to revive you." }, { type: "slider", label: "Health", value: 100 }, { type: "slider", label: "Armour", value: 50 }, { type: "scrollable-checkbox", label: "Godmode", checked: true, value: 1, values: ["Safe"] }, { type: "scrollable", label: "Values", value: 1, values: ["Safe"] }, { type: "divider", label: "Movement" }, { type: "slider-checkbox", label: "Noclip", value: 2.5, min: 0.25, max: 5.0, step: 0.25 }]
                },
                {
                    label: "Miscellaneous",
                    tabs: [{ type: "scrollable", label: "Clear Tasks", value: 1, values: ["Primary", "Secondary"] }, { type: "subMenu", label: "Equipment" }]
                },
                {
                    label: "Wardrobe",
                    tabs: [{ type: "scrollable", label: "Outfit", value: 1, values: [ "Random", "Staff", "Police", "Civilian" ] }, { type: "button", label: "Skin Menu" }, { type: "divider", label: "Clothing" }]
                }
            ]
        },
        {
            type: "subMenu",
            label: "Weapon",
            categories: [
                {
                    label: "Loadouts",
                    tabs: [{ type: "subMenu", label: "Primary" }, { type: "subMenu", label: "Secondary" }]
                },
                {
                    label: "Attachments",
                    tabs: [{ type: "subMenu", label: "Scopes" }, { type: "subMenu", label: "Barrels" }]
                }
            ]
        },
        { type: "subMenu", label: "Server", categories: [{ label: "List", tabs: [{ type: "button", label: "Select Everyone" }, { type: "button", label: "Un-Select Everyone" }, { type: "button", label: "Clear Selection" }, { type: "divider", label: "Nearby Players" }, { type: "checkbox", label: "stuntdev - [1]", checked: false, name: "J. Paul", dead: true, metaData: [{ key: "Distance", value: "317.0m" }, { key: "Server ID", value: "1" }, { key: "Health", value: "75", color: "0, 255, 17" }, { key: "Armour", value: "90", color: "0, 132, 255" }, { key: "Weapon", value: "Microsmg" }, { key: "Vehicle", value: "CARNOTFOUND" }, { key: "Alive", value: "Alive" }, { key: "Speed", value: "0.0 km/h" }, { key: "Visible", value: "Yes" }] }, { type: "checkbox", label: "ion - [2]", checked: false, vehicle: true }] }, { label: "Safe", tabs: [{ type: "button", label: "Teleport to Player" }] }] },
        { type: "subMenu", label: "Combat" },
        { type: "subMenu", label: "Vehicle" },
        { type: "subMenu", label: "Visual" },
        { type: "subMenu", label: "Miscellaneous" },
        { type: "subMenu", label: "Settings" }
    ];
    const [tabs, setTabs] = React.useState<Tab[]>(rootTabs);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [menuStack, setMenuStack] = React.useState<{ tabs: Tab[]; categories: { label: string; tabs: Tab[] }[] | null; categoryIndex: number }[]>([]);
    const [categories, setCategories] = React.useState<{ label: string; tabs: Tab[] }[] | null>(null);
    const [categoryIndex, setCategoryIndex] = React.useState<number>(0);
    const [path, setPath] = React.useState<string[]>(["Home"]);
    const [banner, setBanner] = React.useState<{ link: string, color: string }>({ link: "https://files.catbox.moe/vgyx34.png", color: "152, 45, 234" });
    const [highlightTop, setHighlightTop] = React.useState("0vw");
    const [highlightHeight, setHighlightHeight] = React.useState("1.5625vw");
    const [userName, setUserName] = React.useState<string>("Synclua");
    const [progressHeight, setProgressHeight] = React.useState("0%");
    const [progressTop, setProgressTop] = React.useState("0%");
    const tabsRef = React.useRef<(HTMLDivElement | null)[]>([]);

    if (isEnvBrowser()) {
        React.useEffect(() => {
            setVisible(true);
        }, []);
    }

    React.useLayoutEffect(() => {
        if (!visible || tabs.length === 0) return;

        const el = tabsRef.current[selectedIndex];
        if (el) {
            const { offsetTop, offsetHeight } = el;
            const pxToVw = (px: number) => `${(px / window.innerWidth) * 100}vw`;

            setHighlightTop(pxToVw(offsetTop));
            setHighlightHeight(pxToVw(offsetHeight));
            const scrollParent = el.parentElement;
            if (scrollParent) {
                const parentRect = scrollParent.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const distance =
                    elRect.top < parentRect.top
                        ? parentRect.top - elRect.top
                        : elRect.bottom > parentRect.bottom
                        ? elRect.bottom - parentRect.bottom
                        : 0;

                const behavior = distance > 150 ? "auto" : "smooth";

                el.scrollIntoView({
                    block: "nearest",
                    behavior,
                });
            }
        }
    }, [selectedIndex, tabs, visible]);

    React.useEffect(() => {
        const listener = (e: MessageEvent) => {
            const data = e.data;
            if (!data || typeof data !== "object") return;

            if (data.action === "showUI") {
                setVisible(!!data.visible);
                if (data.visible && data.elements) {
                    setTabs(data.elements || []);
                    if (typeof data.index === "number") {
                        setSelectedIndex(data.index);
                    }
                    if (data.path && Array.isArray(data.path)) {
                        setPath(data.path);
                    } else {
                        setPath(["Home"]);
                    }
                }
                if (!data.visible && typeof data.index === "number") {
                    setSelectedIndex(data.index);
                }
                if (typeof data.username != "undefined") {
                    setUserName(data.username);
                }
            }

            if (data.action === "keydown") {
                if (typeof data.index === "number") {
                    setSelectedIndex(data.index);
                }
            }

            if (data.action === "updateBanner") {
                setBanner((prev) => ({ link: data.bannerLink ?? prev.link, color: data.bannerColor ?? prev.color }));

                if (typeof data.bannerColor !== "undefined") {
                    document.documentElement.style.setProperty("--menu-color", data.bannerColor);
                }
            }

            if (data.action === "updateElements") {
                setTabs(data.elements || []);
                if (typeof data.index === "number") {
                    setSelectedIndex(data.index);
                } else {
                    setSelectedIndex(0);
                }
                if (data.categories) {
                    setCategories(data.categories);
                    setCategoryIndex(data.categoryIndex || 0);
                } else {
                    setCategories(null);
                    setCategoryIndex(0);
                }
                if (data.path && Array.isArray(data.path)) {
                    setPath(data.path);
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, []);

    React.useEffect(() => {
        if (tabs.length === 0) return;

        const visibleCount = Math.floor(14.0625 / 1.5625);
        const total = tabs.filter(tab => tab.type !== "divider").length;
        const selected = tabs.filter(tab => tab.type !== "divider").indexOf(tabs[selectedIndex]);

        if (total <= visibleCount) {
            setProgressHeight("97%");
            setProgressTop("0%");
        } else {
            const heightPercent = (visibleCount / total) * 100;
            const topPercent = (selected / total) * (100 - heightPercent);

            setProgressHeight(`${heightPercent}%`);
            setProgressTop(`${topPercent}%`);
        }
    }, [tabs, selectedIndex]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!visible) return;

            switch (e.key) {
                case "ArrowUp":
                    setSelectedIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
                    break;
                case "ArrowDown":
                    setSelectedIndex((prev) => (prev + 1) % tabs.length);
                    break;
                case "Enter": {
                    const current = tabs[selectedIndex];
                    if (current?.categories) {
                        setMenuStack((prev) => [ ...prev, { tabs, categories, categoryIndex } ]);
                        setCategories(current.categories);
                        setCategoryIndex(0);
                        setTabs(current.categories[0].tabs);
                        setSelectedIndex(0);
                    }
                    break;
                }
                case "Backspace": {
                    if (menuStack.length > 0) {
                        const last = menuStack[menuStack.length - 1];
                        setMenuStack((prev) => prev.slice(0, -1));
                        setTabs(last.tabs);
                        setCategories(last.categories);
                        setCategoryIndex(last.categoryIndex);
                        setSelectedIndex(0);
                    }
                    break;
                }
                case "q":
                case "ArrowLeft": {
                    if (categories) {
                        const newIndex = (categoryIndex - 1 + categories.length) % categories.length;
                        setCategoryIndex(newIndex);
                        setTabs(categories[newIndex].tabs);
                        setSelectedIndex(0);
                    }
                    break;
                }
                case "e":
                case "ArrowRight": {
                    if (categories) {
                        const newIndex = (categoryIndex + 1) % categories.length;
                        setCategoryIndex(newIndex);
                        setTabs(categories[newIndex].tabs);
                        setSelectedIndex(0);
                    }
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [tabs, selectedIndex, categories, categoryIndex, menuStack, visible]);

    return (
        <>
            <Transition mounted={visible} transition="fade" duration={300} timingFunction="ease">
                {(styles) => (
                    <div className="VWrapper" style={styles}>
                        <div className="VLeftElements">
                            <div className="VBanner">
                                <img src={banner.link} draggable="false" />
                            </div>
                            <div className="VLeftInnerElements">
                                <div className="VScroll">
                                    <div className="VSProgress" style={{ height: progressHeight, top: progressTop }}></div>
                                </div>
                                <div className="VHeader">
                                    <span className="Path">{path}</span>
                                    <span className="Name">Vanta | discord.gg/vantamenu</span>
                                </div>
                                <div className="VTabs">
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            top: highlightTop,
                                            height: highlightHeight,
                                            backgroundColor: `rgba(${banner.color}, 0.60)`,
                                            zIndex: 0,
                                            transition: "top 200ms ease, height 120ms ease",
                                            pointerEvents: "none"
                                        }}
                                    />
                                    {tabs.map((tab, i) => (
                                        <div key={i} className={`VTab ${i === selectedIndex ? "Selected" : ""}`} ref={(el) => (tabsRef.current[i] = el)}>
                                            {tab.type != "divider" && (<span className="VTLabel">{selectedIndex === i && tab.type == "slider" ? `${tab.label}: ${tab.value}` : selectedIndex === i && tab.type == "slider-checkbox" ? `${tab.label}: ${tab.value}` : tab.label}{tab.hazardous && (<span style={{ color: "#fcb603" }}>&nbsp;*</span>)}</span>)}
                                            {tab.type == "subMenu" && (
                                                <Icon className="Icon" icon="uim:angle-double-right" />
                                            )}
                                            {tab.type === "checkbox" && (
                                                <div className={`Checkbox ${tab.checked ? "Checked" : ""}`}>
                                                    <div className="Inside"></div>
                                                </div>
                                            )}
                                            {tab.type === "slider" && (
                                                <div className="Slider">
                                                    <div className="Progress" style={{ width: `${ tab.max && tab.min !== undefined ? ((tab.value! - tab.min) / (tab.max - tab.min)) * 100 : tab.value}%` }}>
                                                        <div className="Thumb"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tab.type === "slider-checkbox" && (
                                                <div className="VOptions">
                                                    <div className="Slider">
                                                        <div className="Progress" style={{ width: `${ tab.max && tab.min !== undefined ? ((tab.value! - tab.min) / (tab.max - tab.min)) * 100 : tab.value}%`, transition: "0.5s width" }}>
                                                            <div className="Thumb"></div>
                                                        </div>
                                                    </div>
                                                    <div className={`Checkbox ${tab.checked ? "Checked" : ""}`}>
                                                        <div className="Inside"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tab.type === "scrollable-checkbox" && (
                                                <div className="VOptions">
                                                    <div className="Scrollable">
                                                        <span>-</span>
                                                        <span>{tab.values && tab.value ? tab.values[tab.value - 1] : ""}</span>
                                                        <span>-</span>
                                                    </div>
                                                    <div className={`Checkbox ${tab.checked ? "Checked" : ""}`}>
                                                        <div className="Inside"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {tab.type === "scrollable" && (
                                                <div className="Scrollable">
                                                    <span>-</span>
                                                    <span>{tab.values && tab.value ? tab.values[tab.value - 1] : ""}</span>
                                                    <span>-</span>
                                                </div>
                                            )}
                                            {tab.type === "divider" && (
                                                <div className="Divider">
                                                    <div className="Left"></div>
                                                    <span className="Label"><span style={{ color: `rgb(${banner.color})` }}>[</span>{tab.label}<span style={{ color: `rgb(${banner.color})` }}>]</span></span>
                                                    <div className="Right"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="VFooter">
                                    <Icon className="Icon" icon="heroicons:chevron-up-down" style={{ color: `rgb(${banner.color})` }} />
                                    <span className="Indicator">
                                        ({tabs.filter(tab => tab.type !== "divider").indexOf(tabs[selectedIndex]) + 1}/
                                        {tabs.filter(tab => tab.type !== "divider").length})
                                    </span>
                                </div>
                            </div>
                            <Transition mounted={visible && (!tabs[selectedIndex].metaData) && (tabs[selectedIndex].type != "subMenu" && tabs[selectedIndex].type != "divider" && tabs[selectedIndex].type != "slider" && tabs[selectedIndex].type != "scrollable")} transition="pop" duration={25} timingFunction="ease">
                                {(dStyles) => (
                                    <div className="VDesc" style={dStyles}>
                                        <span>{tabs[selectedIndex].desc}</span>
                                        {(tabs[selectedIndex].type == "button" || tabs[selectedIndex].type == "checkbox" || tabs[selectedIndex].type == "scrollable-checkbox" || tabs[selectedIndex].type == "slider-checkbox") && (<span style={{ marginLeft: "12.65vw" }}>Press F5 to Bind</span>)}
                                    </div>
                                )}
                            </Transition>
                        </div>
                        <div className="VRightElements">
                            <div className="PCategories" style={{ position: "relative" }}>
                                <div
                                    className="PCategoryHighlight"
                                    style={{
                                        transform: `translateY(calc(${categoryIndex} * 1.3021vw))`,
                                        transition: "transform 200ms ease",
                                        background: `rgba(${banner.color}, 0.4)`,
                                        border: `.0521vw solid rgb(${banner.color})`,
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "1.3021vw",
                                        borderRadius: ".2604vw",
                                        zIndex: 0,
                                        pointerEvents: "none",
                                    }}
                                />
                                {categories && (
                                    categories.map((cat, i) => (
                                        <div key={i} className={`PCategory ${i === categoryIndex ? "active" : ""}`}>
                                            <span>{cat.label}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Transition mounted={tabs[selectedIndex] && tabs[selectedIndex].metaData && tabs[selectedIndex].metaData?.length > 0 || false} transition="fade" duration={0} timingFunction="ease">
                                {(metadataStyles) => (
                                    <div className="Metadata" style={metadataStyles}>
                                        <div className="Title">
                                            <span>{tabs[selectedIndex].name}</span>
                                        </div>
                                        <div className="Line"></div>
                                        <div className="Values">
                                            {tabs[selectedIndex] && tabs[selectedIndex].metaData && tabs[selectedIndex].metaData?.map((val, i) => (
                                                <div className="Value">
                                                    <div className="Key">{val.key}</div>
                                                    <div className="Val">
                                                        <span style={{ color: val.key == "Weapon" ? "#D82325" : "" }}>{val.value}</span>
                                                        {(val.key == "Health" || val.key == "Armour") && (<div className="Status" style={{ backgroundColor: `rgba(${val.color}, 0.25)` }}>
                                                            <div className="Progress" style={{ height: `${parseInt(val.value)}%`, backgroundColor: `rgb(${val.color})` }}></div>
                                                        </div>)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Transition>
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
};

export default Vanta;