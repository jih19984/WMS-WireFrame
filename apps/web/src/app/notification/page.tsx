import { PageHeader } from "@/app/_common/components/PageHeader";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { NotificationList } from "@/app/notification/_components/NotificationList";

export default function NotificationPage() {
  const { notifications } = useNotification();

  return (
    <>
      <PageHeader title="알림" description="업무 긴급도, 마감, 의존성 변화 알림을 확인합니다." />
      <NotificationList notifications={notifications} />
    </>
  );
}
