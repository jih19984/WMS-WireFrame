import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { canManageUsers } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { useUser } from "@/app/user/_hooks/useUser";
import { UserList } from "@/app/user/_components/UserList";
import { Button } from "@/components/ui/button";

export default function UserPage() {
  const { user } = useAuth();
  const { users } = useUser();
  const canManage = canManageUsers(user);

  return (
    <>
      <PageHeader
        title="사용자 관리"
        description="구성원의 프로필, 소속 팀, 역할, 스킬을 한 화면에서 관리합니다."
        actions={
          canManage ? (
          <Button asChild>
            <Link to="/user/create">사용자 등록</Link>
          </Button>
          ) : null
        }
      />
      <UserList users={users} readOnly={!canManage} />
    </>
  );
}
