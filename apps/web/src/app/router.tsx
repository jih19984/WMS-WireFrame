import { createBrowserRouter } from "react-router-dom";
import { QueryProvider } from "@/app/_common/providers/QueryProvider";
import AppLayout from "@/app/layout";
import DashboardPage from "@/app/page";
import LoginPage from "@/app/login/page";
import DepartmentPage from "@/app/department/page";
import DepartmentCreatePage from "@/app/department/create/page";
import DepartmentEditPage from "@/app/department/edit/[id]/page";
import TeamPage from "@/app/team/page";
import TeamDetailPage from "@/app/team/detail/[id]/page";
import TeamCreatePage from "@/app/team/create/page";
import TeamEditPage from "@/app/team/edit/[id]/page";
import UserPage from "@/app/user/page";
import UserDetailPage from "@/app/user/detail/[id]/page";
import UserCreatePage from "@/app/user/create/page";
import UserEditPage from "@/app/user/edit/[id]/page";
import WorklogPage from "@/app/worklog/page";
import WorklogDetailPage from "@/app/worklog/detail/[id]/page";
import WorklogCreatePage from "@/app/worklog/create/page";
import WorklogEditPage from "@/app/worklog/edit/[id]/page";
import SearchPage from "@/app/search/page";
import FilePage from "@/app/file/page";
import NotificationPage from "@/app/notification/page";
import TagPage from "@/app/tag/page";
import ProfilePage from "@/app/profile/page";

const withProvider = (element: React.ReactNode) => <QueryProvider>{element}</QueryProvider>;

export const router = createBrowserRouter([
  { path: "/login", element: withProvider(<LoginPage />) },
  {
    path: "/",
    element: withProvider(<AppLayout />),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "department", element: <DepartmentPage /> },
      { path: "department/create", element: <DepartmentCreatePage /> },
      { path: "department/edit/:id", element: <DepartmentEditPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "team/detail/:id", element: <TeamDetailPage /> },
      { path: "team/create", element: <TeamCreatePage /> },
      { path: "team/edit/:id", element: <TeamEditPage /> },
      { path: "user", element: <UserPage /> },
      { path: "user/detail/:id", element: <UserDetailPage /> },
      { path: "user/create", element: <UserCreatePage /> },
      { path: "user/edit/:id", element: <UserEditPage /> },
      { path: "worklog", element: <WorklogPage /> },
      { path: "worklog/detail/:id", element: <WorklogDetailPage /> },
      { path: "worklog/create", element: <WorklogCreatePage /> },
      { path: "worklog/edit/:id", element: <WorklogEditPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "file", element: <FilePage /> },
      { path: "notification", element: <NotificationPage /> },
      { path: "tag", element: <TagPage /> },
      { path: "profile", element: <ProfilePage /> }
    ]
  }
]);
