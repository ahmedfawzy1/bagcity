import Address from "../models/address.model.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { name, phone, flatHouse, area, city, pinCode, state } = req.body;

    if (!name || !phone || !flatHouse || !area || !city || !pinCode || !state) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const newAddress = new Address({
      user: req.user._id,
      name: name.trim(),
      phone: phone.trim(),
      flatHouse: flatHouse.trim(),
      area: area.trim(),
      city: city.trim(),
      pinCode: pinCode.trim(),
      state: state.trim(),
    });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { name, phone, flatHouse, area, city, pinCode, state } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (flatHouse) updateData.flatHouse = flatHouse.trim();
    if (area) updateData.area = area.trim();
    if (city) updateData.city = city.trim();
    if (pinCode) updateData.pinCode = pinCode.trim();
    if (state) updateData.state = state.trim();

    const address = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updateData, { new: true });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
