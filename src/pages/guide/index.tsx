import { Card, Col, Empty, Row } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import React from 'react';

export default ()=>{
 return <>
      <Row>
        <Col span={6}>
          <Card >
            <Empty image={<img src={"http://admin.vlife.cc/image/vlife_jg.png"} />}></Empty>  
            <Meta title="01平台介绍" description="111111111"
             />
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span={6}>
          <Card >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
        <Col span={6}>
          <Card  >
            Semi Design 是由互娱社区前端团队与 UED 团队共同设计开发并维护的设计系统。
          </Card>
        </Col>
      </Row>
  </>
}