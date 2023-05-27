import React, { FC, useEffect, useMemo, useState } from "react";
import { Empty, Button } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";
import {
  IllustrationNoAccess,
  IllustrationConstruction,
} from "@douyinfe/semi-illustrations";

interface Iprops {
  title?: string;
  description?: string;
  imgSize?: "small" | "large" | "default";
  type?: "404" | "403";
}

const Result: FC<Iprops> = ({
  title,
  description,
  type,
  imgSize = "default",
}) => {
  const navigate = useNavigate();
  // const [size, setSize] = useState(imgSi);

  const size = useMemo((): string => {
    if (imgSize === "small") {
      return "w-20";
    } else if (imgSize === "large") {
      return "w-60";
    }
    return "w-40";
  }, [imgSize]);
  useEffect(() => {
    if (type === "403") {
      // navigate(`/login${"?from=" + encodeURIComponent(location.pathname)}`, {
      //   replace: true,
      // });
      // const gotoLogin = `/login${
      //   location.pathname && location.pathname.length > 1
      //     ? "?from=" + encodeURIComponent(location.pathname)
      //     : ""
      // }`;
      // window.location.href = gotoLogin;
    }
  }, []);
  return (
    <Empty
      image={
        type == "403" ? (
          <IllustrationNoAccess className={size} />
        ) : (
          <IllustrationConstruction className={size} />
        )
      }
      title={title}
      description={description}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {type && (
        <Button
          style={{ padding: "6px 24px", width: " 180px" }}
          theme="solid"
          type="primary"
          onClick={
            type === "403"
              ? () => {
                  const gotoLogin = `/login${
                    location.pathname && location.pathname.length > 1
                      ? "?from=" + encodeURIComponent(location.pathname)
                      : ""
                  }`;
                  // navigate(gotoLogin);
                  window.location.href = gotoLogin;
                }
              : () => navigate(`/dashboard/workbeach`, { replace: true })
          }
        >
          {type === "403" ? "去登录" : "回到首页"}
        </Button>
      )}
    </Empty>
  );
};

export default Result;
