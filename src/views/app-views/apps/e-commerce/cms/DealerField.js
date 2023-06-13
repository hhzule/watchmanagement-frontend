import React from "react";
import { Input, Row, Col, Card, Form, Select, Button } from "antd";

const DealerField = (props) => {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title="New Field">
            <Form.Item name="name" label="Field name">
              <Input placeholder="Field Name" />
            </Form.Item>
            <Button onClick={(e) => props.add(e, props.label)}>Add</Button>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={7}></Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card title="Fields">
            {props.renderList &&
              props.renderList.map((row, i) => {
                return (
                  <div key={i}>
                    <p className="d-flex flex-row justify-content-between">
                      {row} {""}
                      <Button
                        value={row}
                        id={row}
                        onClick={(e) => props.delete(row, props.label)}
                      >
                        X
                      </Button>
                    </p>
                  </div>
                );
              })}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DealerField;
