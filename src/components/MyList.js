import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import useSWR, { mutate } from 'swr';
import {
  Space,
  Card,
  Empty,
  Skeleton,
  Modal,
  message,
  notification,
  Alert,
} from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import { deletePlant, createPlantWatering, deleteWatering } from 'api/plants';
import { API_URL } from 'config';

import PlantCard from './PlantCard';

const { confirm } = Modal;

const PLANTS_URL = `${API_URL}/plants`;
const WATERING_URL = `${API_URL}/watering`;
const LOCATIONS_URL = `${API_URL}/locations`;
const ALERTS_URL = `${API_URL}/alerts`;

export default function MyList() {
  const { data: plants, error: pError } = useSWR(PLANTS_URL);
  const { data: waterings, error: wError } = useSWR(WATERING_URL);
  const { data: alerts, error: aError } = useSWR(ALERTS_URL);
  const { data: locations, error: lError } = useSWR(LOCATIONS_URL);
  const loading = !plants || !waterings || !locations || !alerts;

  const handleDelete = async (plant) => {
    try {
      confirm({
        title: 'Do you want to delete this plant?',
        icon: <ExclamationCircleOutlined />,
        content: 'All data will be permanently lost',
        onOk: async () => {
          await deletePlant(plant.id);
          mutate(PLANTS_URL);
          message.success(`I've removed ${plant.name} from your list`);
        },
      });
    } catch {
      message.error(`I've failed to remove ${plant.name} from your list`);
    }
  };

  const handleCreateWatering = async (plant) => {
    try {
      confirm({
        title: 'Did you water this plant?',
        icon: <QuestionCircleOutlined />,
        onOk: async () => {
          await createPlantWatering(plant.id);
          mutate(WATERING_URL);
          mutate(PLANTS_URL);
          mutate(ALERTS_URL);
          message.success(`I've marked that ${plant.name} was watered!`);
        },
      });
    } catch {
      message.error(`I've failed to marked watering for  ${plant.name}`);
    }
  };

  const handleDeleteWatering = async (id) => {
    try {
      confirm({
        title: 'Delete this entry?',
        icon: <QuestionCircleOutlined />,
        onOk: async () => {
          await deleteWatering(id);
          mutate(WATERING_URL);
          mutate(PLANTS_URL);
          mutate(ALERTS_URL);
          message.success(`I've deleted watering entry!`);
        },
      });
    } catch {
      message.error(`I've failed to delete watering entry`);
    }
  };

  useEffect(() => {
    alerts?.forEach((alert) =>
      notification.open({
        message: 'Time to water your plant',
        description: `${alert.name} needs some water!`,
      }),
    );
  }, [alerts]);

  if (pError || wError || lError || aError) {
    return (
      <Alert
        message="Something went wrong. You'll have to talk to Roman 😒"
        type="error"
      />
    );
  }
  if (loading) {
    return (
      <Space space={24} direction="vertical" style={{ width: '100%' }}>
        <Card>
          <Skeleton loading={loading} avatar active />
        </Card>
        <Card>
          <Skeleton loading={loading} avatar active />
        </Card>
        <Card>
          <Skeleton loading={loading} avatar active />
        </Card>
      </Space>
    );
  }

  if (isEmpty(plants)) {
    return (
      <Empty description="You don't have any plants yet">
        <Link to="/add-plant">Add your first plant</Link>
      </Empty>
    );
  }

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <Link to="/add-plant">
          <PlusCircleOutlined /> Add new plant
        </Link>
      </div>
      <Space space={24} direction="vertical" style={{ width: '100%' }}>
        {plants.map((data) => (
          <PlantCard
            key={data.id}
            plant={data}
            onDelete={handleDelete}
            onCreateWatering={handleCreateWatering}
            onDeleteWatering={handleDeleteWatering}
            waterings={
              waterings?.filter(({ plantId }) => plantId === data.id) || []
            }
            hasWateringAlert={Boolean(alerts.find(({ id }) => id === data.id))}
          />
        ))}
      </Space>
    </>
  );
}
