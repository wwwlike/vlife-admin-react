import React, { useCallback, useEffect, useState } from "react";
import { localHistoryLoginUserName, useAuth } from "@src/context/auth-context";
import "./login.css";
import { useForm, useUrlQueryParam } from "@src/hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Empty, Notification, Spin } from "@douyinfe/semi-ui";
import logo from "@src/logo.png";
import RegExp from "@src/util/expression";
import {
  checkEmail,
  RegisterDto,
  sendEmail,
  register as serverReg, //服务端注册
  ThirdAccountDto,
  giteeUrl,
  openCheckCode,
} from "@src/api/SysUser";
import { Result } from "@src/api/base";
import { useDebounceEffect, useInterval } from "ahooks";
import { Modal } from "@douyinfe/semi-ui";

const Index: React.FC = () => {
  const localUsername = window.localStorage.getItem(localHistoryLoginUserName);
  const { user, login, error, giteeLogin } = useAuth();
  const second: number = 99;
  const navigate = useNavigate();
  const { values, errors, setFieldValue } = useForm<{
    username: string;
    password: string;
  }>({ username: localUsername || "", password: "" }, null);

  const [count, setCount] = useState(0);
  // const [interval, setInterval] = useState<number | undefined>(1000);

  const clear = useInterval(() => {
    if (count !== 0) {
      setCount(count - 1);
    }
  }, 1000);
  useEffect(() => {
    if (user && user.id) {
      navigate("/");
    }
  }, [user]);

  //async 意义
  const handelSubmit = async () => {
    await login(values);
  };

  interface registerFlag {
    flag: boolean;
    msg?: string; //校验说明
    email?: string; //已经发送的邮箱
  }
  /**
   * 注册的数据
   */
  const [registerData, setRegisterData] = useState<Partial<RegisterDto>>({});
  const [open, setOpen] = useState<boolean>(false);
  const [registerFlag, setRegisterFlag] = useState<registerFlag>({
    flag: true,
  });

  //检查注册信息
  useDebounceEffect(
    () => {
      setCount(0);
      const emailEmpty =
        registerData.email === "" || registerData.email === null;
      const pwdEmpty =
        registerData.password === "" || registerData.password === null;
      // const checkCodeEmpty =
      //   registerData.checkCode === undefined ||
      //   registerData.checkCode === "" ||
      //   registerData.checkCode === null;
      let f: registerFlag = { ...registerFlag };
      // 前端校验
      if (emailEmpty) {
        f = {
          flag: false,
          msg: "邮箱不能为空",
        };
      } else if (registerData.email && !RegExp.isEmail(registerData.email)) {
        f = { flag: false, msg: "邮箱格式错误" };
      } else if (pwdEmpty) {
        f = {
          flag: false,
          msg: "密码不能为空",
        };
      } else if (registerData.password && registerData.password.length < 6) {
        f = { flag: false, msg: "密码至少6位" };
      } else {
        f = { flag: true };
      }

      //前端校验通过，采用后端校验
      if (f.flag === true) {
        checkEmail(registerData.email || "").then((rs: Result<number>) => {
          //邮箱验证
          if (rs.data && rs.data > 0) {
            f = { ...registerFlag, flag: false, msg: "账号邮箱已经注册" };
          } else {
            f = { ...registerFlag, flag: true, msg: undefined };
          }

          if (registerData.password === undefined) {
            f = { ...f, flag: false };
          }
          //密码验证
          setRegisterFlag(f);
        });
      } else {
        if (
          registerData.email === undefined &&
          registerData.password === undefined
        ) {
          f = { ...f, flag: false };
        }
        setRegisterFlag(f);
      }
    },
    [registerData],
    {
      wait: 200,
    }
  );

  // const gitSubmit = async () => {
  //   await login(values);
  // };

  const [urlParam, setUrlParam] = useUrlQueryParam(["code", "from"]);
  //当前场景
  const [part, setPart] = useState<"login" | "register" | "qr">("login");
  const gitLogin = () => {
    giteeUrl().then((d) => {
      if (d.data) {
        window.location.href = d.data;
      } else {
        alert("服务端没有启用gitee快捷登录");
      }
    });
  };

  // const openRegCode = useCallback((): boolean => {
  //   const abc = async (): => {
  //     await openCheckCode();
  //   };

  // }, []);

  useEffect(() => {
    if (urlParam.code !== undefined) {
      if (urlParam.from === "gitee") {
        giteeLogin(urlParam.code).then(
          (account: ThirdAccountDto | undefined) => {}
        );
      }
    }
    openCheckCode().then((d: any) => {
      setOpen(d.data);
    });
  }, [urlParam]);

  const register = useCallback(() => {
    if (
      registerFlag.flag === true &&
      ((registerData.checkCode && open) || open === false) &&
      registerData.email &&
      registerData.password
    ) {
      serverReg({
        password: registerData.password,
        checkCode: registerData.checkCode || "",
        email: registerData.email,
      }).then((res) => {
        if (res.data === "" || res.data === null || res.data === undefined) {
          setPart("login");
          Modal.success({
            title: "注册成功",
            content: "请登录",
          });
          setFieldValue("username", registerData.email || "");
          setFieldValue("password", "");
        } else {
          Modal.warning({
            title: "注册结果",
            content: res.data,
          });
        }
      });
    }
  }, [registerData, registerFlag, open]);

  return (
    <div
      className=" bg-fixed bg-cover bg-center  w-full
      flex items-center h-screen
      "
      style={{
        // backgroundColor: `#00c1c1`,
        backgroundImage: `url(https://pic.vjshi.com/2021-07-06/a24be5a62c1c0548b337002b4c470de6/online/781254de5963f0ce56f4957fe17df40f.jpg?x-oss-process=style/resize_w_720) `,
      }}
    >
      {/* <div className=" absolute  left-36 top-1/4 ">
        <h1 className=" text-6xl font-bold text-white text-center">
          vlife低代码研发平台
        </h1>
      </div> */}

      {/* <div className="relative flex left-1/3 w-4/12  h-px-96  bg-white     rounded-3xl shadow-3xl">
        <div
          id="side-slide-box"
          className=" w-1/3 bg-slate-200 m-0 h-full rounded-l-3xl"
        >
         带介绍的登录框
        </div>
        <div>22222222222222</div>
      </div> */}

      <div className="main-container login-wrapper ">
        <Empty
          className=" absolute top-3  mr-4"
          image={<img src={logo} style={{ width: 280, height: 60, top: 10 }} />}
        ></Empty>
        <div>
          <section className="flex justify-between">
            <div
              style={{
                fontSize: "22px",
                color: "#262626",
                fontWeight: 500,
                lineHeight: "32px",
              }}
            >
              密码登录
            </div>

            {/* <p className="text-gray-600 pt-2">管理员：manage/123456</p>
          <p className="text-gray-600 pt-2">普通用户：admin/123456</p> */}
          </section>
          <section className="mt-5">
            <div className="flex flex-col">
              <p className="text-red-500 pt-2 text-center ">{error}</p>
              <div className="mb-1 pt-2 rounded">
                {/* <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="email"
              >
                账号
              </label> */}
                <input
                  type="text"
                  placeholder="账号"
                  id="username"
                  value={values.username || ""}
                  onChange={(evt) =>
                    setFieldValue("username", evt.target.value)
                  }
                  className=" h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                />
              </div>
              <div className="mb-2 pt-3 rounded ">
                {/* <label
                className="block text-gray-700 text-sm font-bold mb-2 ml-3"
                htmlFor="password"
              >
                密码
              </label> */}
                <input
                  type="password"
                  id="password"
                  placeholder="密码"
                  value={values.password || ""}
                  onChange={(evt) =>
                    setFieldValue("password", evt.target.value)
                  }
                  className="h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                />

                {/* <span className=" absolute right-8">
                  <IconEyeOpened size="large" />
                </span> */}
              </div>
              <div className="mb-12 relative">
                <div
                  onClick={gitLogin}
                  className=" absolute cursor-pointer right-0  text-base  text-blue-700 hover:text-blue-500 hover:underline"
                >
                  {/* Gitee快捷登录 */}
                </div>
              </div>
              <button
                className=" bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                onClick={handelSubmit}
              >
                登 录
              </button>
            </div>
          </section>
          <div
            id="thirdLogin"
            className=" text-zinc-400 text-sm mt-4  text-center"
          >
            {/* <div className="mb-2">— 更多登录方式 —</div>
            <ul className="flex w-full h-10 justify-evenly">
              <li className="cursor-pointer" onClick={gitLogin}>
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="7764"
                  width="32"
                  height="32"
                >
                  <path
                    d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z"
                    fill="#C71D23"
                    p-id="7765"
                  ></path>
                </svg>
              </li>
            </ul> */}
          </div>
        </div>

        {part === "register" ? (
          <div className=" absolute top-0 left-0 p-8 pt-16 rounded-lg h-full w-full bg-white">
            <section className="flex justify-between">
              <div
                style={{
                  fontSize: "22px",
                  color: "#262626",
                  fontWeight: 500,
                  lineHeight: "32px",
                }}
              >
                账号注册
              </div>
              <div onClick={() => setPart("login")}>
                <a className=" cursor-pointer text-sm text-blue-400 hover:text-blue-500 hover:underline mb-6">
                  密码登录
                </a>
              </div>
            </section>
            <section className="mt-5">
              <div className="flex flex-col">
                <p className="text-red-500 pt-2 text-center h-6 ">
                  {/* {JSON.stringify(registerFlag)} */}
                  {registerFlag.msg}
                </p>
                <div className="mb-1 pt-2 rounded">
                  <input
                    type="text"
                    placeholder="邮箱"
                    id="username"
                    value={registerData.email}
                    onChange={(evt) => {
                      setRegisterData({
                        ...registerData,
                        email: evt.target.value,
                      });
                      setRegisterFlag({ ...registerFlag, email: undefined });
                    }}
                    className=" h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                  />
                </div>
                <div className="mb-1 pt-2 rounded">
                  <input
                    type="password"
                    id="password"
                    placeholder="密码"
                    value={registerData.password}
                    onChange={(evt) =>
                      setRegisterData({
                        ...registerData,
                        password: evt.target.value,
                      })
                    }
                    className="h-12 text-xl  rounded w-full text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                  />
                  {/* <span className=" absolute right-8">
                    <IconEyeOpened size="large" />
                  </span> */}
                </div>

                {open && (
                  <div className="mb-6 pt-2 rounded flex">
                    <input
                      type="text"
                      placeholder="邮箱验证码"
                      id="code"
                      value={registerData.checkCode}
                      onChange={(evt) => {
                        setRegisterData({
                          ...registerData,
                          checkCode: evt.target.value,
                        });
                      }}
                      className=" h-12 text-xl  rounded w-1/2 text-gray-700 focus:outline-none border-b border-gray-300 focus:border-blue-400 transition duration-500 px-3 pb-3"
                    />
                    <button
                      className={`p-4 absolute right-20 ${
                        registerFlag.flag === true &&
                        count === 0 &&
                        registerFlag.email !== "ing"
                          ? // && registerFlag.email === undefined
                            "bg-blue-400 hover:bg-blue-500"
                          : " bg-slate-400"
                      }   text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200`}
                      onClick={() => {
                        if (
                          registerData.email &&
                          registerFlag.flag === true &&
                          registerFlag.email !== "ing" &&
                          count === 0
                        ) {
                          sendEmail(registerData.email).then((d) => {
                            if (
                              d.data === "" ||
                              d.data === null ||
                              d.data === undefined
                            ) {
                              setRegisterFlag({
                                //发送成功
                                ...registerFlag,
                                email: registerData.email || "",
                              });
                              Notification.success({
                                content: `发送成功,请登录邮箱查看验证码`,
                              });
                              setCount(second); //倒计时
                            } else {
                              //发送失败
                              setRegisterFlag({ ...registerFlag, msg: d.data });
                            }
                          });

                          setRegisterFlag({
                            //发送中
                            ...registerFlag,
                            email: "ing",
                          });
                        }
                      }}
                    >
                      {registerFlag.email && registerFlag.email === "ing" && (
                        <>
                          发送中
                          <Spin size="small" />
                        </>
                      )}

                      {registerFlag.email &&
                        registerFlag.email !== "ing" &&
                        count > 0 &&
                        `重新发送${count}`}

                      {((count === 0 &&
                        registerFlag.email &&
                        registerFlag.email !== "ing") ||
                        registerFlag.email === undefined) &&
                        `发送邮件`}
                    </button>
                  </div>
                )}
                {/* {JSON.stringify(registerFlag)} */}
                <button
                  className={` ${
                    registerFlag.flag === true &&
                    ((registerData.checkCode?.length === 4 &&
                      open === true &&
                      registerFlag.email) ||
                      open === false)
                      ? "bg-blue-400 hover:bg-blue-500"
                      : "bg-slate-400"
                  } text-white font-bold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200`}
                  onClick={register}
                >
                  注册
                </button>
              </div>
            </section>
          </div>
        ) : part === "qr" ? (
          <div className=" absolute top-0 left-0 p-8 rounded-lg h-full w-full bg-white">
            qr
          </div>
        ) : (
          <></>
        )}
        <div
          onMouseOver={() => {
            // setPart("qr");
          }}
          onMouseOut={() => {
            // setPart("login");
          }}
          className="absolute  cursor-pointer text-center w-full py-4 h-16 bottom-0 left-0  bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://static001.geekbang.org/resource/image/da/a9/da2f9b538e487ec57fecc41a5c88c9a9.png)",
            // color: "#fa8919",
            cursor: "pointer",
          }}
        >
          <a href="http://qm.qq.com/cgi-bin/qm/qr?k=786134846" target="_blank">
            技术支持
          </a>
        </div>
      </div>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-white"></p>
      </div>

      <div className="max-w-lg mx-auto flex justify-center text-white">
        {/* <a href="#" className="hover:underline">联系我们</a>
        <span className="mx-3">•</span> */}
        {/* <a href="#" className="hover:underline">
          鄂ICP备2022008507号
        </a> */}
      </div>
    </div>
  );
};

export default Index;
