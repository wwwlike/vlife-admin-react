import React, { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import Content from "./content";
/**
 * 所有页面模版
 */
export default () => {
  const location = useLocation();
  const entityType = useMemo(() => {
    if (location) {
      return location.pathname.split("/").pop();
    }
    return null;
  }, [location]);
  return (
    (entityType && (
      <Content
        key={entityType}
        filterType={`${entityType}PageReq`}
        entityType={entityType}
      />
    )) || <></>
  );
};
