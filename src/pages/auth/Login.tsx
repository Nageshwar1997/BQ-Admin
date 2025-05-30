import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginZodSchema } from "./validations";
import { loginInputMapData, LoginTextContent } from "./data";
import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { LoginFormInputProps, LoginTypes } from "../../types";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import AuthRobot from "./components/AuthRobot";
import TextDisplay from "../../components/TextDisplay";
import { EyeIcon, EyeOffIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { saveUserLocal, saveUserSession } from "../../utils";
import { useLoginUser } from "../../api/auth/auth.service";
import LoadingPage from "../../components/ui/loaders/LoadingPage";
import DarkMode from "../../components/DarkMode";
import Checkbox from "../../components/ui/input/Checkbox";
import Input from "../../components/ui/input/Input";
import PhoneInput from "../../components/ui/input/PhoneInput";
import Radio from "../../components/ui/input/Radio";

const Login = () => {
  const [showGradient, containerRef] = useVerticalScrollable();
  const [loginMethod, setLoginMethod] = useState<LoginTypes>("email");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userLoginMutation = useLoginUser();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
  } = useForm<z.infer<typeof loginZodSchema>>({
    resolver: zodResolver(loginZodSchema),
    defaultValues: {
      loginMethod: loginMethod,
      email: "",
      phoneNumber: "",
      password: "",
      remember: false, // ✅ Default value set to false
    },
  });

  const selectedMethod = watch("loginMethod");

  const handleLoginMethodChange = (method: LoginTypes) => {
    setLoginMethod(method);
    reset({
      loginMethod: method,
      email: method === "email" ? "" : undefined,
      phoneNumber: method === "phoneNumber" ? "" : undefined,
      password: "",
      remember: false,
    });
  };

  const onSubmit = (bodyData: LoginFormInputProps) => {
    const formData: Partial<LoginFormInputProps> = {};

    if (bodyData.loginMethod === "email" && bodyData.email) {
      formData.email = bodyData.email;
    } else if (bodyData.loginMethod === "phoneNumber" && bodyData.phoneNumber) {
      formData.phoneNumber = bodyData.phoneNumber;
    }

    formData.password = bodyData.password;

    userLoginMutation.mutate(formData, {
      onSettled(data, error) {
        if (data && !error) {
          if (bodyData.remember) {
            saveUserLocal(data?.token);
          } else {
            saveUserSession(data?.token);
          }
          navigate("/");
        }
        if (error) {
          console.error("Error from mutation:", error);
        }
      },
    });
  };

  return (
    <div className="w-full min-h-dvh max-h-dvh h-full p-4 flex gap-4 overflow-hidden relative">
      {userLoginMutation.isPending && <LoadingPage text="Please wait" />}
      <AuthRobot />
      <DarkMode className="border absolute top-5 right-5 h-fit p-2 md:p-3 rounded-full bg-secondary-inverted [&_path]:!stroke-secondary z-10" />
      <div
        ref={containerRef}
        className={`w-full lg:w-1/2 flex flex-col items-center gap-4 overflow-hidden overflow-y-scroll ${
          !showGradient.bottom && !showGradient.top
            ? "justify-center"
            : "justify-start"
        }`}
      >
        {showGradient.top && <TopGradient />}
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full flex flex-col gap-4"
        >
          <TextDisplay
            content={LoginTextContent}
            contentClassName="mb-3 font-semibold"
          />
          <div className="w-full max-w-[400px] lg:max-w-[500px] sm:w-[90%] lg:w-[500px] border-gradient p-px rounded-3xl overflow-hidden mx-auto">
            <div className="shadow-light-dark-soft bg-platinum-black p-6 md:px-8 rounded-3xl space-y-6">
              <Controller
                name="loginMethod"
                control={control}
                render={({ field }) => (
                  <Radio
                    value={field.value}
                    onChange={(value) => {
                      handleLoginMethodChange(value as LoginTypes);
                      field.onChange(value);
                    }}
                    options={[
                      { label: "Email", value: "email" },
                      { label: "Phone", value: "phoneNumber" },
                    ]}
                  />
                )}
              />
              <div className="flex flex-col gap-5 lg:gap-6">
                {loginInputMapData?.map((item, index) => {
                  if (
                    item.name === "phoneNumber" &&
                    selectedMethod !== "phoneNumber"
                  ) {
                    return null;
                  }

                  if (item.name === "email" && selectedMethod !== "email") {
                    return null;
                  }
                  return (
                    <div key={index}>
                      {item.name === "phoneNumber" ? (
                        <PhoneInput
                          label={item.label}
                          register={register(item.name)}
                          name={item.name}
                          type={item.type}
                          placeholder={item.placeholder}
                          errorText={errors?.[item.name]?.message}
                        />
                      ) : (
                        <Input
                          label={item.label}
                          register={register(item.name)}
                          name={item.name}
                          placeholder={item.placeholder}
                          errorText={errors?.[item.name]?.message}
                          type={
                            item.name === "password"
                              ? showPassword
                                ? "text"
                                : item.type
                              : item.type
                          }
                          icon={
                            item.name === "password" &&
                            (showPassword ? (
                              <EyeOffIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ) : (
                              <EyeIcon className="!fill-primary opacity-50 hover:opacity-100 h-full" />
                            ))
                          }
                          iconClick={
                            item.name === "password"
                              ? () => setShowPassword((prev) => !prev)
                              : undefined
                          }
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center space-x-3">
                    <Controller
                      name="remember"
                      control={control}
                      render={({ field }) => <Checkbox register={field} />}
                    />
                    <span className="text-[13px] md:text-sm text-primary-50 font-medium whitespace-nowrap">
                      Remember
                    </span>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className={`bg-clip-text text-transparent bg-accent-duo text-[13px] md:text-sm mr-2 hover:underline whitespace-nowrap`}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  pattern="primary"
                  type="submit"
                  content="Login"
                  className="!text-base"
                />
              </div>
            </div>
          </div>
        </form>
        {showGradient.bottom && <BottomGradient />}
      </div>
    </div>
  );
};

export default Login;
