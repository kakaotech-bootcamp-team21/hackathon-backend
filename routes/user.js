const express = require('express');
const User = require('../models/user');

const router = express.Router();

// 사용자를 추가하거나 업데이트하는 엔드포인트
router.post('/insert', async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: 'ID and name are required' });
  }

  try {
    // ID로 사용자 검색 또는 새로운 사용자 추가
    let user = await User.findOneAndUpdate({ id }, { name }, { new: true, upsert: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ID로 사용자를 조회하는 엔드포인트
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 모든 사용자 목록을 조회하는 엔드포인트
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
