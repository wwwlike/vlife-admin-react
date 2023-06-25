
import { Field, Form} from "@formily/core";
/**
 * 简化formily操作
 */
 export interface ModelOperations {
  //隐藏
  hide(...fieldName: string[]): ModelOperations;
  //显示
  show(...fieldName: string[]): ModelOperations;
  //表达式对字段进行显示隐藏
  visible(express:boolean,...fieldName: string[]): ModelOperations;
  //清空指定字段
  clear(...fieldName: string[]): ModelOperations;
    //清空所有字段，排除自定字段
  clearAll(...ignores: string[]): ModelOperations;
  //隐藏并清空字段
  clearAndHide(...fieldName: string[]): ModelOperations;
  //自读
  readOnly(...fieldName: string[]): ModelOperations;
  //可编辑
  editable(...fieldName: string[]): ModelOperations;
  //设置单个字段值
  setValue(fieldName:string,value:any):void;
  //设置对象值
  setValues(value:any):void;
  //得到字段值
  getValue(fieldName:string):any;
  //获得formily字段信息（都会封装好，一般不使用）
  getField(fieldName:string):Field;
  //控件异步请求到的原始数据(方便进行其他字段联动时判断使用)
  fetchData(fieldName:string):any|undefined;
  //最新表单值
  values():any;
  //同步校验，校验字段/异常成立表达式/异常提醒
  validate(fieldName:string,expriession:boolean,msg:string):ModelOperations
  // validate(fieldName:string,customValidate?:{}[],...validateKey:string[]):ModelOperations
}

 export class ModelOperationsImpl implements ModelOperations {
   MESSAGE:{[key:string]:string}={
    NOT_EMPTY:"不能为空",
  }

  private model: Form;

  constructor(model: Form) {
    this.model = model;
  }

  hide(...fieldName: string[]): ModelOperations {
    fieldName.forEach(f=>{
      this.model.setFieldState(f, (state) => {
        state.hidden = true;
      });
    })
    return this;
  }
  show(...fieldName: string[]): ModelOperations {
    fieldName.forEach(f=>{
      this.model.setFieldState(f, (state) => {
        state.hidden =false;
      });
    })
    return this;
  }
  visible(visible:boolean,...fieldName: string[]): ModelOperations {
    fieldName.forEach(f=>{
      this.model.setFieldState(f, (state) => {
        state.hidden = !visible;
      });
    })
    return this;
  }
  clear(...fieldName: string[]): ModelOperations{
    fieldName.forEach(f=>{
      this.model.deleteValuesIn(f);
     })
    return this;
  }
  clearAndHide(...fieldName: string[]): ModelOperations{
    this.hide(...fieldName)
    this.clear(...fieldName)
    return this;
  }
  clearAll(...ignores: string[]): ModelOperations {
    const allIgnoresFields=["id",'status','createId','modifyId','createDate','modifyDate',...ignores];
    this.clear(...Object.keys(this.model.values).filter(f=>!allIgnoresFields.includes(f)))
    return this;
  }
  readOnly(...fieldName: string[]): ModelOperations {
    fieldName.forEach(f=>{
      this.model.setFieldState(f, (state) => {
        state.readPretty =true;
      });
    })
    return this;
  }
  editable(...fieldName: string[]): ModelOperations{
    fieldName.forEach(f=>{
      this.model.setFieldState(f, (state) => {
        state.editable =true;
      });
    })
    return this;
  };
  setValue(fieldName:string,value:any):void{
    this.model.setValuesIn(fieldName,value);
  };
  setValues(value:any):void{
    this.model.setValues(value);
  };
  getValue(fieldName:string):any{
    return this.model.values[fieldName];
  };
  //获得formily字段信息（都会封装好，一般不使用）
  getField(fieldName:string):Field{
   return this.model.query(fieldName).take() as Field;
  };
  //控件异步请求到的原始数据(方便进行其他字段联动时判断使用)
  fetchData(fieldName:string):any|undefined{
    return this.model.query(fieldName).take()?.componentProps.fetchData;
  };
  values() {
    return this.model.values;
  }


  validate(fieldName: string, expression: boolean, message: string): ModelOperations {
    const field:Field=this.getField(fieldName);
      if(expression){
        field.setFeedback(
          ...field.feedbacks,
          {
          code: "aaa",
          type: "error",
          messages: [field.title+message],
        });
      }else{
        field.setFeedback({});
      }
      return this;
  }

}