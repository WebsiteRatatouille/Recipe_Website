import Ebook from "../models/Ebook.js";

export const createEbook = async (req, res) => {
  try {
    const ebook = await Ebook.create(req.body);
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEbooks = async (req, res) => {
  try {
    const ebooks = await Ebook.find();
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEbookById = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: "Ebook not found" });
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
