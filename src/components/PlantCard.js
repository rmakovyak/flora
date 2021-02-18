import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Timeline,
  Collapse,
  Statistic,
  Row,
  Col,
  Button,
  Space,
  Input,
  Form,
} from 'antd';
import { DateTime } from 'luxon';
import {
  ExperimentOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  AlertTwoTone,
} from '@ant-design/icons';
import sortByDate from 'helpers/sortByDate';

export default function PlantCard({
  plant,
  onCreateWatering,
  onCreateLocation,
  onDelete,
  onDeleteWatering,
  onDeleteLocation,
  waterings,
  locations,
  hasWateringAlert,
}) {
  const [form] = Form.useForm();
  const lastWatering = waterings[0];
  const sortedLocations = sortByDate(locations);
  const lastLocation = [...sortedLocations].pop();
  const lastWateringDate = DateTime.fromISO(lastWatering?.creationDate);

  const nextWateringDate = lastWateringDate.plus({
    days: plant.wateringTimeframe,
  });

  return (
    <Card
      actions={[
        <ExperimentOutlined
          key="water"
          onClick={() => onCreateWatering(plant)}
        />,
        <DeleteOutlined key="delete" onClick={() => onDelete(plant)} />,
      ]}
    >
      <Card.Meta
        avatar={<Avatar size={56} src={plant.meta.image_url} />}
        title={plant.name}
        description={
          <>
            {hasWateringAlert && (
              <p style={{ color: 'red' }}>
                <AlertTwoTone twoToneColor="red" /> Needs water!
              </p>
            )}
            <p>Location: {lastLocation?.title}</p>
          </>
        }
      />

      <Collapse defaultActiveKey={['1']} ghost>
        <Collapse.Panel header="Watering schedule" key="2">
          <Row gutter={16}>
            <Col span={24}>
              <Statistic
                title="Watering schedule"
                value={`${plant.wateringTimeframe} days`}
              />
            </Col>
            {lastWatering && (
              <>
                <Col span={24}>
                  <Statistic
                    title="Last watering"
                    value={lastWateringDate.toLocaleString()}
                  />
                </Col>
                <Col span={24}>
                  <Statistic.Countdown
                    title="Next watering"
                    value={nextWateringDate}
                  />
                </Col>
              </>
            )}
          </Row>
        </Collapse.Panel>

        <Collapse.Panel header="Watering history" key="3">
          <Timeline>
            {waterings.map(({ creationDate, id }) => (
              <Timeline.Item>
                {DateTime.fromISO(creationDate).toLocaleString()}{' '}
                <DeleteOutlined onClick={() => onDeleteWatering(id)} />
              </Timeline.Item>
            ))}
          </Timeline>
        </Collapse.Panel>
        <Collapse.Panel header="Location history" key="4">
          <Timeline>
            {sortedLocations.map(({ creationDate, title, id }) => (
              <Timeline.Item>
                {title} {DateTime.fromISO(creationDate).toLocaleString()}{' '}
                <DeleteOutlined onClick={() => onDeleteLocation(id)} />
              </Timeline.Item>
            ))}
            <Space>
              <Form
                layout="horizontal"
                form={form}
                onFinish={(values) => {
                  onCreateLocation(plant.id, values.location);
                  // setLocationForm(false);
                }}
              >
                <Form.Item
                  name="location"
                  rules={[
                    { required: true, message: 'Please input location!' },
                  ]}
                >
                  <Input placeholder="Next location..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    <EnvironmentOutlined />
                    Add location
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Timeline>
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
}
