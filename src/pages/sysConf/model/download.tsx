import { Button } from "@douyinfe/semi-ui";
import React from "react";
interface downloadProps {
  className?: string;
  data: string;
  fileName: string;
}
function DownloadButton({ className, data, fileName }: downloadProps) {
  const handleClick = () => {
    // const blob = new Blob([data]);
    // const url = window.URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // window.URL.revokeObjectURL(url);

    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // const blob = new Blob([data]);
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(blob);
    // link.download = fileName;

    // // create a hidden input element
    // const input = document.createElement("input");
    // input.type = "file";
    // input.style.display = "none";
    // input.accept = "application/octet-stream";
    // input.onchange = () => {
    //   URL.revokeObjectURL(link.href);
    // };
    // input.addEventListener("change", () => {
    //   const file = input.files[0];
    //   link.download = file.name;
    //   link.click();
    // });

    // document.body.appendChild(input);
    // input.click();
    // document.body.removeChild(input);
  };

  return (
    <Button
      type="primary"
      className={`animate-bounce  ${className}`}
      onClick={handleClick}
    >
      下载 {fileName}
    </Button>
  );
}

export default DownloadButton;
