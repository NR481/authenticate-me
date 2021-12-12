const express = require('express');
const asyncHandler = require('express-async-handler');
const { Wine, Winery, Checkin, User } = require('../../db/models');

const router = express.Router();


router.get('/', asyncHandler(async (_req, res) => {
  const wines = await Wine.findAll();
  const wineries = await Winery.findAll();

  return res.json({ wines, wineries });
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const wine = await Wine.findByPk(id);
  const checkins = await Checkin.findAll({
    where: { wineId: id}
  });
  const users = await User.findAll();
  return res.json({ wine, checkins, users });
}));

router.delete('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const wine = await Wine.findByPk(id);

  if (wine) {
    await wine.destroy();
  }
  return res.json({});
}));

router.put('/:id(\\d+)', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    editName,
    editImage,
    editVintage,
    editVarietal,
    editWinery,
    editDescription,
    editLocation
  } = req.body;

  const wine = await Wine.findByPk(id);
  const winery = await Winery.findOne({
    where: {
      name: editWinery
    }
  });

  if (winery) {
    await wine.update({
      name: editName,
      image: editImage,
      vintage: editVintage,
      description: editDescription,
      varietal: editVarietal,
      wineryId: winery.id
    });
    await winery.update({
      name: editWinery,
      location: editLocation
    });
    if (wine && winery){
      await wine.save();
      await winery.save();
    }
    return res.json({ wine, winery });
  } else {
    await winery.create({
      name: editWinery,
      location: editLocation
    });
    await wine.update({
      name: editName,
      image: editImage,
      vintage: editVintage,
      description: editDescription,
      varietal: editVarietal,
      wineryId: winery.id
    });
    if (wine){
      wine.save();
    }
    return res.json({ wine, winery });
  }
}));

router.post('/', asyncHandler(async (req, res) => {
  const {
    name,
    image,
    vintage,
    varietal,
    winery,
    location,
    description,
    userId
  } = req.body;

  const validateWinery = await Winery.findOne({
    where: {
      name: winery
    }
  });

  if (validateWinery) {
    const wine = await Wine.create({
      name,
      image,
      vintage,
      description,
      varietal,
      wineryId: validateWinery.id,
      userId
    });
    return res.json({ wine, winery: validateWinery })

  } else {
    const newWinery = await Winery.create({
      name: winery,
      location
    });
    if (newWinery) {
      const wine = await Wine.create({
        name,
        image,
        vintage,
        description,
        varietal,
        wineryId: newWinery.id,
        userId
      });

      return res.json({ wine, winery: newWinery });
    }

  }
}));

module.exports = router;
