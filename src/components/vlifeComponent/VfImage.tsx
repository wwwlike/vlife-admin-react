import { Upload } from "@douyinfe/semi-ui";
import React from "react";
import { VfBaseProps } from "..";
import { IconBolt } from "@douyinfe/semi-icons";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { SysFile } from "@src/mvc/SysFile";

/**
 * @returns 图片上传组件
 */
type T = string | string[];

interface VfImageProps extends VfBaseProps<T, SysFile[]> {}

const VfImage = ({ fieldInfo, value, datas, read }: VfImageProps) => {
  const defaultFileList: FileItem[] = datas.map((d) => {
    return { ...d, uid: d.id, status: "success" };
  });

  // [
  //   {
  //     uid: "1",
  //     name: "dy.jpeg",
  //     size: "130kb",
  //     status: "success",
  //     url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png",
  //   },
  // ];

  return datas && datas.length > 0 && fieldInfo.fieldType === "basic" ? (
    <></>
  ) : (
    <Upload
      fileName="file"
      action="http://localhost:8288/oa/sysFile/uploadImg"
      dragIcon={<IconBolt />}
      // afterUpload={(data) => {
      //   return data;
      // }}
      limit={fieldInfo.fieldType === "basic" ? 1 : 100}
      draggable={true}
      accept=".png,.jpg"
      dragMainText={"点击上传文件或拖拽文件到这里"}
      defaultFileList={defaultFileList}
      dragSubText="仅支持png、jpg"
      style={{ marginTop: 10 }}
    ></Upload>
  );
};

export default VfImage;
