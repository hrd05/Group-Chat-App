const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Op } = require("sequelize");

const Group = require("../models/group");

exports.getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "login.html"));
};

exports.postUser = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phoneNo = req.body.phoneNo;
  const password = req.body.password;
  // console.log(name,email);

  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      return res.status(409).end();
    } else {
      return;
    }
  });
  bcrypt.hash(password, 10, (err, hash) => {
    console.log(err);
    User.create({ name, email, phoneNo, password: hash, isActive: false })
      .then(() => {
        res.status(201).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "something went wrong" });
      });
  });
};

function generateAcessToken(id, name) {
  return jwt.sign({ userId: id, userName: name }, process.env.JWT_SECRET_KEY);
}

exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    const result = await bcrypt.compare(password, user.password);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }

    if (result) {
      await user.update({ isActive: true });
      res
        .status(201)
        .json({
          message: "login successfull",
          token: generateAcessToken(user.id, user.name),
        });
    } else {
      res.status(401).json({ message: "incorrect password" });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong" });
  }
};

exports.getUsers = async (req, res) => {
  const token = req.header("Authorization");
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

  try {
    const users = await User.findAll({
      where: {
        id: {
          [Op.not]: user.userId,
        },
      },
    });
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("something went wrong");
  }
};

exports.createGroup = async (req, res) => {
  const { groupName, groupMembersid, membersNo } = req.body.data;

  const user = req.user;

  try {
    const createdGroup = await Group.create({
      name: groupName,
      memberNo: membersNo,
      adminId: user.id,
    });

    groupMembersid.push(user.id);

    const groupMembers = await User.findAll({
      where: {
        id: groupMembersid,
      },
    });

    await createdGroup.addUsers(groupMembers);

    res
      .status(201)
      .json({ group: createdGroup, message: "group created successfully" });
  } catch (err) {
    res.status(501).json("something went wrong");
    console.log(err);
  }
};

exports.updateGroup = async (req, res) => {
  const groupId = req.query.groupId;
  const user = req.user;
  const { groupName, groupMembersid, membersNo } = req.body.data;

  try {
    const group = await Group.findOne({ where: { id: groupId } });
    const updatedGroup = await group.update({
      name: groupName,
      memberNo: membersNo,
      adminId: user.id,
    });

    groupMembersid.push(user.id);

    const groupMembers = await User.findAll({
      where: {
        id: groupMembersid,
      },
    });

    await updatedGroup.addUsers(groupMembers);
    res
      .status(201)
      .json({ group: updatedGroup, message: "group updated successfully" });
  } catch (err) {
    res.status(501);
    console.log(err);
  }
};

exports.getGroups = async (req, res) => {
  const user = req.user;

  try {
    const userGroups = await user.getGroups();
    res.status(201).json(userGroups);
  } catch (err) {
    console.log(err);
  }
};

exports.getGroupDetail = async (req, res) => {
  const user = req.user;
  const groupid = req.query.groupid;
  console.log("group-detail", groupid);

  try {
    const group = await Group.findOne({ where: { id: groupid } });
    res.status(201).json({ group, user });
  } catch (err) {
    console.log(err);
    res.status(500).json("Somethinf Went Wrong");
  }
};

exports.getGroupMember = async (req, res) => {
  const groupid = req.query.groupid;
  const user = req.user;

  try {
    const group = await Group.findOne();
    const allUsersData = await group.getUsers({
      where: {
        id: {
          [Op.not]: user.id,
        },
      },
    });
    const users = allUsersData.map((ele) => {
      return {
        id: ele.id,
        name: ele.name,
      };
    });

    res.status(201).json(users);
  } catch (err) {
    console.log(err);
  }
};
