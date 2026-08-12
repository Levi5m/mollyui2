import React from "react";
import { isEnvBrowser } from "../../../utils/misc";
import "./index.scss";

interface Notification { id: number; type: "success" | "error" | "info"; title: string; desc: string; duration: number; }
let nextId = 0;

const Notifications: React.FC = () => {
  const [list, setList] = React.useState<Notification[]>([]);
  const add = React.useCallback((n: Omit<Notification, "id">) => { nextId++; setList((prev) => [...prev, { ...n, id: nextId }]); }, []);
  const remove = React.useCallback((id: number) => { setList((prev) => prev.filter((n) => n.id !== id)); }, []);

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;

      if (data.action === "showNotification") {
        add({
          type: data.type || "info",
          title: data.title || "Notification",
          desc: data.desc || "",
          duration: data.duration || 4000,
        });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [add]);

  React.useEffect(() => {
    if (!isEnvBrowser()) return;

    add({ type: "success", title: "Success", desc: "You have successfully loaded Sync Menu, welcome!", duration: 4000, });
    add({ type: "info", title: "Info", desc: "Your license will never expire, thanks for using Sync Menu.", duration: 4000, });
    add({ type: "error", title: "Error", desc: "Loaded Staff/Developer Modules!", duration: 4000, });
  }, [add]);

  return (
    <div className="NotificationsWrapper">
      {list.map((n) => (
        <NotificationItem key={n.id} data={n} onRemove={remove} />
      ))}
    </div>
  );
};

type ItemProps = { data: Notification; onRemove: (id: number) => void; };

const NotificationItem: React.FC<ItemProps> = ({ data, onRemove }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const autoTimer = React.useRef<number>();
  const fallbackTimer = React.useRef<number>();
  const done = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.offsetWidth;
      el.classList.add("enter");
    });

    const startExit = () => {
      if (!el) return;
      el.classList.remove("enter");
      el.classList.add("exit");
      el.addEventListener("transitionend", handleEnd);
      fallbackTimer.current = window.setTimeout(() => {
        if (!done.current) cleanUp();
      }, 600);
    };

    const handleEnd = (e: Event) => {
      if (e.target !== el) return;
      done.current = true;
      cleanUp();
    };

    const cleanUp = () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      el?.removeEventListener("transitionend", handleEnd);
      onRemove(data.id);
    };

    autoTimer.current = window.setTimeout(startExit, data.duration);

    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      el?.removeEventListener("transitionend", handleEnd);
    };
  }, [data, onRemove]);

  return (
    <div ref={ref} id={`notif-${data.id}`} className={`Notification ${data.type}`}>
      <div className="Header">
        <i className="fa-solid fa-circle-info" />
        <span className="Title">{data.title}</span>
      </div>
      <div className="Body">
        <span className="NDesc">{data.desc}</span>
      </div>
    </div>
  );
};

export default Notifications;