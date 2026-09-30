"use client";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { ErrorBlock, LoadingBlock } from "@/components/query-state";
import { BackLink, Button, EmptyState } from "@/components/ui";
import { api } from "@/lib/api";
import { formatRelativeDays, formatTime } from "@/lib/format";
import { keys, useNotifications } from "@/lib/queries";

export default function NotificationsPage() {
  const client = useQueryClient();
  const notifications = useNotifications();
  const refresh = () => client.invalidateQueries({ queryKey: keys.notifications });

  return (
    <>
      <BackLink href="/perfil" label="Meu perfil" />
      <div className="page-title-row">
        <div>
          <p className="eyebrow">AVISOS</p>
          <h1>Notificações</h1>
          <p>Lembretes de consultas, confirmações e avisos importantes.</p>
        </div>
        {!!notifications.data?.unread && (
          <Button variant="secondary" onClick={() => void api("/notifications/read-all", { method: "POST" }).then(refresh)}>
            <CheckCheck size={17} /> Marcar todas como lidas
          </Button>
        )}
      </div>
      {notifications.isPending ? (
        <LoadingBlock lines={4} />
      ) : notifications.isError ? (
        <ErrorBlock error={notifications.error} onRetry={() => void notifications.refetch()} />
      ) : notifications.data.items.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="Sem notificações." description="Tudo tranquilo por aqui. Seus lembretes aparecerão neste espaço." />
      ) : (
        <ul className="notification-list">
          {notifications.data.items.map((n) => {
            const content = (
              <>
                <span className={`notification-dot ${n.readAt ? "" : "unread"}`} aria-hidden="true" />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>
                    {formatRelativeDays(n.createdAt)} · {formatTime(n.createdAt)}
                    {!n.readAt && <span className="sr-only"> · não lida</span>}
                  </small>
                </div>
              </>
            );
            const markRead = () => {
              if (!n.readAt) void api(`/notifications/${n.id}/read`, { method: "POST" }).then(refresh);
            };
            return (
              <li key={n.id} className={n.readAt ? "" : "is-unread"}>
                {n.link ? (
                  <Link href={n.link} onClick={markRead}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" onClick={markRead}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
