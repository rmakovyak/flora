import React, { useState } from 'react';
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
  Alert,
  Input,
  Switch,
  Form,
} from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import TextLoop from 'react-text-loop';

import {
  deletePlant,
  createPlantWatering,
  deleteWatering,
  deleteLocation,
  createLocation,
} from 'api/plants';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [actionSwitch, setActionSwitch] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleActionSwitch = (isOn) => {
    setActionSwitch(isOn);
  };

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

  const handleCreateLocation = async (id, location) => {
    try {
      await createLocation(id, location);
      mutate(PLANTS_URL);
      mutate(LOCATIONS_URL);
      message.success(`I've added new location!`);
    } catch {
      message.error(`I've failed to create new location`);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      confirm({
        title: 'Delete this entry?',
        icon: <QuestionCircleOutlined />,
        onOk: async () => {
          await deleteLocation(id);
          mutate(PLANTS_URL);
          mutate(LOCATIONS_URL);
          message.success(`I've deleted location entry!`);
        },
      });
    } catch {
      message.error(`I've failed to delete location entry`);
    }
  };

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

  const displayedPlants = plants.filter((plant) => {
    const nameFilter = plant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const actionFilter = actionSwitch
      ? alerts.find(({ id }) => id === plant.id)
      : true;

    return nameFilter && actionFilter;
  });

  return (
    <>
      {alerts.length && (
        <Alert
          style={{ marginBottom: '16px' }}
          banner
          message={
            <div>
              {alerts.length} plant(s) need some water:{' '}
              <p>
                <TextLoop mask>
                  {alerts.map((alert) => (
                    <div>
                      <b>{alert.name}</b>{' '}
                    </div>
                  ))}
                </TextLoop>
              </p>
            </div>
          }
        />
      )}
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <Link to="/add-plant">
          <PlusCircleOutlined /> Add new plant
        </Link>
      </div>

      <Form layout="vertical">
        <Form.Item label="Name">
          <Input onChange={handleSearch} />
        </Form.Item>
        <Form.Item label="Show watering only">
          <Switch onChange={handleActionSwitch} />
        </Form.Item>
      </Form>

      <Space space={24} direction="vertical" style={{ width: '100%' }}>
        {displayedPlants.map((data) => (
          <PlantCard
            key={data.id}
            plant={data}
            onDelete={handleDelete}
            onCreateWatering={handleCreateWatering}
            onCreateLocation={handleCreateLocation}
            onDeleteWatering={handleDeleteWatering}
            onDeleteLocation={handleDeleteLocation}
            waterings={
              waterings?.filter(({ plantId }) => plantId === data.id) || []
            }
            locations={
              locations?.filter(({ plantId }) => plantId === data.id) || []
            }
            hasWateringAlert={Boolean(alerts.find(({ id }) => id === data.id))}
          />
        ))}
      </Space>
    </>
  );
}
