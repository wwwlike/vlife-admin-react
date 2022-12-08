import { Space, Upload } from "@douyinfe/semi-ui";
import React, { useEffect, useMemo, useState } from "react";
import { VfBaseProps } from "..";
import { IconBolt } from "@douyinfe/semi-icons";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { SysFile } from "@src/mvc/SysFile";
import { Image, ImagePreview } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";

const apiUrl = import.meta.env.VITE_APP_API_URL;
/**
 * @returns 图片上传组件
 */

interface VfImageProps extends VfBaseProps<string | string[], SysFile[]> {}

const VfImage = ({
  fieldInfo,
  value,
  datas,
  onDataChange,
  read,
}: VfImageProps) => {
  const [images, setImages] = useState(datas);

  useEffect(() => {
    setImages(datas);
  }, [datas]);

  // useUpdateEffect(() => {
  //   onDataChange(images?.map((d) => d.id) || []);
  // }, [images]);

  const fileList = useMemo((): FileItem[] => {
    if (images)
      return (
        images?.map((d) => {
          return {
            uid: d.id,
            status: "success",
            name: d.fileName,
            size: d.size,
            url: apiUrl + "/sysFile/image/" + d.id,
          };
        }) || []
      );
    return [];
  }, [images]);

  // [
  //   {
  //     uid: "1",
  //     name: "dy.jpeg",
  //     size: "130kb",
  //     status: "success",
  //     url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png",
  //   },
  // ];

  return read ? (
    <Space>
      {datas?.map((d) => (
        <>
          {/* <Space>{apiUrl + "/sysFile/image/" + d.id}</Space> */}
          <Image
            width={100}
            height={100}
            src={`${apiUrl}/sysFile/image/${d.id}`}
          ></Image>
        </>
      ))}
    </Space>
  ) : (
    <>
      <Upload
        fileName="file"
        action={`${apiUrl}/sysFile/uploadImg`}
        dragIcon={<IconBolt />}
        limit={fieldInfo.fieldType === "basic" ? 1 : 100}
        draggable={true}
        afterUpload={(data: any) => {
          setImages([]);
          if (data.response.data === -1) {
          } else {
            setImages([data.response.data]);
          }
          return data;
        }}
        accept=".png,.jpg"
        dragMainText={"点击上传文件或拖拽文件到这里"}
        // defaultFileList={fileList}
        fileList={fileList}
        dragSubText="仅支持png、jpg"
        style={{ marginTop: 10 }}
      ></Upload>{" "}
      {JSON.stringify(fileList)}
    </>
  );
};

export default VfImage;
