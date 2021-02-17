import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Space,
  Card,
  Avatar,
  Breadcrumb,
  Skeleton,
  Modal,
  message,
} from 'antd';
import {
  HomeOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  getPlants,
  deletePlant,
  createPlantWatering,
  getPlantWaterings,
} from 'api/plants';
import PlantCard from './PlantCard';

const { confirm } = Modal;

export default function MyList() {
  const [plants, setPlants] = useState([]);
  const [waterings, setWaterings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const plantsResponse = await getPlants();
      const wateringResponse = await getPlantWaterings();
      setPlants(plantsResponse.data);
      setWaterings(wateringResponse.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (plant) => {
    try {
      confirm({
        title: 'Do you want to delete this plant?',
        icon: <ExclamationCircleOutlined />,
        content: 'All data will be permanently lost',
        onOk: async () => {
          await deletePlant(plant.id);
          const response = await getPlants();
          setPlants(response.data);
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
          const response = await getPlantWaterings();
          setWaterings(response.data);
          message.success(`I've marked that ${plant.name} was watered!`);
        },
      });
    } catch {
      message.error(`I've failed to marked watering for  ${plant.name}`);
    }
  };

  return (
    <Space space={24} direction="vertical" style={{ width: '100%' }}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <HomeOutlined />
          <Link to="/">
            <span>My plants</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ textAlign: 'right' }}>
        <Link to="/add-plant">Add new plant</Link>
      </div>
      {loading && (
        <Card>
          <Skeleton loading={loading} avatar active></Skeleton>
        </Card>
      )}
      {plants.length === 0 && !loading && <p>You have no plants!</p>}
      {plants.map((data) => (
        <PlantCard
          plant={data}
          onDelete={handleDelete}
          onCreateWatering={handleCreateWatering}
          waterings={
            waterings?.filter(({ plantId }) => plantId === data.id) || []
          }
        />
      ))}
    </Space>
  );
}
