/**
 * 竖屏代办
 */

interface waitProps {}

interface WaitProps {
  title?: string;
  infos: info[];
}

const mock: WaitProps = {
  title: "汇总数据组件",
  infos: [
    { title: "总人数", total: 120 },
    { title: "新增人数", total: 132 },
    { title: "服务人数", total: 112 },
  ],
};
const Wait = (waitProps: WaitProps) => {
  return (
    <div className="flex flex-col">
      {waitProps.infos.map((info) => {
        return (
          <div className="flew">
            <div>图标</div>
            <div>title</div>
            <div>remark</div>
            <div>count</div>
          </div>
        );
      })}
    </div>
  );
};
export default Wait;
