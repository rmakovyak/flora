import React from 'react';
import { Card, Avatar, Timeline, Collapse, Statistic, Row, Col } from 'antd';
import { DateTime } from 'luxon';
import {
  ExperimentOutlined,
  EditOutlined,
  DeleteOutlined,
  AlertTwoTone,
} from '@ant-design/icons';

export default function PlantCard({
  plant,
  onCreateWatering,
  onDelete,
  onDeleteWatering,
  waterings,
  hasWateringAlert,
}) {
  const lastWatering = waterings[0];
  const lastWateringDate = DateTime.fromISO(lastWatering?.creationDate);

  const nextWateringDate = lastWateringDate.plus({
    days: plant.wateringTimeframe,
  });

  return (
    <Card
      actions={[
        <ExperimentOutlined onClick={() => onCreateWatering(plant)} />,
        <EditOutlined key="edit" />,
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
            <p>Location: {plant.location}</p>
          </>
        }
      />

      <Collapse defaultActiveKey={['1']} ghost>
        <Collapse.Panel header="Schedule" key="2">
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

        <Collapse.Panel header=" History" key="3">
          <Timeline>
            {waterings.map(({ creationDate, id }) => (
              <Timeline.Item>
                {DateTime.fromISO(creationDate).toLocaleString()}{' '}
                <DeleteOutlined onClick={() => onDeleteWatering(id)} />
              </Timeline.Item>
            ))}
          </Timeline>
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
}
