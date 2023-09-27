import {
  Form,
  Input,
  Radio,
  DatePicker,
  TimePicker,
  Button,
  Col,
  Row,
  message,
  InputNumber,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function AddPromotionForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log(values);
      const formData = new FormData();

      for (const key in values) {
        formData.append(key, values[key]);
      }
      const formattedExpiryDate = moment(values.promotion_expiry_date).format(
        "YYYY-MM-DD"
      );
      const formattedExpiryTime = moment(values.promotion_expiry_time).format(
        "HH:mm"
      );

      formData.append("promotion_expiry_date", formattedExpiryDate);
      formData.append("promotion_expiry_time", formattedExpiryTime);

      const response = await axios.post(
        "http://localhost:4000/promotion",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        message.success("สร้างโปรโมชั่นโค้ดใหม่สำเร็จ");
      }
      navigate("/admin-promotion");
    } catch (error) {
      console.error("Error creating promotion:", error);
    }
  };

  const labelStyle = {
    marginTop: "10px",
    color: "var(--gray-900, #323640)",
    fontFamily: "Prompt",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "150%", // 24px
  };

  return (
    <Form
      labelCol={{ span: 100 }}
      wrapperCol={{ span: 24 }}
      layout="horizontal"
      name="promotion_form"
      initialValues={{
        promotion_expiry_date: moment(),
        promotion_expiry_time: moment(),
      }}
      onFinish={onFinish}
      requiredMark={false}
    >
      <div className="bg-grey100 h-full pb-4% md:pb-0 md:pl-60">
        <div className="flex items-center h-20 px-10 justify-between border-b border-grey300 bg-white">
          <h1 className="text-xl font-medium">เพิ่ม Promotion Code</h1>
          <div className="flex">
            <button
              className="btn-secondary flex items-center justify-center text-base font-medium w-28 h-11"
              onClick={() => navigate("/admin-promotion")}
            >
              ยกเลิก
            </button>
            <button
              className="btn-primary flex items-center justify-center ml-6 text-base font-medium w-28 h-11"
              type="submit"
            >
              สร้าง
            </button>
          </div>
        </div>
        <div className="bg-white mx-10 mt-10 p-6 border border-grey200 rounded-lg">
          <Form.Item
            label={<span style={labelStyle}>Promotion Code</span>}
            colon={false}
            name="promotion_code"
            rules={[
              {
                required: true,
                message: "กรุณาระบุโค้ด",
              },
            ]}
          >
            <Input style={{ width: "50%" }} />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>ประเภท</span>}
            colon={false}
            name="promotion_types"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกประเภทของโค้ด",
              },
            ]}
          >
            <Radio.Group>
              <div 
              className="flex flex-row">
                <Form.Item
                  name="promotion_types"
                  valuePropName="checked"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Radio value="fixed">Fixed</Radio>
                </Form.Item>

                <Form.Item
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.promotion_types !== currentValues.promotion_types
                  }
                  noStyle
                >
                  {({ getFieldValue }) => {
                    return getFieldValue("promotion_types") === "fixed" ? (
                      <Form.Item
                        colon={false}
                        name="promotion_discount"
                        rules={[
                          {
                            validator: (rule, value) => {
                              const numericValue = parseFloat(value);
                              if (
                                isNaN(numericValue) ||
                                numericValue < 1 ||
                                numericValue > 1000
                              ) {
                                return Promise.reject(
                                  "Please enter a number between 1 and 1000"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input style={{ width: "50%" }} 
                        suffix="฿"
                        disabled={getFieldValue("promotion_types") !== "fixed"}/>
                      </Form.Item>
                    ) : null;
                  }}
                </Form.Item>
              </div>

              <div  className="flex flex-row">
                <Form.Item
                  name="promotion_types"
                  valuePropName="checked"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Radio value="percent">Percent</Radio>
                </Form.Item>

                <Form.Item
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.promotion_types !== currentValues.promotion_types
                  }
                  noStyle
                >
                  {({ getFieldValue }) => {
                    return getFieldValue("promotion_types") === "percent" ? (
                      <Form.Item
                        colon={false}
                        name="promotion_discount"
                        rules={[
                          {
                            validator: (rule, value) => {
                              const numericValue = parseFloat(value);
                              if (
                                isNaN(numericValue) ||
                                numericValue < 1 ||
                                numericValue > 100
                              ) {
                                return Promise.reject(
                                  "Please enter a number between 1 and 100"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input style={{ width: "50%" }}
                        suffix="%" 
                        disabled={getFieldValue("promotion_types") !== "percent"}/>
                      </Form.Item>
                    ) : null;
                  }}
                </Form.Item>
              </div>
            </Radio.Group>
          </Form.Item>

          {/* <Form.Item
            label={<span style={labelStyle}>ประเภท</span>}
            colon={false}
            name="promotion_types"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกประเภทของโค้ด",
              },
            ]}
          >
            <Radio.Group>
              <div style={{ marginBottom: "8px" }}>
                <Form.Item
                  name="promotion_types"
                  valuePropName="checked"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Radio value="fixed">Fixed</Radio>
                </Form.Item>

                <Form.Item
                  colon={false}
                  name="promotion_discount"
                  rules={[
                    {
                      validator: (rule, value) => {
                        const numericValue = parseFloat(value);
                        if (
                          isNaN(numericValue) ||
                          numericValue < 1 ||
                          numericValue > 1000
                        ) {
                          return Promise.reject(
                            "Please enter a number between 1 and 1000"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ width: "50%" }}
                  
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="promotion_types"
                  valuePropName="checked"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Radio value="percent">Percent</Radio>
                </Form.Item>

                <Form.Item
                  colon={false}
                  name="promotion_discount_percentage"
                  rules={[
                    {
                      validator: (rule, value) => {
                        const numericValue = parseFloat(value);
                        if (
                          isNaN(numericValue) ||
                          numericValue < 1 ||
                          numericValue > 100
                        ) {
                          return Promise.reject(
                            "Please enter a number between 1 and 100"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ width: "50%" }}
                   
                  />
                </Form.Item>
              </div>
            </Radio.Group>
          </Form.Item> */}

          <Form.Item
            label={<span style={labelStyle}>โควต้าการใช้</span>}
            colon={false}
            name="promotion_quota"
            rules={[
              {
                required: true,
                min: 1,
                message: "กรุณาระบุจำนวนครั้งให้ถูกต้อง",
              },
              {
                validator: (rule, value) => {
                  const numericValue = parseFloat(value);
                  if (
                    isNaN(numericValue) ||
                    numericValue < 1 ||
                    numericValue > 1000
                  ) {
                    return Promise.reject("กรุณาระบุจำนวนครั้งต่ำกว่า 1000");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input style={{ width: "50%" }} 
            suffix="ครั้ง"/>
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>วันหมดอายุ</span>}
            colon={false}
            // name="promotion_expiry"
            rules={[
              {
                message: "กรุณาระบุวัน-เวลา หมดอายุ",
              },
            ]}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="promotion_expiry_date"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาระบุวัน",
                    },
                  ]}
                  noStyle
                >
                  <DatePicker style={{ width: "50%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="promotion_expiry_time"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาระบุเวลา",
                    },
                  ]}
                  noStyle
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}

export default AddPromotionForm;
