import type { ReactNode } from "react";

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

export function resolveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const cleanPath = pathname.replace(/\/$/, "") || "/";

  if (cleanPath === "/") {
    return [{ label: "대시보드" }];
  }

  const staticRoutes: Record<string, BreadcrumbItem[]> = {
    "/department": [{ label: "조직" }, { label: "부서 관리" }],
    "/department/create": [
      { label: "조직" },
      { label: "부서 관리", href: "/department" },
      { label: "부서 등록" },
    ],
    "/team": [{ label: "조직" }, { label: "팀 관리" }],
    "/team/create": [
      { label: "조직" },
      { label: "팀 관리", href: "/team" },
      { label: "팀 등록" },
    ],
    "/user": [{ label: "조직" }, { label: "사용자 관리" }],
    "/user/create": [
      { label: "조직" },
      { label: "사용자 관리", href: "/user" },
      { label: "사용자 등록" },
    ],
    "/worklog": [{ label: "업무일지" }, { label: "업무 검색" }],
    "/worklog/create": [
      { label: "업무일지" },
      { label: "업무 등록" },
    ],
    "/search": [{ label: "검색" }, { label: "시맨틱 검색" }],
    "/file": [{ label: "파일" }],
    "/notification": [{ label: "알림" }],
    "/tag": [{ label: "태그" }],
    "/my-page": [{ label: "마이페이지" }],
    "/profile": [{ label: "마이페이지" }],
  };

  if (staticRoutes[cleanPath]) {
    return staticRoutes[cleanPath];
  }

  if (cleanPath.startsWith("/department/edit/")) {
    return [
      { label: "조직" },
      { label: "부서 관리", href: "/department" },
      { label: "부서 수정" },
    ];
  }

  if (cleanPath.startsWith("/department/detail/")) {
    return [
      { label: "조직" },
      { label: "부서 관리", href: "/department" },
      { label: "부서 상세" },
    ];
  }

  if (cleanPath.startsWith("/team/detail/")) {
    return [
      { label: "조직" },
      { label: "팀 관리", href: "/team" },
      { label: "팀 상세" },
    ];
  }

  if (cleanPath.startsWith("/team/edit/")) {
    return [
      { label: "조직" },
      { label: "팀 관리", href: "/team" },
      { label: "팀 수정" },
    ];
  }

  if (cleanPath.startsWith("/user/detail/")) {
    return [
      { label: "조직" },
      { label: "사용자 관리", href: "/user" },
      { label: "사용자 상세" },
    ];
  }

  if (cleanPath.startsWith("/user/edit/")) {
    return [
      { label: "조직" },
      { label: "사용자 관리", href: "/user" },
      { label: "사용자 수정" },
    ];
  }

  if (cleanPath.startsWith("/worklog/detail/")) {
    return [
      { label: "업무일지" },
      { label: "업무 상세" },
    ];
  }

  if (cleanPath.startsWith("/worklog/edit/")) {
    return [
      { label: "업무일지" },
      { label: "업무 수정" },
    ];
  }

  return [{ label: "AX-WMS" }];
}
