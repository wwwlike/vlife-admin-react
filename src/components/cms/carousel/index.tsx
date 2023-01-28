/**
 * 轮播图
 */
import { Carousel, Space } from "@douyinfe/semi-ui";
import Paragraph from "@douyinfe/semi-ui/lib/es/typography/paragraph";
interface imgInfo {
  src: string;
  title: string;
  line1: string;
  line2: string;
}
export interface vfCarouselProps {
  imgs?: imgInfo[];
  className?: string;
}
const defImgs: imgInfo[] = [
  {
    src: "https://www.ymtc.com/cn/1ca/image/20210809/45dfb89373cefcf8fa116d1213a29955.png",
    title: "低代码平台",
    line1: "全量开源",
    line2: "前端后端B端C端",
  },
  {
    src: "https://www.ymtc.com/cn/1ca/image/20210714/5f76cd416f6b79863c7c5f88d40d43be.jpg",
    title: "低代码平台",
    line1: "全量开源",
    line2: "前端后端B端C端",
  },
  {
    src: "https://www.ymtc.com/cn/1ca/image/20210804/f9cfe5b6c6da6ab98464caf239c492e8.jpg",
    title: "低代码平台",
    line1: "全量开源",
    line2: "前端后端B端C端",
  },
];
const style = {
  width: "100%",
  // height: "500px",
};

const titleStyle = {
  top: "100px",
  left: "100px",
  color: "#1C1F23",
};

const colorStyle = {
  color: "#FFFFFF",
};

const VfCarousel = ({ imgs = defImgs, className }: vfCarouselProps) => {
  return (
    <Carousel
      key={JSON.stringify(imgs)}
      style={style}
      theme="light"
      autoPlay={false}
      speed={1000}
      indicatorType="line"
      className={` ${className ? className : "h-full"}`}
    >
      {imgs?.map((img, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${img.src})`,
            }}
          >
            <Space
              vertical
              align="start"
              spacing="medium"
              className=" absolute"
              style={titleStyle}
            >
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                {img.title}
              </h2>

              {/* <Title style={colorStyle}>{img.title}</Title> */}
              <Space vertical align="start">
                <Paragraph style={colorStyle}>{img.line1}</Paragraph>
                <Paragraph style={colorStyle}>{img.line2}</Paragraph>
              </Space>
            </Space>
          </div>
        );
      })}
    </Carousel>
  );
};

export default VfCarousel;
