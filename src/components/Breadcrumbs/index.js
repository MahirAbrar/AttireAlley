"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = ({ customPaths = {} }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ name: "Home", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Use custom name if provided, otherwise format the segment
      const name =
        customPaths[currentPath] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  return (
    <nav className="breadcrumbs mb-4 text-sm">
      <ul>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.path}>
            {crumb.isLast ? (
              <span className="text-gray-500 dark:text-gray-400">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="transition-colors hover:text-primary"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
