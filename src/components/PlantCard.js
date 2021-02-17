import React from 'react';
import { Card, Avatar } from 'antd';
import { DateTime, Duration } from 'luxon';
import {
  ExperimentOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

export default function PlantCard({
  plant,
  onCreateWatering,
  onDelete,
  waterings,
}) {
  const lastWatering = waterings.slice(-1).pop();
  const lastWateringDate = new DateTime(lastWatering?.creationDate || 0);

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
            <p>Location: {plant.location}</p>
            <p>Watering schedule: Every {plant.wateringTimeframe} days</p>

            {lastWatering && (
              <>
                <p>Last watering: {lastWateringDate.toLocaleString()}</p>
                <p>Next watering: {nextWateringDate.toLocaleString()}</p>
              </>
            )}
          </>
        }
      />
    </Card>
  );
}
