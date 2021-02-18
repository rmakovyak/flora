const { isEmpty } = require('lodash');
const { DateTime } = require('luxon');

module.exports = (plants, waterings) => {
  const alerts = [];

  plants.forEach((plant) => {
    const plantWaterings =
      waterings.filter(({ plantId }) => plantId === plant.id) || [];

    const lastWatering = plantWaterings[0];

    if (!lastWatering) {
      alerts.push(plant);
      return;
    }

    const lastWateringDate = new DateTime(lastWatering.creationDate);

    const nextWateringDate = lastWateringDate.plus({
      days: plant.wateringTimeframe,
    });
    const todayDate = DateTime.now();

    if (nextWateringDate < todayDate.startOf('day')) {
      alerts.push(plant);
    }
  });

  return alerts;
};
